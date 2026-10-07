// Give an EXISTING Supabase Auth user a workspace or agency admin role.
// Does not create users, send messages, or print credentials.
// node --env-file=.env scripts/provision-member.mjs USER_UUID CLIENT_UUID
// node --env-file=.env scripts/provision-member.mjs USER_UUID --agency-admin
import { createClient } from '@supabase/supabase-js'
import { uuid } from '../api/_lib/agent-policy.js'
const [userId,scope]=process.argv.slice(2)
if(!uuid(userId) || !(uuid(scope) || scope==='--agency-admin'))throw Error('Usage: USER_UUID CLIENT_UUID | USER_UUID --agency-admin')
const db=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false}})
const {data,error}=await db.auth.admin.getUserById(userId)
if(error || !data.user)throw Error('Auth user not found')
const result=scope==='--agency-admin'?await db.from('rb_agency_admins').upsert({user_id:userId}):await db.from('rb_workspace_members').upsert({user_id:userId,client_id:scope,email:data.user.email})
if(result.error)throw Error('Provisioning failed: '+result.error.code)
console.log(scope==='--agency-admin'?'Agency administrator enabled.':'Workspace membership enabled.')
