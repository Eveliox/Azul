// Run with PLAYWRIGHT_MODULE pointing at an installed Playwright package.
// Local Vite preview supplies the site's fonts and existing HVAC photograph.
const fs = require('node:fs/promises'); const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
(async()=>{
 const browser=await chromium.launch();
 try {
  await fs.mkdir(path.resolve('public/videos'),{recursive:true});
  for (const variant of ['en-mobile','es-mobile','en','es']) {
   const lang = variant.slice(0,2), mobile = variant.endsWith('-mobile');
   const page=await browser.newPage({viewport:{width:1440,height:900}});
   console.log(lang, 'opening preview');
   await page.goto(process.env.FILM_PREVIEW_URL || 'http://localhost:5175', {waitUntil:'domcontentloaded'});
   console.log(lang, 'loading fonts');
   await page.evaluate(()=>document.fonts.ready);
   await page.addScriptTag({path:path.resolve('scripts/workflow-film-renderer.js')});
   console.log(lang, 'rendering 30-second film');
   const result=await page.evaluate(async ({lang,mobile})=>{
    const film=await window.createWorkflowFilm(lang,mobile);
    document.body.replaceChildren(film.canvas);
    film.draw(3.5); const poster=film.canvas.toDataURL('image/jpeg',.92).split(',')[1];
    const mime='video/webm;codecs=vp9';if(!MediaRecorder.isTypeSupported(mime))throw Error('VP9 recorder unavailable');
    const stream=film.canvas.captureStream(30);const recorder=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:mobile ? 2000000 : 3500000,videoKeyFrameIntervalDuration:250});
    const parts=[];recorder.ondataavailable=e=>parts.push(e.data);
    const done=new Promise(resolve=>recorder.onstop=resolve);film.draw(0);recorder.start();
    const start=performance.now();await new Promise(resolve=>{function tick(now){const t=(now-start)/1000;film.draw(Math.min(29.99,t));if(t<30)setTimeout(()=>tick(performance.now()),1000/30);else resolve()}tick(performance.now())});
    recorder.stop();await done;stream.getTracks().forEach(t=>t.stop());
    const blob=new Blob(parts,{type:mime});const data=await new Promise(resolve=>{const r=new FileReader();r.onload=()=>resolve(r.result.split(',')[1]);r.readAsDataURL(blob)});
    return {poster,data,fonts:document.fonts.check('20px "Inter Tight"')};
   },{lang,mobile});
   await fs.writeFile(`public/videos/azul-workflow-${variant}.webm`,Buffer.from(result.data,'base64'));
   await fs.writeFile(`public/videos/azul-workflow-${variant}.jpg`,Buffer.from(result.poster,'base64'));
   console.log(variant,'rendered',Math.round(Buffer.byteLength(result.data,'base64')/1024)+' KB','fonts:',result.fonts);await page.close();
  }
 } finally {await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
