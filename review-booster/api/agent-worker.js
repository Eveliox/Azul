import { db } from './_lib/db.js'
import { requireCron } from './_lib/auth.js'
import { readiness, reserveCents } from './_lib/agent-policy.js'
import { draftEstimate, deliverEstimate } from './_lib/agent-provider.js'

export const config = { maxDuration: 60 }
export async function processAgentWork({ database=db(), env=process.env, draft=draftEstimate, deliver=deliverEstimate }={}) {
  const ready=readiness(env)
  if (!ready.worker_enabled || !ready.ai_configured || !ready.prices_configured) return {processed:0,disabled:true}
  const claim=await database.rpc('rb_claim_agent_work',{p_send:ready.sending_enabled && ready.email_configured,p_reserve:reserveCents(env),p_from:env.AGENT_EMAIL_FROM || ''})
  if(claim.error) throw claim.error
  const run=claim.data?.[0]
  if(!run) return {processed:0}
  let result
  try {
    // Recheck active subscription and pause state immediately before external work.
    const client=await database.from('rb_clients').select('name,active,services').eq('id',run.client_id).single()
    const settings=await database.from('rb_agent_settings').select('mode').eq('client_id',run.client_id).single()
    if(client.error || settings.error || !client.data.active || !client.data.services.includes('agents') || settings.data.mode==='paused' || (run.status==='sending' && settings.data.mode!=='active')) throw new Error('Agent paused or business access changed before execution.')
    result=run.status==='drafting' ? await draft(run,client.data,{env}) : await deliver(run,{env})
  } catch(error) {
    // Do not expose provider bodies (which may contain customer data or credentials).
    result={error:error.name==='TimeoutError' ? 'Provider timed out. A bounded retry is scheduled.' : error.message?.slice(0,300) || 'Provider request failed.',permanent:Boolean(error.permanent)}
  }
  const finish=await database.rpc('rb_finish_agent_work',{p_run:run.id,p_lease:run.lease_token,p_result:result})
  if(finish.error) throw finish.error
  return {processed:1,recorded:finish.data===true}
}
export default async function handler(req,res) {
  res.setHeader('Cache-Control','no-store')
  if(!['GET','POST'].includes(req.method)) return res.status(405).json({error:'Method not allowed'})
  // Worker secrets only in headers, never in query URLs or logs.
  if(req.query?.key) return res.status(401).json({error:'Use a bearer token.'})
  if(!requireCron(req,res)) return
  try { return res.json(await processAgentWork()) }
  catch(error) { console.error('agent_worker_failure',{code:error.code || 'unknown'}); return res.status(503).json({error:'Worker failed. Check storage and provider configuration.'}) }
}
