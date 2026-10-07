import test from 'node:test'
import assert from 'node:assert/strict'
import {processAgentWork} from '../api/agent-worker.js'
const env={AGENTS_ENABLED:'true',OPENAI_API_KEY:'test',OPENAI_AGENT_MODEL:'test',AGENT_INPUT_USD_PER_MILLION:'1',AGENT_OUTPUT_USD_PER_MILLION:'5',AGENTS_EMAIL_ENABLED:'true',RESEND_API_KEY:'test',AGENT_EMAIL_FROM:'test@example.com'}
function database(run,{paused=false,finishError=false}={}) {
 const calls=[]
 return {calls,async rpc(name,args){calls.push({name,args});return name==='rb_claim_agent_work'?{data:run?[run]:[]} : finishError?{error:{code:'connection'}}:{data:true}},from(table){const q={select(){return q},eq(){return q},async single(){return {data:table==='rb_clients'?{name:'Test',active:true,services:['agents']}:{mode:paused?'paused':'active'}}}};return q}}
}
test('disabled workers make no database claims or external calls',async()=>{
 const db=database({id:'run'});assert.deepEqual(await processAgentWork({database:db,env:{}}),{processed:0,disabled:true});assert.equal(db.calls.length,0)
})
test('draft worker stores provider result without calling delivery',async()=>{
 const db=database({id:'run',client_id:'client',lease_token:'lease',status:'drafting'});let sent=false
 await processAgentWork({database:db,env,draft:async()=>({subject:'Test',body:'Draft'}),deliver:async()=>{sent=true}})
 assert.equal(sent,false);assert.equal(db.calls[1].args.p_result.body,'Draft');assert.equal(db.calls[1].args.p_lease,'lease')
})
test('pause is rechecked before calling providers',async()=>{
 const db=database({id:'run',client_id:'client',lease_token:'lease',status:'sending'},{paused:true});let sent=false
 await processAgentWork({database:db,env,deliver:async()=>{sent=true}})
 assert.equal(sent,false);assert.match(db.calls[1].args.p_result.error,/paused/)
})
test('provider success with database failure surfaces failure for lease recovery',async()=>{
 const db=database({id:'run',client_id:'client',lease_token:'lease',status:'sending'},{finishError:true})
 await assert.rejects(()=>processAgentWork({database:db,env,deliver:async()=>({message_id:'accepted-id'})}))
 assert.equal(db.calls[1].args.p_result.message_id,'accepted-id')
})
