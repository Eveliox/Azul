import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { Icon } from './DashboardVisuals.jsx'
import AgentStudio from './AgentStudio.jsx'
import './agent-operations.css'

const LABELS={queued:'Queued for drafting',drafting:'Drafting',awaiting_approval:'Needs approval',approved:'Approved · queued',sending:'Sending / retry pending',sent:'Accepted by email provider',rejected:'Rejected',cancelled:'Cancelled',failed:'Draft failed',needs_attention:'Needs reconciliation'}
const BLANK={estimate_ref:'',customer_name:'',customer_email:'',estimate_summary:'',language:'en',contact_confirmed:false}
const DEMO={settings:{mode:'testing',reply_to:'',monthly_limit:100,monthly_budget_cents:1000},runs:[],events:[],readiness:{worker_enabled:false,ai_configured:false,prices_configured:false,email_configured:false,sending_enabled:false},signed_in_user:false,can_manage:false,monthly_runs:0,reserved_cents:0,last_worker_at:null}

export default function AgentOperations({client,demo,isMaster}) {
  const [data,setData]=useState(null),[error,setError]=useState(''),[loading,setLoading]=useState(true),[busy,setBusy]=useState(false),[message,setMessage]=useState('')
  const [showCreate,setShowCreate]=useState(false),[filter,setFilter]=useState('all'),[form,setForm]=useState({...BLANK,request_key:crypto.randomUUID()})
  const subscribed=client.services?.includes('agents')
  const [reload,setReload]=useState(0)
  useEffect(()=>{
    if(demo){setData(DEMO);setLoading(false);return}
    if(!subscribed){setLoading(false);return}
    let current=true
    const load=()=>api(`/api/agents?client_id=${encodeURIComponent(client.client_id)}`).then(d=>{if(current){setData(d);setError('')}}).catch(e=>{if(current)setError(e.message)}).finally(()=>{if(current)setLoading(false)})
    load()
    const interval=setInterval(()=>{if(document.visibilityState==='visible')load()},15000)
    return()=>{current=false;clearInterval(interval)}
  },[client.client_id,demo,subscribed,reload])
  async function act(body) {
    setBusy(true);setError('');setMessage('')
    try{await api('/api/agents',{method:'POST',body:{client_id:client.client_id,...body}});setReload(n=>n+1);setMessage(body.action==='approve'?'Message approved. Delivery waits for Active mode and the sending worker.':'Workspace updated.');return true}catch(e){setError(e.message);return false}finally{setBusy(false)}
  }
  const canAct=data?.signed_in_user && !demo
  const runs=data?.runs || []
  const visible=runs.filter(r=>filter==='all' || (filter==='approval'?r.status==='awaiting_approval':filter==='attention'?['failed','needs_attention'].includes(r.status):r.status==='sent'))
  const ready=data?.readiness || {}
  return <div className="agent-operations">
    <section className="agent-ops-hero"><div><p className="eyebrow">YOUR FIRST WORKING AGENT</p><h2>Every estimate.<br/>A thoughtful next step.</h2><p>Prepare a follow-up, review the words, and keep the conversation moving.</p></div><div className="agent-mode"><Icon name="agents" size={36}/><strong>{data?.settings.mode || 'Not enabled'}</strong><span>Email follow-up · approval required</span></div></section>
    {!subscribed && !demo ? <section className="panel empty-state"><h2>Add AI Agents to this plan</h2><p>{isMaster?'Enable Custom AI Agents under Workspace access to start.':'Ask Azul to enable Custom AI Agents for your business.'}</p></section> : <>
      {loading && <p className="panel" role="status">Loading agent operations…</p>}
      {error && <p className="error-banner" role="alert">{error} <button onClick={()=>setReload(n=>n+1)}>Retry</button></p>}
      {message && <p className="form-note" role="status">{message}</p>}
      {data && <>
        {!canAct && <p className="form-note">{demo?'Demo preview only. No model calls or emails are made.':'Sign in with an individual email account to add estimates and approve messages. Shared access keys are read-only here.'}</p>}
        <div className="agent-ops-stats">{[['Runs this month',data.monthly_runs],['Waiting for review',runs.filter(r=>r.status==='awaiting_approval').length],['AI budget reserved',`$${(data.reserved_cents/100).toFixed(2)}`],['Monthly AI budget',`$${(data.settings.monthly_budget_cents/100).toFixed(2)}`]].map(([label,value])=><div className="panel" key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>
        <p className="chart-footnote">Review counts use the latest 100 runs. Budget reserves cover model attempts, including retries; they are not billed totals. Email charges are separate.</p>
        <div className="agent-ops-layout"><div>
          <section className="panel"><div className="panel-heading"><div><h2>Estimates & approvals</h2><p>One follow-up per estimate reference. Replies go to your team’s inbox.</p></div><button className="btn-primary" disabled={!canAct || busy || data.settings.mode==='paused'} onClick={()=>setShowCreate(!showCreate)} aria-expanded={showCreate}><Icon name="plus" size={16}/>Add estimate</button></div>
          {showCreate && <form className="estimate-form" onSubmit={async e=>{e.preventDefault();if(await act({action:'create',...form})){setShowCreate(false);setForm({...BLANK,request_key:crypto.randomUUID()})}}}>
            {[['estimate_ref','Estimate reference',100],['customer_name','Customer name',120],['customer_email','Customer email',254]].map(([key,label,max])=><label className="label" key={key}>{label}<input className="input" required maxLength={max} type={key==='customer_email'?'email':'text'} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})}/></label>)}
            <label className="label">Message language<select className="input" value={form.language} onChange={e=>setForm({...form,language:e.target.value})}><option value="en">English</option><option value="es">Spanish</option></select></label>
            <label className="label estimate-wide">Estimate facts<textarea className="input" rows={4} required maxLength={3000} placeholder="What was quoted, any confirmed details, and the next step. Include no passwords or sensitive records." value={form.estimate_summary} onChange={e=>setForm({...form,estimate_summary:e.target.value})}/></label>
            <label className="checkbox-row estimate-wide"><input type="checkbox" required checked={form.contact_confirmed} onChange={e=>setForm({...form,contact_confirmed:e.target.checked})}/>This customer requested this estimate and may be contacted about it.</label>
            <button className="btn-primary" disabled={busy}>Queue draft for review</button><button type="button" className="btn-ghost" onClick={()=>setShowCreate(false)}>Close</button>
          </form>}
          <div className="service-filters agent-run-filters" role="group" aria-label="Filter agent runs">{[['all','All runs'],['approval','Needs approval'],['attention','Needs attention'],['sent','Sent']].map(([value,label])=><button key={value} className={filter===value?'selected':''} aria-pressed={filter===value} onClick={()=>setFilter(value)}>{label}</button>)}</div>
          {!visible.length?<div className="empty-state"><Icon name="send" size={28}/><h3>{runs.length?'No runs match this filter':'Your first follow-up starts here'}</h3><p>Add an estimate. The agent drafts a message for you to review before anything is sent.</p></div>:visible.map(run=><Run key={`${run.id}:${run.updated_at}`} run={run} busy={busy} canAct={canAct} act={act}/>)}
          </section>
          <section className="panel agent-events"><h2>Activity log</h2><p className="muted">Latest 50 recorded transitions, including approvals and provider outcomes.</p>{data.events.length?<ul>{data.events.map(event=><li key={event.id}><span><strong>{LABELS[event.action] || event.action}</strong><small>{event.actor_id?`Team member · ${event.actor_id.slice(0,8)}`:'Worker'}{event.run_id?` · Run ${event.run_id.slice(0,8)}`:''}</small></span><time dateTime={event.created_at}>{new Date(event.created_at).toLocaleString()}</time></li>)}</ul>:<p className="form-note">Activity appears here as your team and agent work.</p>}</section>
        </div><aside>
          <section className="panel"><h2>Connections & worker</h2><ul className="agent-readiness">{[['AI drafting',ready.ai_configured && ready.prices_configured],['Worker enabled',ready.worker_enabled],['Email configured',ready.email_configured],['Email sending enabled',ready.sending_enabled]].map(([name,on])=><li key={name}><span>{name}</span><strong className={on?'ready':''}>{on?'Configured':'Not ready'}</strong></li>)}</ul><p className="chart-footnote">Last worker check: {data.last_worker_at?new Date(data.last_worker_at).toLocaleString():'Not recorded'}. Configuration does not confirm provider connectivity.</p><p className="form-note">Manual estimate entry is available. CRM import and automatic reply detection are not connected.</p></section>
          <Settings key={`${data.settings.updated_at || 'default'}:${reload}`} settings={data.settings} disabled={!canAct || !data.can_manage || busy} act={act}/>
        </aside></div>
      </>}
    </>}
    <details className="agent-examples"><summary>Explore other agent roles</summary><AgentStudio/></details>
  </div>
}

function Run({run,busy,canAct,act}) {
  const [subject,setSubject]=useState(run.subject || ''),[body,setBody]=useState(run.body || '')
  return <article className="agent-run"><div className="agent-run-heading"><div><h3>{run.customer_name}</h3><p>{run.estimate_ref} · {run.customer_email}</p></div><span className={`status-pill status-${run.status==='awaiting_approval'?'pending':run.status==='sent'?'rated':'sent'}`}>{LABELS[run.status]}</span></div><p className="agent-estimate-facts">{run.estimate_summary}</p>
    {run.status==='awaiting_approval'?<form onSubmit={e=>{e.preventDefault();act({action:'approve',run_id:run.id,subject,body})}}><label className="label">Subject<input className="input" required maxLength={160} value={subject} onChange={e=>setSubject(e.target.value)}/></label><label className="label">Message<textarea className="input" required maxLength={4000} rows={7} value={body} onChange={e=>setBody(e.target.value)}/></label><p className="chart-footnote">Review the recipient, facts, and wording. Approval queues this exact message for delivery when the agent is Active.</p><div className="agent-run-actions"><button className="btn-primary" disabled={!canAct || busy}>Approve email</button><button type="button" className="btn-ghost" disabled={!canAct || busy} onClick={()=>act({action:'reject',run_id:run.id})}>Reject draft</button></div></form>:run.body && <details><summary>View message</summary><strong>{run.subject}</strong><p className="agent-message-body">{run.body}</p></details>}
    {run.last_error && <p className="error-banner">{run.last_error}</p>}
    <div className="agent-run-meta"><span>{new Date(run.created_at).toLocaleString()}</span>{run.model && <span>{run.input_tokens + run.output_tokens} tokens · estimated AI cost ${(Number(run.estimated_cost_cents)/100).toFixed(4)}</span>}</div>
    {canAct && run.status==='failed' && <button className="btn-ghost" disabled={busy} onClick={()=>act({action:'retry_draft',run_id:run.id})}>Retry drafting</button>}
    {canAct && ['queued','approved','failed','needs_attention'].includes(run.status) && <button className="text-button" disabled={busy} onClick={()=>act({action:'cancel',run_id:run.id})}>Cancel follow-up</button>}
    {run.provider_message_id && <p className="chart-footnote">Provider ID: {run.provider_message_id}. Accepted for sending; delivery and replies are not tracked here.</p>}
  </article>
}
function Settings({settings,disabled,act}) {
  const [form,setForm]=useState({...settings})
  return <form className="panel agent-settings" onSubmit={e=>{e.preventDefault();act({action:'settings',...form})}}><h2>Agent controls</h2><label className="label">Mode<select className="input" disabled={disabled} value={form.mode} onChange={e=>setForm({...form,mode:e.target.value})}><option value="testing">Testing · draft only</option><option value="active">Active · send approved emails</option><option value="paused">Paused</option></select></label><label className="label">Team reply-to email<input className="input" disabled={disabled} type="email" value={form.reply_to} onChange={e=>setForm({...form,reply_to:e.target.value})}/></label><label className="label">Monthly run limit<input className="input" disabled={disabled} type="number" min="1" max="1000" required value={form.monthly_limit} onChange={e=>setForm({...form,monthly_limit:Number(e.target.value)})}/></label><label className="label">Monthly AI budget (USD)<input className="input" disabled={disabled} type="number" min="0.01" max="1000" step="0.01" required value={form.monthly_budget_cents/100} onChange={e=>setForm({...form,monthly_budget_cents:Math.round(Number(e.target.value)*100)})}/></label><button className="btn-primary" disabled={disabled}>Save controls</button><p className="chart-footnote">Only an agency administrator can change controls. Pause stops new work; a provider request already in flight may complete. Budgets reset monthly in UTC.</p></form>
}
