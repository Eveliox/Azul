import { db } from './_lib/db.js'
import { authenticate,readJson } from './_lib/auth.js'
import { SETUP,MONTHLY } from '../src/components/servicePlan.js'
import { uuid } from './_lib/agent-policy.js'

export default async function handler(req,res) {
  try {
    const auth=await authenticate(req,res); if(!auth)return
    const body=readJson(req)
    const clientId=auth.role==='client'?auth.clientId:req.query.client_id || body.client_id
    const period=req.query.period || body.period
    if(!uuid(clientId) || !(period==='setup' || /^\d{4}-(0[1-9]|1[0-2])$/.test(period))) return res.status(400).json({error:'Invalid workspace or period.'})
    const client=await db().from('rb_clients').select('services,active').eq('id',clientId).single()
    if(client.error || !client.data.active)return res.status(403).json({error:'Workspace unavailable.'})
    const tasks=Object.entries(period==='setup'?SETUP:MONTHLY).filter(([service])=>auth.role==='master' || client.data.services.includes(service)).flatMap(([,items])=>items.map(t=>t.id))
    if(req.method==='GET') {
      const {data,error}=await db().from('rb_delivery_progress').select('task_id,completed_at').eq('client_id',clientId).eq('period',period)
      if(error)throw error
      return res.json({done:Object.fromEntries(data.filter(r=>tasks.includes(r.task_id)).map(r=>[r.task_id,r.completed_at]))})
    }
    if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'})
    if(!auth.userId)return res.status(403).json({error:'Sign in with an individual account to update shared progress.'})
    if(!tasks.includes(body.task_id) || typeof body.completed!=='boolean')return res.status(400).json({error:'Invalid task.'})
    const result=body.completed ? await db().from('rb_delivery_progress').upsert({client_id:clientId,period,task_id:body.task_id,completed_at:new Date().toISOString(),completed_by:auth.userId}) : await db().from('rb_delivery_progress').delete().eq('client_id',clientId).eq('period',period).eq('task_id',body.task_id)
    if(result.error)throw result.error
    return res.json({ok:true})
  }catch(error){console.error('progress_storage_failure',{code:error.code});return res.status(503).json({error:'Shared progress is unavailable. Check the database migration.'})}
}
