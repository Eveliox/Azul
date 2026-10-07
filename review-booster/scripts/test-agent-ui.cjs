// Local browser check. Uses demo/fixture data; never run against a live business.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
(async()=>{
 const browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:1440,height:1050},reducedMotion:'reduce'});
 const errors=[],posts=[];page.on('pageerror',e=>errors.push(e.message));
 const client={client_id:'11111111-1111-4111-8111-111111111111',name:'Pilot Business',services:['agents','reviews','website','seo'],sent:4,rated:2};
 let settings={mode:'testing',reply_to:'team@example.com',monthly_limit:100,monthly_budget_cents:1000};
 let runs=[{id:'22222222-2222-4222-8222-222222222222',client_id:client.client_id,estimate_ref:'Q-100',customer_name:'Sample Customer',customer_email:'sample@example.com',estimate_summary:'Fence repair quoted. Customer requested details.',status:'awaiting_approval',subject:'A quick follow-up on your estimate',body:'Hi Sample, do you have any questions about the fence repair estimate?',created_at:new Date().toISOString(),updated_at:new Date().toISOString(),model:'test-model',input_tokens:240,output_tokens:80,estimated_cost_cents:.1}];
 await page.route('**/api/**',async route=>{
  const req=route.request(),url=new URL(req.url()),body=req.postDataJSON();let result={};
  if(url.pathname==='/api/clients')result={role:'master',clients:[client]};
  else if(url.pathname==='/api/requests')result={requests:[]};
  else if(url.pathname==='/api/progress')result={done:{}};
  else if(url.pathname==='/api/team')result={members:[]};
  else if(url.pathname==='/api/agents'){
   if(req.method()==='POST'){
    posts.push(body);
    if(body.action==='approve')runs=runs.map(r=>r.id===body.run_id?{...r,status:'approved',subject:body.subject,body:body.body,updated_at:new Date().toISOString()}:r);
    if(body.action==='create')runs.unshift({...body,id:body.request_key,status:'queued',created_at:new Date().toISOString(),updated_at:new Date().toISOString()});
    if(body.action==='settings')settings={...body,updated_at:new Date().toISOString()};
    result={ok:true};
   }else result={settings,runs,events:[],readiness:{worker_enabled:true,ai_configured:true,prices_configured:true,email_configured:true,sending_enabled:false},signed_in_user:true,can_manage:true,monthly_runs:runs.length,reserved_cents:3,last_worker_at:new Date().toISOString()};
  }
  await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(result)});
 });
 await page.goto(`${process.env.UI_TEST_ORIGIN || 'http://127.0.0.1:3014'}/admin`);await page.getByLabel('Workspace access key').fill('local-browser-test');await page.getByRole('button',{name:'Sign in to your workspace'}).click();
 await page.getByRole('button',{name:'Open AI agents plan',exact:true}).click();
 await page.getByLabel('Subject',{exact:true}).fill('Reviewed subject');await page.getByRole('textbox',{name:/^Message/}).fill('Reviewed exact body');
 await page.getByRole('button',{name:'Approve email',exact:true}).click();await page.getByText('Approved · queued',{exact:true}).waitFor();
 if(!posts.some(p=>p.action==='approve'&&p.subject==='Reviewed subject'&&p.body==='Reviewed exact body'))throw Error('Approval payload mismatch');
 await page.getByRole('button',{name:'Add estimate',exact:true}).click();
 await page.getByLabel('Estimate reference',{exact:true}).fill('Q-101');await page.getByLabel('Customer name',{exact:true}).fill('Another Sample');await page.getByLabel('Customer email',{exact:true}).fill('another@example.com');await page.getByLabel('Estimate facts',{exact:true}).fill('Requested quote for a replacement gate.');
 await page.getByRole('checkbox').check();await page.getByRole('button',{name:'Queue draft for review'}).click();await page.getByText('Queued for drafting',{exact:true}).waitFor();
 await page.getByRole('combobox',{name:/^Mode/}).selectOption('paused');await page.getByRole('button',{name:'Save controls'}).click();await page.waitForFunction(()=>document.querySelector('.agent-mode strong')?.textContent==='paused');
 if(await page.getByRole('button',{name:'Add estimate',exact:true}).isEnabled())throw Error('Paused intake enabled');
 await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:'/tmp/azul-operations-desktop.png',fullPage:true});
 for(const width of [390,760,1024]){await page.setViewportSize({width,height:844});if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Overflow '+width);if(width===390)await page.screenshot({path:'/tmp/azul-operations-mobile.png',fullPage:true});}
 if(errors.length)throw Error(errors.join('\n'));console.log('PASS mocked API browser flows: estimate intake, edited approval, pause, desktop/mobile layouts, no browser errors. No model or email calls.');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
