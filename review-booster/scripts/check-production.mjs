// Run: node --env-file=.env scripts/check-production.mjs
// Read-only. Reports presence/readiness without printing any credentials or records.
import { createClient } from '@supabase/supabase-js'
import { readiness } from '../api/_lib/agent-policy.js'
const required=['SUPABASE_URL','SUPABASE_SERVICE_ROLE_KEY','VITE_SUPABASE_URL','VITE_SUPABASE_ANON_KEY','APP_URL','CRON_SECRET','OPENAI_API_KEY','OPENAI_AGENT_MODEL','AGENT_INPUT_USD_PER_MILLION','AGENT_OUTPUT_USD_PER_MILLION','RESEND_API_KEY','AGENT_EMAIL_FROM']
let failed=false
for(const name of required){const ok=Boolean(process.env[name]);console.log(`${ok?'OK':'MISSING'} ${name}`);if(!ok)failed=true}
console.log('Agent flags:',readiness())
if(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY){
 const db=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false},global:{fetch:(url,options)=>fetch(url,{...options,signal:AbortSignal.timeout(15000)})}})
 for(const table of ['rb_clients','rb_workspace_members','rb_agency_admins','rb_agent_settings','rb_agent_runs','rb_agent_events','rb_agent_budget','rb_delivery_progress','rb_worker_heartbeat']){
  const {error,count}=await db.from(table).select('*',{count:'exact',head:true})
  console.log(error?`UNAVAILABLE ${table} (${error.code || 'connection'})`:`OK ${table} (${count} rows)`)
  if(error)failed=true
 }
}
process.exitCode=failed?1:0
