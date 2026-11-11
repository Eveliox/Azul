// Local browser check of the Speed-to-Lead Agent page. Uses dev-server.js sample data; never run against a live business.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const origin=process.env.UI_TEST_ORIGIN || 'http://127.0.0.1:3014';
async function signIn(page,key){
  await page.goto(`${origin}/admin`);await page.getByLabel('Workspace access key').fill(key);await page.getByRole('button',{name:'Sign in to your workspace'}).click();
  await page.getByRole('button',{name:'Speed-to-Lead Agent'}).first().click();await page.getByRole('heading',{name:'Leads',exact:true}).waitFor();
}
const overflow=(page)=>page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
(async()=>{
  const browser=await chromium.launch({headless:true});const errors=[];
  // Azul (master): live list, filters, details, agent setup with hidden form key.
  const page=await browser.newPage({viewport:{width:1440,height:1000}});page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());
  await signIn(page,'dev-master-key-123');
  await page.getByText('Live',{exact:true}).waitFor();
  for(const text of ['Leads this month','Time to first call','Booked this month','Need you','Maria Lopez','Sofia Martinez'])await page.getByText(text,{exact:true}).first().waitFor();
  await page.getByRole('button',{name:'Needs you'}).click();
  if(await page.getByText('Maria Lopez',{exact:true}).count())throw Error('Needs-you filter still shows a booked lead');
  await page.getByText('Sofia Martinez',{exact:true}).waitFor();
  await page.getByRole('button',{name:'All leads'}).click();
  await page.locator('.lead-detail summary').first().click();await page.getByText('Booked a repair visit',{exact:false}).waitFor();
  await page.getByText('Your business details',{exact:true}).waitFor();
  await page.getByText('Call cost this month',{exact:false}).waitFor();
  await page.getByText('Agent setup',{exact:true}).click();
  await page.getByLabel('Call script').selectOption('azul');
  await page.getByText('Calendar ID not set (Azul)',{exact:true}).waitFor();
  await page.getByText('Preview the call script',{exact:true}).click();
  await page.getByText('You are calling Maria',{exact:false}).waitFor();
  await page.getByRole('button',{name:'Answering a callback'}).click();
  await page.getByText("Someone is calling the company's number",{exact:false}).waitFor();
  const key=page.getByLabel(/Form key/);if(await key.getAttribute('type')!=='password')throw Error('Form key is not hidden by default');
  await page.getByRole('button',{name:'Reveal'}).click();if(await key.getAttribute('type')!=='text')throw Error('Reveal does not show the key');
  await page.screenshot({path:'/tmp/azul-leads-desktop.png',fullPage:true});
  await page.getByRole('button',{name:'Stop calling'}).first().click();await page.getByText("won't call Daniel Rivera",{exact:false}).waitFor();
  await page.setViewportSize({width:390,height:844});if(await overflow(page))throw Error('Leads page overflows at phone width');
  await page.screenshot({path:'/tmp/azul-leads-mobile.png',fullPage:true});
  // Business team: sees leads, never the agent setup or form key.
  const team=await browser.newPage({viewport:{width:1280,height:900}});team.on('pageerror',e=>errors.push(e.message));
  await signIn(team,'demo-business-key-helloyou-12345678');
  await team.getByText('Maria Lopez',{exact:true}).first().waitFor();
  if(await team.getByText('Agent setup',{exact:true}).count())throw Error('Business team can see the agent setup');
  await team.getByText('Your business details',{exact:true}).click();
  await team.getByLabel('Your trade').waitFor();if(await team.getByLabel('Your trade').inputValue()!=='air conditioning')throw Error('Business details not loaded');
  await team.getByText('calendar@azulwebdev.com',{exact:true}).waitFor();
  await team.setViewportSize({width:390,height:844});if(await overflow(team))throw Error('Business details overflow at phone width');
  await team.screenshot({path:'/tmp/azul-business-details-mobile.png',fullPage:true});
  if(await team.getByLabel(/Form key/).count())throw Error('Business team can see the form key');
  // Owner controls: the team can open their settings; the cost line is Azul-only.
  await team.setViewportSize({width:1280,height:900});
  await team.getByRole('button',{name:'Change settings'}).click();await team.getByLabel('Your agent').waitFor();
  await team.getByLabel(/Lead alerts go to/).waitFor();
  if(await team.getByText('Call cost this month',{exact:false}).count())throw Error('Business team can see call costs');
  // Hosted form: public page, both languages, submits, fits a phone.
  const pub=await browser.newPage({viewport:{width:390,height:844}});pub.on('pageerror',e=>errors.push(e.message));
  await pub.goto(`${origin}/f/helloyou`);await pub.getByRole('heading',{name:'Request a callback'}).waitFor();
  await pub.getByText('I agree that Hello You Wellness Center may call',{exact:false}).waitFor();
  await pub.getByRole('button',{name:'Español'}).click();await pub.getByRole('heading',{name:'Solicite una llamada'}).waitFor();
  await pub.getByLabel('Su nombre').fill('Maria Lopez');await pub.getByLabel('Número de celular').fill('(305) 555-0100');
  await pub.getByRole('checkbox').check();await pub.getByRole('button',{name:'Solicitar una llamada'}).click();
  await pub.getByText('¡Gracias, Maria!',{exact:false}).waitFor();
  if(await overflow(pub))throw Error('Hosted form overflows at phone width');
  await pub.screenshot({path:'/tmp/azul-hosted-form.png',fullPage:true});
  await pub.goto(`${origin}/f/nope`);await pub.getByText('This form is not available.',{exact:false}).waitFor();
  if(errors.length)throw Error(errors.join('\n'));
  console.log('PASS speed-to-lead page: agent status, numbers, lead filters and details, stop calling, Azul-only setup with hidden form key, team view without setup, business details with calendar walkthrough, Azul template switch with gaps and script preview, owner settings, Azul-only costs, hosted form (EN/ES, submit, unknown slug), phone width.');
  await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
