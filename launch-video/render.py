"""Azul launch film. Original animation and synthesized soundtrack.
Run from the repository root: python launch-video/render.py
"""
from pathlib import Path
import sys, math, subprocess, wave, json
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'launch-video'
sys.path.insert(0, str(ROOT / 'tmp/video-tools'))
import imageio_ffmpeg
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
FPS, DURATION = 30, 38
PAPER = (235, 234, 246)
BLUE = (52, 85, 245)
MUTED = (175, 187, 219)
FONT = Path('C:/Windows/Fonts')
fonts = {}
def font(size, bold=False):
    key = (int(size), bold)
    if key not in fonts:
        fonts[key] = ImageFont.truetype(str(FONT / ('segoeuib.ttf' if bold else 'segoeui.ttf')), int(size))
    return fonts[key]
def ease(x):
    x = max(0, min(1, x))
    return 1 - (1-x)**3
def label(im, xy, text, size=20, color=PAPER, bold=False, anchor=None):
    ImageDraw.Draw(im).text(xy, text, font=font(size, bold), fill=color, anchor=anchor)
def lines(im, x, y, texts, size, local, color=PAPER, gap=1.08):
    for i, text in enumerate(texts):
        p = ease((local - i*.12)/.8)
        layer = Image.new('RGBA', im.size)
        label(layer, (x, int(y+i*size*gap+(1-p)*65)), text, size, color, True)
        layer.putalpha(layer.getchannel('A').point(lambda a: int(a*p)))
        im.alpha_composite(layer)
def rounded(im, box, radius=24, fill=(25,36,67), outline=None, width=1):
    ImageDraw.Draw(im).rounded_rectangle(tuple(int(v) for v in box), radius, fill=fill, outline=outline, width=width)
def paste(im, asset, x, y, w, h=None):
    if h is None: h = round(asset.height*w/asset.width)
    a = asset.resize((max(1,int(w)),max(1,int(h))), Image.Resampling.LANCZOS)
    im.alpha_composite(a.convert('RGBA'), (int(x),int(y)))

logo = Image.open(ROOT/'public/Azul Gradient Ribbon Logo.png').convert('RGBA')
logo = logo.crop(logo.getbbox())
work = Image.open(ROOT/'public/aspire-roofing-preview.webp').convert('RGBA')
silk = Image.open(ROOT/'public/images/hero-blue-blur-background.png').convert('RGB')

class Film:
    def __init__(self, portrait=False):
        self.portrait = portrait
        self.w, self.h = (720,1280) if portrait else (1280,720)
        self.margin = 58 if portrait else 76
        w,h = self.w,self.h
        yy,xx = np.mgrid[0:h,0:w]
        glow=np.exp(-(((xx-w*.8)/(w*.65))**2+((yy-h*.45)/(h*.75))**2)*2)
        arr=np.zeros((h,w,3))
        for c,(base,boost) in enumerate([(8,17),(13,32),(30,85)]): arr[:,:,c]=base+glow*boost
        rng=np.random.default_rng(6)
        arr += rng.normal(0,.65,(h,w,1))
        self.bg=Image.fromarray(np.uint8(np.clip(arr,0,255))).convert('RGBA')
        self.silk=silk.resize((w,h),Image.Resampling.LANCZOS).convert('RGBA')
    def base(self,t,light=False):
        w,h=self.w,self.h
        im=Image.new('RGBA',(w,h),PAPER) if light else self.bg.copy()
        d=ImageDraw.Draw(im)
        if not light:
            cx,cy=w*.80,h*.55
            for j in range(4):
                r=180+j*90+math.sin(t*.35)*16
                d.ellipse((int(cx-r),int(cy-r),int(cx+r),int(cy+r)),outline=(34+j*3,51+j*3,94+j*4),width=1)
            for j in range(9):
                x=(j*187+t*(6+j*.5))%w; y=(j*139+70)%h
                d.ellipse((x,y,x+2,y+2),fill=(80,108,177))
        ink=(21,31,60) if light else PAPER
        label(im,(self.margin,36 if not self.portrait else 65),'azul',30,ink,True)
        label(im,(w-self.margin,49 if not self.portrait else 78),'WEB + AI',13,ink,anchor='rm')
        footer=h-44 if not self.portrait else h-82
        d.line((self.margin,footer-18,w-self.margin,footer-18),fill=(170,176,200) if light else (52,66,102),width=1)
        label(im,(self.margin,footer),'BUILT FOR SOUTH FLORIDA',11,ink)
        label(im,(w-self.margin,footer),f'{min(7, next((i+1 for i,b in enumerate([5,9,15,21,27,32,38]) if t<b),7)):02d} / 07',11,ink,anchor='ra')
        d.line((self.margin,h-13,self.margin+(w-2*self.margin)*min(t/DURATION,1),h-13),fill=BLUE,width=3)
        return im
    def frame(self,t):
        w,h,m=self.w,self.h,self.margin
        p=self.portrait
        starts=[0,5,9,15,21,27,32]
        idx=max(i for i,s in enumerate(starts) if t>=s)
        local=t-starts[idx]
        im=self.base(t,idx==1)
        d=ImageDraw.Draw(im)
        if idx==0:
            label(im,(m,225 if p else 176),'YOUR NEXT CHAPTER STARTS HERE',15,MUTED)
            lines(im,m,285 if p else 212,['Good work.','Deserves to','be seen.'],76 if p else 94,local)
            if not p:
                cx,cy=1020,360
            else: cx,cy=400,850
            # A flowing ribbon draws itself around the brand's first letter.
            for j in range(30):
                angle=t*.4+j*.055
                r=120+j*1.5
                pts=[]
                for k in range(100):
                    a=k/99*math.pi*1.7+angle
                    pts.append((cx+math.cos(a)*r,cy+math.sin(a)*r*.65))
                d.line(pts,fill=(35+j*2,76+j*3,205+j),width=3)
            label(im,(m,1090 if p else 615),'A stronger presence. A smarter way to connect.',18,MUTED)
        elif idx==1:
            label(im,(w/2,240 if p else 147),'INTRODUCING',16,(65,80,120),anchor='mm')
            lw=(460 if p else 420)*(0.93+.07*ease(local/1.2))
            paste(im,logo,(w-lw)/2,350 if p else 210,lw)
            label(im,(w/2,810 if p else 530),'Your business. Connected.',30 if p else 34,(21,31,60),True,'mm')
            label(im,(w/2,865 if p else 582),'Websites  /  Visibility  /  AI',20,(65,80,120),anchor='mm')
        elif idx==2:
            label(im,(m,205 if p else 165),'01  /  WEBSITE DESIGN',15,MUTED)
            lines(im,m,255 if p else 205,['Make a great','first impression.'] if p else ['Make a great','first','impression.'],60 if p else 70,local)
            x,y,cw=(m,570,604) if p else (635,175,585)
            y+=int(40*(1-ease(local/.9))-math.sin(local*.65)*5)
            ch=int(cw*1050/1440)+38
            rounded(im,(x+12,y+20,x+cw+12,y+ch+20),20,(5,10,25))
            rounded(im,(x,y,x+cw,y+ch),18,(38,44,62),(78,92,124))
            for j in range(3): d.ellipse((x+17+j*14,y+15,x+23+j*14,y+21),fill=(138,147,170))
            label(im,(x+cw/2,y+19),'WEBSITE WORK / ASPIRE ROOFING',10,MUTED,anchor='mm')
            paste(im,work,x+8,y+36,cw-16,ch-44)
            label(im,(m,1090 if p else 610),'Clear. Mobile-friendly. Built around your business.',17,MUTED)
        elif idx==3:
            label(im,(m,205 if p else 165),'02  /  LOCAL VISIBILITY',15,MUTED)
            lines(im,m,255 if p else 215,['Be found.','Build trust.'],76 if p else 84,local)
            x,y,cw=(m,620,604) if p else (725,180,470)
            # Stylized map and search cards; no invented performance metrics.
            rounded(im,(x,y,x+cw,y+345),28,(18,32,63),(59,80,130))
            for j in range(6):
                d.line((x+20,y+55+j*49,x+cw-20,y+25+j*49),fill=(35,54,91),width=2)
                d.line((x+45+j*80,y+20,x+80+j*80,y+325),fill=(35,54,91),width=2)
            cx,cy=x+cw*.55,y+160
            r=22+((local*22)%65)
            d.ellipse((cx-r,cy-r,cx+r,cy+r),outline=(53,91,179),width=2)
            d.ellipse((cx-18,cy-18,cx+18,cy+18),fill=BLUE)
            d.ellipse((cx-5,cy-5,cx+5,cy+5),fill=PAPER)
            for j,txt in enumerate(['Local search presence','Honest customer reviews']):
                yy=y+215+j*64+30*(1-ease((local-.35*j)/.7))
                rounded(im,(x+24,yy,x+cw-24,yy+51),12,(232,235,250))
                label(im,(x+45,yy+12),txt,19,(20,35,68),True)
            label(im,(m,1090 if p else 610),'Help nearby customers discover your business.',18,MUTED)
        elif idx==4:
            label(im,(m,205 if p else 165),'03  /  AI ANSWERING',15,MUTED)
            lines(im,m,255 if p else 215,['Answer the call.','Even after hours.'] if p else ['Answer the call.','Even after','hours.'],58 if p else 70,local)
            x,y,cw=(170,555,380) if p else (830,125,280)
            ch=490 if p else 460
            rounded(im,(x+12,y+12,x+cw+12,y+ch+12),42,(5,10,25))
            rounded(im,(x,y,x+cw,y+ch),42,(26,40,76),(91,118,183),2)
            rounded(im,(x+cw*.35,y+12,x+cw*.65,y+29),9,(7,13,29))
            label(im,(x+cw/2,y+85),'AZUL AI',23,PAPER,True,'mm')
            label(im,(x+cw/2,y+122),'Ready to connect',15,MUTED,anchor='mm')
            for j in range(33):
                bar=7+abs(math.sin(t*5+j*.65))*45*(.5+.5*math.sin(j/32*math.pi))
                xx=x+cw/2+(j-16)*6
                d.line((xx,y+220-bar,xx,y+220+bar),fill=(85,145,255),width=3)
            rounded(im,(x+30,y+310,x+cw-30,y+363),15,BLUE)
            label(im,(x+cw/2,y+336),'English + Español',19,PAPER,True,'mm')
            label(im,(x+cw/2,y+407),'Capture. Connect. Follow up.',13,MUTED,anchor='mm')
            label(im,(m,1090 if p else 610),'A helpful first response. A clear handoff to your team.',16,MUTED)
        elif idx==5:
            label(im,(m,205 if p else 152),'THE AZUL APPROACH',15,MUTED)
            lines(im,m,255 if p else 192,['One team.','Connected tools.'],66 if p else 78,local)
            labels=['Website design','Local visibility','Review requests','AI answering']
            for j,txt in enumerate(labels):
                if p: x,y,cw=m,580+j*116,604
                else: x,y,cw=76+j*285,475,265
                y+=int(45*(1-ease((local-j*.1)/.7)))
                rounded(im,(x,y,x+cw,y+88),18,(26,44,88),(67,91,148))
                label(im,(x+20,y+16),f'0{j+1}',12,(111,151,255))
                label(im,(x+20,y+40),txt,22,PAPER,True)
        else:
            # Branded final card has a full six-second reading window.
            im=self.silk.copy()
            veil=Image.new('RGBA',(w,h),(8,22,76,170))
            im.alpha_composite(veil)
            label(im,(m,65 if p else 40),'azul',36,PAPER,True)
            label(im,(m,205 if p else 166),'LET’S BUILD WHAT’S NEXT',15,PAPER)
            lines(im,m,270 if p else 222,['Built for your','next chapter.'],70 if p else 94,local)
            label(im,(m,545 if p else 455),'Web + AI for South Florida businesses.',21 if p else 24,PAPER)
            by=760 if p else 530
            rounded(im,(m,by,m+(604 if p else 474),by+75),38,PAPER)
            label(im,(m+30,by+21),'Book a free discovery call',25,(25,45,105),True)
            label(im,(m,by+115),'azulwebdev.com',32 if p else 27,PAPER,True)
            label(im,(m,1130 if p else 675),'MIAMI-DADE  /  BROWARD  /  PALM BEACH',12,PAPER)
        # Fast blue shutter connects scenes while preserving reading time.
        if idx>0 and local<.3:
            edge=int(w*(1-ease(local/.3)))
            ImageDraw.Draw(im).rectangle((0,0,edge,h),fill=BLUE)
        if t<.4:
            im=Image.blend(Image.new('RGBA',im.size,(6,10,25)),im,ease(t/.4))
        return im.convert('RGB')

def soundtrack():
    sr=48000
    audio=np.zeros((int(DURATION*sr),2),np.float64)
    rng=np.random.default_rng(8)
    def add(start,signal,gain=1,pan=0):
        at=int(start*sr)
        if at>=len(audio): return
        sig=signal[:len(audio)-at]*gain
        audio[at:at+len(sig),0]+=sig*math.sqrt((1-pan)/2)
        audio[at:at+len(sig),1]+=sig*math.sqrt((1+pan)/2)
    beat=60/110
    # Warm minor-seventh pads, restrained bass, a syncopated glass pluck.
    chords=[[146.832,174.614,220,261.626],[130.813,164.814,196,246.942],[116.541,146.832,174.614,220],[130.813,155.563,196,233.082]]
    for k,start in enumerate(np.arange(0,DURATION,beat*8)):
        tt=np.arange(int(beat*9*sr))/sr
        env=np.minimum(tt/1.0,1)*np.minimum((tt[-1]-tt)/1.3,1)
        chord=chords[k%4]
        tone=sum(np.sin(2*np.pi*f*tt)+.23*np.sin(2*np.pi*f*2.003*tt) for f in chord)/len(chord)
        add(start,tone*env,.105,(-1 if k%2 else 1)*.2)
    for k,start in enumerate(np.arange(0,DURATION,beat)):
        tt=np.arange(int(.40*sr))/sr
        kick=np.sin(2*np.pi*(46*tt+2.6*(1-np.exp(-tt*32))))*np.exp(-tt*14)
        add(start,kick,.22 if start>4 else .12)
        if k%2:
            tt=np.arange(int(.16*sr))/sr
            noise=rng.normal(0,1,len(tt)); noise=np.r_[0,np.diff(noise)]
            add(start,noise*np.exp(-tt*35),.025)
        tt=np.arange(int(.35*sr))/sr
        root=chords[(k//8)%4][0]/2
        add(start,np.sin(2*np.pi*root*tt)*np.exp(-tt*8),.09)
        for off in [0,.5]:
            tt=np.arange(int(.075*sr))/sr
            noise=rng.normal(0,1,len(tt)); noise=np.r_[0,np.diff(noise)]
            add(start+beat*off,noise*np.exp(-tt*65),.014, .45 if off else -.45)
        if k%2==0 or k%3==0:
            tt=np.arange(int(.65*sr))/sr
            freq=chords[(k//8)%4][k%4]*2
            pluck=(np.sin(2*np.pi*freq*tt)+.3*np.sin(2*np.pi*freq*3*tt))*np.exp(-tt*8)*np.minimum(tt/.008,1)
            add(start+beat*.5,pluck,.065,math.sin(k)*.55)
            add(start+beat*1.25,pluck,.02,-math.sin(k)*.55)
    for start in [5,9,15,21,27,32]:
        tt=np.arange(int(.7*sr))/sr
        noise=rng.normal(0,1,len(tt))
        noise=np.convolve(noise,np.ones(12)/12,mode='same')
        env=np.sin(np.pi*np.arange(len(tt))/len(tt))**2
        add(start-.35,noise*env,.12)
    fade=np.minimum(np.arange(len(audio))/sr/1.2,1)*np.minimum((len(audio)-1-np.arange(len(audio)))/sr/1.6,1)
    audio*=fade[:,None]
    audio=np.tanh(audio*1.8)
    audio=audio/max(.9,np.max(np.abs(audio)))*.83
    with wave.open(str(OUT/'Azul-original-soundtrack.wav'),'wb') as f:
        f.setnchannels(2); f.setsampwidth(2); f.setframerate(sr)
        f.writeframes((audio*32767).astype('<i2').tobytes())

def preview():
    for p in [False,True]:
        film=Film(p)
        ts=[2.5,7,12,18,24,29.5,35]
        thumbs=[]
        for i,t in enumerate(ts):
            im=film.frame(t)
            im.save(OUT/f'frame-{("vertical" if p else "wide")}-{i+1}.jpg',quality=90)
            im.thumbnail((384,384))
            thumbs.append(im)
        tw,th=thumbs[0].size
        sheet=Image.new('RGB',(tw*4,th*2),(9,13,26))
        for i,im in enumerate(thumbs): sheet.paste(im,((i%4)*tw,(i//4)*th))
        sheet.save(OUT/f'storyboard-{("vertical" if p else "wide")}.jpg',quality=93)

def render(p=False):
    film=Film(p)
    filename='Azul-launch-vertical-1080x1920.mp4' if p else 'Azul-launch-1080p.mp4'
    output_size='1080:1920' if p else '1920:1080'
    cmd=[FFMPEG,'-y','-loglevel','error','-f','rawvideo','-vcodec','rawvideo','-s',f'{film.w}x{film.h}','-pix_fmt','rgb24','-r',str(FPS),'-i','-','-i',str(OUT/'Azul-original-soundtrack.wav'),'-vf',f'scale={output_size}:flags=lanczos','-c:v','libx264','-preset','fast','-crf','18','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-t',str(DURATION),'-movflags','+faststart',str(OUT/filename)]
    process=subprocess.Popen(cmd,stdin=subprocess.PIPE)
    for i in range(FPS*DURATION):
        process.stdin.write(film.frame(i/FPS).tobytes())
        if i%(FPS*5)==0: print(f'{filename}: {i//FPS}/{DURATION}s',flush=True)
    process.stdin.close()
    if process.wait()!=0: raise RuntimeError('Video export failed')
    print(f'Completed: {filename}',flush=True)

if __name__=='__main__':
    if '--preview' in sys.argv: preview()
    else:
        soundtrack()
        preview()
        render(False)
        render(True)
