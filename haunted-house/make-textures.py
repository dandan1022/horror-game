"""Original procedural 1024px material maps, baked to local JPEGs."""
from PIL import Image
import numpy as np
from pathlib import Path
out=Path('public/assets');out.mkdir(exist_ok=True);N=1024;rng=np.random.default_rng(82);y,x=np.mgrid[:N,:N];
def noise(w,h):
 a=rng.integers(0,255,(h,w),dtype=np.uint8);return np.asarray(Image.fromarray(a).resize((N,N),Image.Resampling.BICUBIC),dtype=float)/255-.5
def save(name,base,detail,height,rough=.75):
 rgb=np.clip(np.array(base)[None,None,:]+detail[:,:,None],0,255).astype('uint8');Image.fromarray(rgb).save(out/(name+'.jpg'),quality=92)
 Image.fromarray(np.clip(128+height*90,0,255).astype('uint8')).save(out/(name+'-bump.jpg'),quality=91)
 Image.fromarray(np.clip(rough*255+height*12,0,255).astype('uint8')).save(out/(name+'-rough.jpg'),quality=88)
long=noise(8,160);fine=noise(7,500);warp=noise(8,8);grain=np.sin(y*.23+warp*24+np.sin(x/70)*2)*.5+long+fine*.35
plank=(y//128);offset=np.array([rng.uniform(-13,13) for _ in range(8)])[plank];seam=(y%128<3);end=((x+plank*237)%512<3);detail=grain*20+offset+noise(32,25)*9-seam*37-end*25
save('oak',[120,84,52],detail,grain*.37-seam*.75-end*.5,.62)
save('walnut',[75,46,28],grain*16+noise(12,15)*8,grain*.32,.48)
plaster=noise(12,12)*14+noise(70,70)*9+noise(340,340)*5+rng.normal(0,1.3,(N,N));stains=np.maximum(0,noise(6,8)+.05)*25
save('plaster',[166,157,142],plaster-stains,plaster/17,.92)
save('ceiling',[207,202,190],plaster*.6,plaster/25,.91)
weave=(np.sin(x*1.9)+np.sin(y*1.9))*2.4+noise(120,100)*8+noise(8,8)*9
save('fabric',[113,105,89],weave,weave/9,.93)
save('linen',[181,173,155],weave*.75,weave/11,.88)
tile=(x%256<4)|(y%256<4);vein=np.sin((x+y)*.035+noise(8,8)*9)*3+noise(30,30)*6
save('tile',[170,171,165],vein-tile*45,vein/20-tile*.75,.3)
brickrow=y//128;br=(y%128<5)|((x+(brickrow%2)*128)%256<5);save('brick',[95,78,66],noise(32,32)*20+noise(180,180)*8+br*25,-br.astype(float)*.6+noise(100,100)*.2,.85)
