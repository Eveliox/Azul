import test from 'node:test'
import assert from 'node:assert/strict'
import { validateEstimate,validateDraft,validateSettings,reserveCents,readiness } from '../api/_lib/agent-policy.js'
import { draftEstimate,deliverEstimate } from '../api/_lib/agent-provider.js'
const estimate={request_key:'11111111-1111-4111-8111-111111111111',estimate_ref:'Q-1',customer_name:'Test',customer_email:'test@example.com',estimate_summary:'Repair the gate as quoted.',language:'en',contact_confirmed:true}
test('estimate intake requires explicit contact confirmation, limits input and rejects malformed identities',()=>{
 assert.equal(validateEstimate(estimate).estimate_ref,'Q-1')
 for(const patch of [{contact_confirmed:false},{customer_email:'a@example.com,b@example.com'},{request_key:'bad'},{estimate_summary:'x'.repeat(3001)},{language:'fr'}])assert.throws(()=>validateEstimate({...estimate,...patch}))
 assert.throws(()=>validateDraft({subject:'Hello\nBcc: x@y.com',body:'hello'}))
})
test('activation requires a reply address and bounded budgets',()=>{
 const settings={mode:'active',reply_to:'team@example.com',monthly_limit:10,monthly_budget_cents:1000}
 assert.equal(validateSettings(settings).mode,'active')
 for(const patch of [{reply_to:''},{monthly_limit:1001},{monthly_budget_cents:0},{mode:'autonomous'}])assert.throws(()=>validateSettings({...settings,...patch}))
 assert.equal(readiness({}).sending_enabled,false)
 assert.throws(()=>reserveCents({}))
 assert.equal(reserveCents({AGENT_INPUT_USD_PER_MILLION:'1',AGENT_OUTPUT_USD_PER_MILLION:'5'}),3)
})
test('model only receives bounded facts and structured output; email and credentials are excluded',async()=>{
 let payload
 const result=await draftEstimate(estimate,{name:'Test Business'},{env:{OPENAI_API_KEY:'test-secret',OPENAI_AGENT_MODEL:'configured-model',AGENT_INPUT_USD_PER_MILLION:'1',AGENT_OUTPUT_USD_PER_MILLION:'5'},fetcher:async(url,options)=>{
  payload=JSON.parse(options.body)
  return {ok:true,json:async()=>({status:'completed',model:'configured-model',usage:{input_tokens:100,output_tokens:50},output:[{content:[{type:'output_text',text:JSON.stringify({subject:'Your gate estimate',body:'Any questions about the estimate?'})}]}]})}
 }})
 assert.equal(payload.store,false);assert.equal(payload.max_output_tokens,1000);assert.equal(payload.text.format.strict,true)
 assert.ok(!payload.input.includes(estimate.customer_email));assert.equal(result.input_tokens,100);assert.equal(result.estimated_cost_cents,.035)
})
test('refused or incomplete drafts never become approval-ready',async()=>{
 for(const status of ['incomplete','failed'])await assert.rejects(()=>draftEstimate(estimate,{name:'Test'},{env:{OPENAI_API_KEY:'x',OPENAI_AGENT_MODEL:'x'},fetcher:async()=>({ok:true,json:async()=>({status})})}))
})
test('email requires approval, enable flag and a fresh retry window; retries keep the same key and envelope',async()=>{
 const run={id:estimate.request_key,approved_by:'user',approved_at:new Date().toISOString(),first_send_at:new Date().toISOString(),envelope:{from:'Test <test@example.com>',to:'customer@example.com',subject:'Approved',text:'Approved wording',reply_to:'team@example.com'}}
 const calls=[],options={env:{AGENTS_EMAIL_ENABLED:'true',RESEND_API_KEY:'x'},fetcher:async(url,options)=>{calls.push(options);return{ok:true,json:async()=>({id:'provider-id'})}}}
 await deliverEstimate(run,options);await deliverEstimate(run,options)
 assert.equal(calls[0].headers['Idempotency-Key'],calls[1].headers['Idempotency-Key']);assert.equal(calls[0].body,calls[1].body)
 await assert.rejects(()=>deliverEstimate({...run,approved_by:null},options))
 await assert.rejects(()=>deliverEstimate({...run,first_send_at:new Date(Date.now()-21*3600000).toISOString()},options))
 await assert.rejects(()=>deliverEstimate(run,{...options,env:{RESEND_API_KEY:'x'}}))
 assert.equal(calls.length,2)
})
