import { db } from './_lib/db.js'
import { authenticate,readJson } from './_lib/auth.js'
import { validEmail,uuid } from './_lib/agent-policy.js'
export default async function handler(req,res) {
  try {
    const auth=await authenticate(req,res);if(!auth)return
    if(auth.role!=='master' || !auth.userId)return res.status(403).json({error:'Sign in with an individual agency administrator account to manage members.'})
    const body=readJson(req), clientId=req.query.client_id || body.client_id
    if(!uuid(clientId))return res.status(400).json({error:'Invalid business.'})
    if(req.method==='GET') {
      const {data,error}=await db().from('rb_workspace_members').select('user_id,email,created_at').eq('client_id',clientId)
      if(error)throw error
      return res.json({members:data})
    }
    if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'})
    if(body.action==='remove' && uuid(body.user_id)) {
      const {error}=await db().from('rb_workspace_members').delete().eq('client_id',clientId).eq('user_id',body.user_id)
      if(error)throw error
      return res.json({ok:true})
    }
    if(body.action!=='invite' || !validEmail(body.email))return res.status(400).json({error:'Enter a valid email address.'})
    // generateLink creates an invitation without sending email. The administrator
    // explicitly copies and shares the private link through their chosen channel.
    const appUrl=new URL(process.env.APP_URL)
    if(appUrl.protocol!=='https:')throw new Error('HTTPS APP_URL required')
    const email=body.email.trim().toLowerCase()
    let invitation=await db().auth.admin.generateLink({type:'invite',email,options:{redirectTo:`${appUrl.origin}/admin`}})
    if (['email_exists','user_already_exists'].includes(invitation.error?.code)) invitation=await db().auth.admin.generateLink({type:'magiclink',email,options:{redirectTo:`${appUrl.origin}/admin`}})
    if(invitation.error)throw invitation.error
    const {data}=invitation
    const result=await db().from('rb_workspace_members').upsert({client_id:clientId,user_id:data.user.id,email})
    if(result.error)throw result.error
    return res.json({invite_url:data.properties.action_link})
  }catch(error){console.error('team_api_failure',{code:error.code || 'unknown'});return res.status(503).json({error:'Team management is unavailable. Check authentication setup and database migrations.'})}
}
