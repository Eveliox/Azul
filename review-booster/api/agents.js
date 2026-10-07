import { db } from './_lib/db.js'
import { authenticate, readJson } from './_lib/auth.js'
import { AgentError, uuid, validateEstimate, validateDraft, validateSettings, readiness } from './_lib/agent-policy.js'

const PUBLIC_RUN = 'id,client_id,estimate_ref,customer_name,customer_email,estimate_summary,language,status,subject,body,created_by,approved_by,approved_at,draft_attempts,send_attempts,provider_message_id,last_error,model,input_tokens,output_tokens,reserved_cents,estimated_cost_cents,created_at,updated_at'
const defaults = { mode: 'testing', reply_to: '', monthly_limit: 100, monthly_budget_cents: 1000 }
function checked(result) { if (result.error) throw result.error; return result.data }
export default async function handler(req, res) {
  try {
    const auth = await authenticate(req,res)
    if (!auth) return
    const body = readJson(req)
    const clientId = auth.role === 'client' ? auth.clientId : req.query.client_id || body.client_id
    if (!uuid(clientId)) throw new AgentError('Select a valid business.')
    const client = checked(await db().from('rb_clients').select('id,name,active,services').eq('id',clientId).maybeSingle())
    if (!client?.active || !client.services.includes('agents')) throw new AgentError('AI Agents is not enabled for this business.',403)
    const config = checked(await db().from('rb_agent_settings').select('*').eq('client_id',clientId).maybeSingle()) || defaults
    if (req.method === 'GET') {
      const [runs, events, usage, heartbeat] = await Promise.all([
        db().from('rb_agent_runs').select(PUBLIC_RUN).eq('client_id',clientId).order('created_at',{ascending:false}).limit(100),
        db().from('rb_agent_events').select('id,run_id,action,actor_id,created_at').eq('client_id',clientId).order('created_at',{ascending:false}).limit(50),
        db().rpc('rb_agent_usage',{p_client:clientId}),
        db().from('rb_worker_heartbeat').select('last_seen_at').eq('name','estimate-follow-up').maybeSingle(),
      ])
      return res.json({ settings: config, runs: checked(runs), events: checked(events), readiness: readiness(), signed_in_user: Boolean(auth.userId), can_manage: auth.role==='master', ...checked(usage), last_worker_at: checked(heartbeat)?.last_seen_at || null })
    }
    if (req.method !== 'POST') return res.status(405).json({error:'Method not allowed'})
    if (!auth.userId) throw new AgentError('Sign in with your individual email account to operate agents.',403)
    if (body.action==='settings') {
      if (auth.role!=='master') throw new AgentError('Only an agency administrator can change agent settings.',403)
      const settings=validateSettings(body)
      const ready=readiness()
      if (settings.mode==='active' && !Object.values(ready).every(Boolean)) throw new AgentError('Configure AI, pricing, email delivery, and the worker before activation.',409)
      checked(await db().rpc('rb_update_agent_settings',{p_client:clientId,p_actor:auth.userId,p_data:settings}))
      return res.json({ok:true})
    }
    if (body.action==='create') {
      const data=validateEstimate(body)
      const run=checked(await db().rpc('rb_create_agent_run',{p_client:clientId,p_actor:auth.userId,p_data:data}))
      return res.status(201).json({id:run.id})
    }
    if (!uuid(body.run_id) || !['approve','reject','cancel','retry_draft'].includes(body.action)) throw new AgentError('Invalid agent action.')
    const draft=body.action==='approve' ? validateDraft(body) : {}
    checked(await db().rpc('rb_agent_action',{p_client:clientId,p_run:body.run_id,p_actor:auth.userId,p_action:body.action,p_subject:draft.subject || null,p_body:draft.body || null}))
    return res.json({ok:true})
  } catch(error) {
    if (error instanceof AgentError) return res.status(error.status).json({error:error.message})
    if (error.code==='23505') return res.status(409).json({error:'This estimate reference already has a follow-up. Check its existing run.'})
    if (error.code==='P0001') return res.status(409).json({error:error.message})
    console.error('agent_api_failure',{code:error.code || 'unknown'})
    return res.status(503).json({error:'Agent storage is unavailable. Check the production migrations and retry.'})
  }
}
