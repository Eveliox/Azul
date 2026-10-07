// Local browser check. Uses demo/fixture data; never run against a live business.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
(async()=>{
 const browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`${process.env.UI_TEST_ORIGIN || 'http://127.0.0.1:3014'}/admin`);await page.getByLabel('Workspace access key').fill('dev-master-key-123');await page.getByRole('button',{name:'Sign in to your workspace'}).click();
 await page.getByRole('button',{name:'Open reviews',exact:true}).click();await page.getByRole('heading',{name:'Request activity'}).waitFor();
 await page.getByRole('button',{name:'New request',exact:true}).click();const box=await page.getByRole('dialog').boundingBox();if(!box||box.x<100||box.y<0)throw Error('Dialog centering broken');await page.keyboard.press('Escape');
 await page.getByRole('button',{name:'Messages',exact:true}).click();await page.getByRole('heading',{name:'First message',exact:true}).waitFor();
 await page.setViewportSize({width:390,height:844});if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Messages overflow');
 await page.route('**/api/review/**',route=>route.fulfill({contentType:'application/json',body:JSON.stringify({business:'Sample Business',language:'en',google_review_url:'https://example.com',already_rated:false})}));
 await page.goto(`${process.env.UI_TEST_ORIGIN || 'http://127.0.0.1:3014'}/r/test`);await page.getByRole('heading',{name:'How was your visit?'}).waitFor();await page.getByRole('button',{name:'3 Okay'}).click();await page.getByRole('heading',{name:'Thanks for your honesty.'}).waitFor();
 await page.screenshot({path:'/tmp/azul-review-regression.png'});if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Review overflow');
 if(errors.length)throw Error(errors.join('\n'));console.log('PASS existing review charts, request dialog, messages editor, public feedback route, and mobile layouts.');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
