/* Azul workflow film. Every frame is deterministic for reversible scroll scrubbing.
   Layouts use the site's paper / ink / blue, square frames and type families. */
window.createWorkflowFilm = async function (lang, mobile = false) {
  const es = lang === 'es'
  const canvas = document.createElement('canvas')
  canvas.width = mobile ? 720 : 1440; canvas.height = mobile ? 700 : 810
  const ctx = canvas.getContext('2d', { alpha: false })
  const W = canvas.width, H = canvas.height
  const C = { paper:'#f6f7f9', ink:'#17202a', blue:'#3154cf', tint:'#e7edff', muted:'#657183', line:'#d9dee6', white:'#fff' }
  const photo = new Image(); photo.src = '/images/svc-hvac.jpg'; await photo.decode()
  const logo = new Image(); logo.src = '/Azul%20Gradient%20Ribbon%20Logo.png'; await logo.decode()
  await document.fonts.ready
  const choose = (en, spanish) => es ? spanish : en
  const short = choose(['Attract.','Answer.','Understand.','Book.','Follow through.','Grow.'], ['Atraer.','Responder.','Entender.','Agendar.','Dar seguimiento.','Crecer.'])
  const headlines = choose(['A first impression\nthat opens doors.','A real conversation.\nRight on time.','Every detail.\nAlready organized.','From interested\nto on the calendar.','Great work deserves\nto be talked about.','One inquiry.\nOne connected system.'], ['Una primera impresión\nque abre puertas.','Una conversación.\nEn el momento.','Cada detalle.\nTodo organizado.','De una consulta\na tu calendario.','Un buen trabajo\nmerece ser conocido.','Una consulta.\nUn sistema conectado.'])
  const mobileTitles = choose(['A new inquiry.','The agent calls.','The details are ready.','The estimate is booked.','The follow-up is sent.','All working together.'], ['Una nueva consulta.','El agente llama.','Los detalles, listos.','El estimado, agendado.','El seguimiento, enviado.','Todo conectado.'])
  const labels = choose(['WEBSITE','AI CALL','QUALIFY','BOOK','REVIEWS','CONNECTED'], ['SITIO WEB','LLAMADA IA','CALIFICAR','AGENDAR','RESEÑAS','CONECTADO'])
  const statuses = choose(['NEW INQUIRY','CALL CONNECTED','DETAILS CAPTURED','ESTIMATE BOOKED','REVIEW REQUESTED','CONNECTED BY AZUL'], ['NUEVA CONSULTA','LLAMADA CONECTADA','DATOS RECOPILADOS','ESTIMADO AGENDADO','RESEÑA SOLICITADA','CONECTADO POR AZUL'])
  const clamp = n => Math.max(0, Math.min(1, n))
  const ease = n => 1 - (1 - clamp(n)) ** 3
  const mix = (a,b,n) => a+(b-a)*n
  function box(x,y,w,h,fill=C.white,stroke=null,shadow=false) {
    if(shadow){ ctx.fillStyle=C.ink;ctx.fillRect(x+5,y+5,w,h) }
    ctx.fillStyle=fill;ctx.fillRect(x,y,w,h)
    if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1;ctx.strokeRect(x+.5,y+.5,w-1,h-1)}
  }
  function line(x,y,x2,y2,color=C.line,width=1) {ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x2,y2);ctx.stroke()}
  function circle(x,y,r,fill,stroke=null) {ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1;ctx.stroke()}}
  function text(s,x,y,size=24,color=C.ink,font='Inter Tight',weight=400) {ctx.font=`${weight} ${size}px "${font}",Arial`;ctx.fillStyle=color;ctx.fillText(s,x,y)}
  function mono(s,x,y,size=12,color=C.muted){text(s,x,y,size,color,'IBM Plex Mono')}
  function wrap(s,x,y,width,size=24,color=C.ink,leading=1.35) {
    let row='',dy=y
    for(const word of s.split(' ')){ctx.font=`400 ${size}px "Inter Tight",Arial`;if(ctx.measureText(row+word).width>width&&row){text(row.trim(),x,dy,size,color);row='';dy+=size*leading}row+=word+' '}
    text(row.trim(),x,dy,size,color);return dy
  }
  function multiline(s,x,y,size,color=C.ink,leading=1.15){s.split('\n').forEach((t,i)=>text(t,x,y+i*size*leading,size,color))}
  function fit(s,x,y,maxWidth,size,color=C.ink){ctx.font=`400 ${size}px "Inter Tight",Arial`;while(ctx.measureText(s).width>maxWidth&&size>20){size--;ctx.font=`400 ${size}px "Inter Tight",Arial`}text(s,x,y,size,color)}
  function enter(q,start,fn,duration=.65){const p=ease((q-start)/duration);if(p<=0)return;ctx.save();ctx.globalAlpha*=p;ctx.translate(0,(1-p)*14);fn(p);ctx.restore()}
  function icon(type,x,y,size=24,color=C.blue){
    ctx.save();ctx.translate(x,y);ctx.scale(size/24,size/24);ctx.strokeStyle=color;ctx.lineWidth=1.5;ctx.lineCap='square';ctx.lineJoin='miter';ctx.beginPath()
    if(type==='check'){ctx.moveTo(4,12);ctx.lineTo(10,18);ctx.lineTo(21,5)}
    else if(type==='arrow'){ctx.moveTo(4,12);ctx.lineTo(20,12);ctx.moveTo(13,5);ctx.lineTo(20,12);ctx.lineTo(13,19)}
    else if(type==='phone'){ctx.moveTo(6,3);ctx.lineTo(10,8);ctx.lineTo(7,11);ctx.quadraticCurveTo(10,16,14,17);ctx.lineTo(17,14);ctx.lineTo(22,18);ctx.quadraticCurveTo(21,24,15,21);ctx.quadraticCurveTo(4,17,3,7);ctx.lineTo(6,3)}
    else if(type==='calendar'){ctx.rect(3,5,18,16);ctx.moveTo(3,10);ctx.lineTo(21,10);ctx.moveTo(8,2);ctx.lineTo(8,7);ctx.moveTo(16,2);ctx.lineTo(16,7);ctx.moveTo(8,15);ctx.lineTo(11,18);ctx.lineTo(17,13)}
    else if(type==='web'){ctx.rect(2,3,20,18);ctx.moveTo(2,8);ctx.lineTo(22,8);ctx.moveTo(5,5.5);ctx.lineTo(8,5.5);ctx.moveTo(6,12);ctx.lineTo(13,12);ctx.moveTo(6,16);ctx.lineTo(17,16)}
    else if(type==='star'){for(let i=0;i<10;i++){const a=i*Math.PI/5-Math.PI/2,r=i%2?4.5:10;const px=12+Math.cos(a)*r,py=12+Math.sin(a)*r;if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py)}ctx.closePath()}
    else{ctx.moveTo(12,2);ctx.lineTo(12,22);ctx.moveTo(2,12);ctx.lineTo(22,12);ctx.moveTo(5,5);ctx.lineTo(19,19);ctx.moveTo(19,5);ctx.lineTo(5,19)}
    ctx.stroke();ctx.restore()
  }
  function cover(image,x,y,w,h){const ratio=Math.max(w/image.width,h/image.height),iw=image.width*ratio,ih=image.height*ratio;ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();ctx.drawImage(image,x+(w-iw)/2,y+(h-ih)/2,iw,ih);ctx.restore()}
  function chrome(x,y,w,title){box(x,y,w,35,C.paper,C.line);[0,1,2].forEach(i=>circle(x+15+i*12,y+17,2.5,'#a6b1bf'));mono(title,x+74,y+22,10);icon('arrow',x+w-25,y+11,13,C.muted)}
  function pill(s,x,y,w,active=false){box(x,y,w,30,active?C.blue:C.tint);mono(s,x+10,y+20,11,active?C.white:C.blue)}
  function person(x,y,small=false){const size=small?30:42;box(x,y,size,size,C.tint);text('AM',x+7,y+size*.67,small?13:18,C.blue);text('Alex Morgan',x+size+12,y+size*.43,small?17:23);text('Coral Gables · 33134',x+size+12,y+size*.95,small?11:14,C.muted)}
  function connector(x,y,x2,y2,q,start=0){line(x,y,x2,y2,C.line,2);const p=clamp((q-start)/1);if(p>0){line(x,y,mix(x,x2,p),mix(y,y2,p),C.blue,2);box(mix(x,x2,p)-4,mix(y,y2,p)-4,8,8,C.blue)}}
  function button(s,x,y,w,h=45,active=false){box(x,y,w,h,active?C.ink:C.blue);text(s,x+17,y+h*.66,18,C.white);icon(active?'check':'arrow',x+w-34,y+(h-20)/2,20,C.white)}
  function waveform(x,y,w,h,q,bars=42){for(let i=0;i<bars;i++){const envelope=Math.sin(Math.PI*i/(bars-1));const a=.15+Math.abs(Math.sin(i*.63-q*4)*Math.cos(i*.27+q*2.4))*.85;const size=8+envelope*a*h;box(x+i*w/bars,y-size/2,Math.max(3,w/bars-6),size,C.blue)}}
  function cursor(x,y,q){ctx.save();ctx.translate(x,y);ctx.fillStyle=C.ink;ctx.strokeStyle=C.white;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(3,25);ctx.lineTo(10,18);ctx.lineTo(18,27);ctx.lineTo(23,23);ctx.lineTo(15,15);ctx.lineTo(26,13);ctx.closePath();ctx.fill();ctx.stroke();if(q>0&&q<.7){ctx.strokeStyle=C.blue;ctx.globalAlpha=1-q/.7;ctx.beginPath();ctx.arc(4,5,10+q*25,0,Math.PI*2);ctx.stroke()}ctx.restore()}

  function background(stage,q){
    box(0,0,W,H,C.paper)
    if(mobile){mono('AZUL / '+labels[stage],34,39,19,C.blue);fit(mobileTitles[stage],34,105,652,49);return}
    for(let x=32;x<W;x+=24)for(let y=88;y<728;y+=24)box(x,y,1,1,'#17202a12')
    ctx.drawImage(logo,48,19,65,40);mono(choose('ONE INQUIRY. EVERY NEXT STEP.','UNA CONSULTA. CADA SIGUIENTE PASO.'),143,44,12)
    mono(choose('ILLUSTRATIVE WORKFLOW / EN + ES','EJEMPLO DEL PROCESO / EN + ES'),1070,44,10)
    line(48,76,1392,76)
    box(48,123,43,32,C.tint,C.line);mono('0'+(stage+1),60,145,13,C.blue)
    mono(labels[stage],107,145,12,C.blue)
    fit(short[stage],48,225,335,52)
    multiline(headlines[stage],49,281,23,C.muted,1.4)
    // A single lead identity persists through the whole film.
    box(48,511,328,166,C.white,C.line)
    person(67,532,true);line(67,581,356,581)
    box(67,603,5,5,C.blue);mono(statuses[stage],83,610,10,C.blue)
    mono(choose('WEBSITE → YOUR BUSINESS','SITIO WEB → TU NEGOCIO'),67,649,10)
    line(48,727,1392,727)
    const steps=choose(['Website','AI call','Qualified','Booked','Follow-up','Connected'],['Sitio web','Llamada IA','Calificado','Agendado','Seguimiento','Conectado'])
    steps.forEach((s,i)=>{const x=48+i*226;circle(x+10,764,9,i<=stage?C.blue:C.paper,i<=stage?C.blue:C.line);if(i<stage)icon('check',x+4,758,11,C.white);else if(i===stage)circle(x+10,764,3,C.white);text(s,x+28,771,16,i===stage?C.blue:C.muted);if(i<5)line(x+140,764,x+205,764,i<stage?C.blue:C.line)})
    box(48,800,1344,2,C.line);box(48,800,1344*(stage+q/5)/6,2,C.blue)
  }

  function site(q){
    // The browser itself is the first piece of the system, not a backdrop slide.
    ctx.save();ctx.translate(428,134);ctx.rotate(-.012*(1-ease(q/4)))
    box(5,5,811,522,C.ink);box(0,0,811,522,C.white,C.ink);chrome(0,0,811,'yourbusiness.com')
    mono(choose('YOUR COMPANY / AIR & HOME','TU COMPAÑÍA / AIRE Y HOGAR'),24,67,13,C.ink);mono('EN / ES',699,67,11)
    cover(photo,16,89,779,333);box(16,89,779,333,'#17202a80')
    multiline(choose('Comfort,\nback where it belongs.','Tu hogar.\nCómodo otra vez.'),45,180,44,C.white,1.1)
    text(choose('Local AC experts. Ready when you need us.','Expertos en aire. Cuando nos necesitas.'),46,299,17,C.white)
    button(choose('Request an estimate','Solicita un estimado'),45,334,263,46,q>1.3)
    mono(choose('AC REPAIR     INSTALLATION     MAINTENANCE','REPARACIÓN     INSTALACIÓN     MANTENIMIENTO'),36,467,11)
    line(36,485,775,485);text(choose('South Florida. English & Spanish.','Sur de Florida. Inglés y español.'),36,509,13,C.muted)
    const p=ease(q/1.3);cursor(mix(700,269,p),mix(455,361,p),q-1.3)
    ctx.restore()
    // The form receipt travels forward from the website into the lead system.
    enter(q,1.35,()=>{
      const p=ease((q-1.35)/1.2),x=mix(690,975,p),y=mix(360,389,p)
      box(x,y,378,258,C.white,C.ink,true);box(x,y,378,4,C.blue)
      mono(choose('INQUIRY RECEIVED','CONSULTA RECIBIDA'),x+23,y+35,12,C.blue);person(x+23,y+58,true)
      line(x+23,y+111,x+355,y+111)
      wrap(choose('“My AC stopped cooling.”','“Mi aire dejó de enfriar.”'),x+23,y+149,320,24)
      pill(choose('CONNECTED TO AZUL','CONECTADO A AZUL'),x+23,y+200,332,true)
    })
  }
  function call(q){
    // Caller card, voice waveform and transcript form one working interface.
    box(435,131,899,531,C.white,C.ink,true);chrome(435,131,899,choose('azul / voice workspace','azul / espacio de voz'))
    box(436,166,307,495,'#eef2f9');person(459,200)
    circle(589,374,87,null,C.line);circle(589,374,69,null,'#c8d4ee')
    const pulse=(q*.7)%1;circle(589,374,71+pulse*18,null,`rgba(49,84,207,${(1-pulse)*.4})`)
    box(551,336,76,76,C.blue);icon('phone',574,358,31,C.white)
    text(choose('Calling Alex','Llamando a Alex'),468,515,27)
    mono('00:'+String(Math.floor(q*8+2)).padStart(2,'0'),468,551,16,C.blue)
    pill(choose('ENGLISH + SPANISH','INGLÉS + ESPAÑOL'),459,592,259)
    mono(choose('LIVE CONVERSATION','CONVERSACIÓN EN CURSO'),776,205,12,C.blue)
    waveform(779,254,514,57,q)
    enter(q,.15,()=>{box(777,304,518,126,C.tint);mono('AZUL AI',797,332,11,C.blue);wrap(choose('Hi Alex. What’s happening with your AC?','Hola Alex. ¿Qué pasa con tu aire acondicionado?'),797,366,470,25)})
    enter(q,1.2,()=>{box(814,452,481,105,C.paper,C.line);mono('ALEX MORGAN',835,479,11);wrap(choose('It stopped cooling this afternoon.','Dejó de enfriar esta tarde.'),835,514,434,24)})
    enter(q,2.8,()=>{icon('check',779,598,18);text(choose('Details ready to capture','Listo para recopilar detalles'),809,615,21)})
  }
  function qualify(q){
    box(435,131,899,531,C.white,C.ink,true);chrome(435,131,899,choose('azul / lead workspace','azul / espacio de clientes'))
    box(436,167,215,494,C.paper);mono(choose('CUSTOMER','CLIENTE'),459,202,11);box(460,227,54,54,C.tint);text('AM',471,262,24,C.blue);text('Alex Morgan',459,319,24);text('Coral Gables',459,351,17,C.muted);pill(choose('NEW LEAD','NUEVO CLIENTE'),459,384,169)
    mono(choose('SOURCE','ORIGEN'),459,467,11);text(choose('Website form','Formulario web'),459,498,17);text(choose('Captured by Azul','Recibido por Azul'),459,529,14,C.muted)
    text(choose('Ready for your team.','Listo para tu equipo.'),686,219,33)
    const rows=choose([['SERVICE','AC repair'],['LOCATION','Coral Gables · 33134'],['URGENCY','Stopped cooling today']],[['SERVICIO','Reparación de aire'],['UBICACIÓN','Coral Gables · 33134'],['URGENCIA','Dejó de enfriar hoy']])
    rows.forEach(([label,value],i)=>{const y=252+i*105;box(685,y,613,91,C.paper,C.line);mono(label,706,y+26,11);enter(q,.25+i*.65,()=>{text(value,706,y+64,27);box(1253,y+28,28,28,C.tint);icon('check',1258,y+33,19)})})
    enter(q,2.5,()=>{button(choose('Send to your calendar','Enviar a tu calendario'),685,590,613,45);cursor(1210,611,q-2.8)})
  }
  function booking(q){
    box(435,131,899,531,C.white,C.ink,true);chrome(435,131,899,choose('azul / your calendar','azul / tu calendario'))
    text(choose('Your week. One less thing to chase.','Tu semana. Un pendiente menos.'),461,211,29)
    const days=choose(['MON','TUE','WED','THU','FRI'],['LUN','MAR','MIÉ','JUE','VIE'])
    days.forEach((day,i)=>{const xx=479+i*164;mono(day,xx+53,255,12,i===2?C.blue:C.muted);for(let j=0;j<4;j++)box(xx,277+j*79,157,74,i===2? '#f0f4ff':C.paper,C.line)})
    // Existing appointments lend context without inventing client metrics.
    box(484,361,146,34,'#e1e6ee');box(1140,440,146,34,'#e1e6ee');box(976,519,146,34,'#e1e6ee')
    enter(q,.25,()=>{const p=ease((q-.25)/1.8),xx=mix(1028,807,p),yy=mix(220,356,p);box(xx+4,yy+4,157,151,C.ink);box(xx,yy,157,151,C.blue);mono('10:00 AM',xx+13,yy+30,15,C.white);text('Alex Morgan',xx+13,yy+66,20,C.white);text(choose('AC estimate','Estimado de AC'),xx+13,yy+98,16,C.white);icon('check',xx+13,yy+118,19,C.white)})
    enter(q,2.15,()=>{box(652,598,637,49,C.ink);icon('check',670,612,21,C.white);text(choose('Booked. Confirmation sent to Alex.','Agendado. Confirmación enviada a Alex.'),706,629,21,C.white)})
  }
  function review(q){
    box(435,175,390,420,C.white,C.ink,true);mono(choose('AFTER THE JOB','DESPUÉS DEL TRABAJO'),460,211,12,C.blue);person(460,238)
    box(461,320,338,83,C.paper,C.line);icon('check',480,345,27);text(choose('Job complete','Trabajo terminado'),523,370,24)
    enter(q,.65,()=>{mono(choose('NEXT ACTION','SIGUIENTE ACCIÓN'),460,447,11);text(choose('Ask for a review.','Pedir una reseña.'),460,491,29);pill(choose('AUTOMATIC FOLLOW-UP','SEGUIMIENTO AUTOMÁTICO'),460,532,338,true)})
    connector(830,387,885,387,q,.9)
    enter(q,1.15,()=>{
      box(893,132,419,530,C.white,C.ink,true);chrome(893,132,419,choose('messages / Alex','mensajes / Alex'))
      box(916,184,372,59,C.paper);text(choose('Your company','Tu compañía'),936,221,21);mono('SMS',1239,220,11,C.blue)
      box(916,267,372,263,C.tint)
      wrap(choose('Thanks, Alex. How did we do?','Gracias, Alex. ¿Cómo nos fue?'),940,312,325,28)
      wrap(choose('Share your experience on Google.','Comparte tu experiencia en Google.'),940,402,325,23,C.muted)
      line(940,458,1263,458,'#b8c7ee');text(choose('Leave a review','Deja una reseña'),940,498,23,C.blue);icon('arrow',1234,478,24)
      mono(choose('DELIVERED','ENTREGADO'),1166,558,10);icon('check',1266,547,14)
      text(choose('Your work. A lasting impression.','Tu trabajo deja una impresión.'),916,620,18,C.muted)
    })
  }
  function overview(q){
    const nodes=[['web',choose('Your website','Tu sitio web')],['phone',choose('Your agent','Tu agente')],['calendar',choose('Your calendar','Tu calendario')],['star',choose('Your reputation','Tu reputación')]]
    const locs=[[456,172],[933,172],[933,422],[456,422]]
    connector(834,276,933,276,q,.2);connector(1122,370,1122,422,q,.8);connector(933,518,834,518,q,1.4)
    nodes.forEach(([symbol,label],i)=>{const [xx,yy]=locs[i];const active=q>i*.5;box(xx,yy,378,192,C.white,active?C.blue:C.line,true);box(xx+22,yy+24,46,46,active?C.blue:C.tint);icon(symbol,xx+33,yy+35,24,active?C.white:C.blue);mono('0'+(i+1),xx+317,yy+52,12,C.muted);text(label,xx+22,yy+122,31);text(choose(['Inquiry received','Conversation started','Estimate booked','Review requested'][i],['Consulta recibida','Conversación iniciada','Estimado agendado','Reseña solicitada'][i]),xx+22,yy+160,17,C.muted)})
    enter(q,2.4,()=>{box(771,347,224,77,C.ink);box(781,357,68,50,C.white);ctx.drawImage(logo,786,361,58,38);text(choose('Connected.','Conectado.'),857,391,22,C.white)})
  }

  function mobileScene(stage,q){
    const x=34,y=143,w=646,h=478
    box(x,y,w,h,C.white,C.ink,true)
    if(stage===0){
      cover(photo,35,144,644,160);box(35,144,644,160,'#17202a77');mono(choose('YOUR COMPANY / AC','TU COMPAÑÍA / AC'),59,184,20,C.white)
      text(choose('Comfort starts here.','Tu comodidad empieza aquí.'),59,239,35,C.white)
      text(choose('Request an estimate ↗','Solicita un estimado ↗'),59,280,27,C.white)
      person(59,333)
      text(choose('“My AC stopped cooling.”','“Mi aire dejó de enfriar.”'),59,432,35)
      enter(q,1.05,()=>{box(59,479,596,99,C.blue);mono(choose('NEW INQUIRY → AZUL','NUEVA CONSULTA → AZUL'),79,510,19,C.white);text(choose('Your agent takes it from here.','Tu agente continúa desde aquí.'),79,553,31,C.white)})
    }else if(stage===1){
      person(59,174);pill(choose('CALL CONNECTED','LLAMADA CONECTADA'),386,180,267,true)
      circle(356,326,67,null,C.line);circle(356,326,49,C.blue);icon('phone',336,305,41,C.white)
      waveform(65,441,584,90,q,38)
      wrap(choose('“Hi Alex. Tell me what’s happening.”','“Hola Alex. Cuéntame qué pasa.”'),59,534,588,35)
    }else if(stage===2){
      person(59,174);line(59,238,655,238)
      const rows=choose([['SERVICE','AC repair'],['LOCATION','Coral Gables · 33134'],['URGENCY','Stopped cooling today']],[['SERVICIO','Reparación de aire'],['UBICACIÓN','Coral Gables · 33134'],['URGENCIA','Dejó de enfriar hoy']])
      rows.forEach(([label,value],i)=>{const yy=262+i*111;mono(label,59,yy+16,19);enter(q,.2+i*.55,()=>{text(value,59,yy+61,35);box(612,yy+25,39,39,C.tint);icon('check',620,yy+33,24)});if(i<2)line(59,yy+84,655,yy+84)})
    }else if(stage===3){
      box(35,144,644,63,C.paper);mono(choose('YOUR CALENDAR / TOMORROW','TU CALENDARIO / MAÑANA'),59,184,20,C.blue)
      for(let i=0;i<3;i++){mono(['09:00','10:00','11:00'][i],59,264+i*104,18);line(147,258+i*104,655,258+i*104)}
      enter(q,.2,()=>{const p=ease((q-.2)/1.4);ctx.save();ctx.translate(mix(43,0,p),mix(-58,0,p));box(164,288,476,163,C.blue);text('10:00 AM',188,332,46,C.white);text('Alex Morgan',188,377,32,C.white);text(choose('AC estimate','Estimado de aire'),188,418,27,C.white);ctx.restore()})
      enter(q,1.8,()=>{box(59,514,596,65,C.ink);icon('check',78,534,26,C.white);text(choose('Confirmed. You’re all set.','Confirmado. Todo listo.'),124,558,31,C.white)})
    }else if(stage===4){
      box(35,144,644,66,C.paper);icon('check',57,166,25);text(choose('Job marked complete','Trabajo marcado como terminado'),99,185,29)
      enter(q,.4,()=>{box(59,244,596,309,C.tint);mono(choose('MESSAGE TO ALEX','MENSAJE PARA ALEX'),80,280,20,C.blue);wrap(choose('Thanks, Alex. How did we do?','Gracias, Alex. ¿Cómo nos fue?'),80,337,551,39);wrap(choose('Share your experience on Google.','Comparte tu experiencia en Google.'),80,447,549,31,C.muted);line(80,489,630,489,'#b8c7ee');text(choose('Leave a review','Deja una reseña'),80,531,31,C.blue);icon('arrow',595,507,30)})
      enter(q,2.1,()=>{mono(choose('DELIVERED','ENTREGADO'),474,592,18);icon('check',626,576,21)})
    }else{
      const nodes=choose(['Website','AI agent','Calendar','Reputation'],['Sitio web','Agente IA','Calendario','Reputación']);const symbols=['web','phone','calendar','star']
      nodes.forEach((s,i)=>{const yy=170+i*107;box(59,yy,63,63,q>i*.5?C.blue:C.tint);icon(symbols[i],76,yy+17,29,q>i*.5?C.white:C.blue);text(s,148,yy+42,38);if(i<3)connector(90,yy+66,90,yy+102,q,i*.5);enter(q,i*.5+.3,()=>icon('check',611,yy+21,28))})
    }
    mono('ALEX MORGAN / CORAL GABLES',34,665,18)
    box(34,688,646,2,C.line);box(34,688,646*(stage+q/5)/6,2,C.blue)
  }
  const scenes=[site,call,qualify,booking,review,overview]
  // Previous scene stays visible under the incoming composition: no blank wipes.
  const previous=document.createElement('canvas');previous.width=W;previous.height=H
  const previousCtx=previous.getContext('2d')
  let cachedPrevious=-1
  function frame(stage,q){background(stage,q);ctx.save();if(mobile)mobileScene(stage,q);else scenes[stage](q);ctx.restore()}
  function draw(t){
    const stage=Math.min(5,Math.floor(t/5)),q=t-stage*5
    if(stage>0&&q<.6){
      if(cachedPrevious!==stage-1){frame(stage-1,4.6);previousCtx.drawImage(canvas,0,0);cachedPrevious=stage-1}
      ctx.drawImage(previous,0,0);ctx.save();ctx.globalAlpha=ease(q/.6);ctx.translate((1-ease(q/.6))*24,0);frame(stage,q);ctx.restore()
    }else frame(stage,q)
  }
  draw(3.5)
  return {canvas,draw}
}
