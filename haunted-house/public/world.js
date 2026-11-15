// Shared geometry in metres. x/z horizontal, y up. Both server and renderer use this file.
export const LEVEL=3.2, FLOOR_MIN=-1,FLOOR_MAX=2;
export const rooms=[],walls=[],doors=[],props=[],hides=[],stairs=[];
const roomNames={ '-1':['Storage','Laundry','Boiler Room','Workshop'],0:['Living Room','Dining Room','Kitchen','Study'],1:['Master Bedroom','Guest Bedroom','Bathroom','Children’s Room'],2:['Attic Storage','Old Nursery','Archive','Trunk Room']};
function wall(f,x,z,w,d,window=false){walls.push({f,x,z,w,d,window});}
function gapwall(f,z,x0,x1,gaps){let a=x0;for(let c of gaps){wall(f,(a+c-0.65)/2,z,c-.65-a,.18);doors.push({id:doors.length,f,x:c,z,axis:'x',w:1.3,side: z<0?-1:1});a=c+.65;}wall(f,(a+x1)/2,z,x1-a,.18);}
function furniture(f,type,x,z,w,d,h,rot=0){const p={id:props.length,f,type,x,z,w,d,h,rot};props.push(p);return p;}
function hide(p,type,x,z){hides.push({id:hides.length,f:p.f,type,x,z,insideX:p.x,insideZ:p.z});}
for(let f=-1;f<=2;f++){
 // Outer shell with glazed window sections on living floors.
 wall(f,0,-8,18,.22,f>=0);wall(f,-9,0,.22,16);wall(f,9,0,.22,16);wall(f,0,8,18,.22,f===0||f===1);
 gapwall(f,-1.65,-9,5,[-5.5,1.5]);gapwall(f,1.65,-9,5,[-5.5,1.5]);
 wall(f,-2,-4.825,.18,6.35);wall(f,-2,4.825,.18,6.35);
 let edge=-8;for(let center of [-6.5,0,5.8]){let width=center===0?2:1.3;wall(f,5,(edge+center-width/2)/2,.18,center-width/2-edge);doors.push({id:doors.length,f,x:5,z:center,axis:'z',w:width,side:-1});edge=center+width/2;}wall(f,5,(edge+8)/2,.18,8-edge);
 const boxes=[[-9,-8,-2,-1.65],[-2,-8,5,-1.65],[-9,1.65,-2,8],[-2,1.65,5,8]];
 boxes.forEach(([x0,z0,x1,z1],i)=>rooms.push({f,name:roomNames[f][i],x0,z0,x1,z1}));
 rooms.push({f,name:f===0?'Entrance Hall':f===1?'Upstairs Hall':f===2?'Attic Landing':'Basement Hall',x0:-9,z0:-1.65,x1:5,z1:1.65});
 rooms.push({f,name:'Stairwell',x0:5,z0:-8,x1:9,z1:8});
 for(const [x,z] of [[-5.5,-6.5],[1.5,-6.5],[-5.5,6.5],[1.5,6.5]]){const p=furniture(f,'wardrobe',x,z,1.5,.65,2.15,z>0?Math.PI:0);hide(p,'closet',x,z+(z<0?.95:-.95));}
}
// Alternate stair bays; separate opening in upper slab for each staircase.
for(let f=-1;f<2;f++) stairs.push({id:f+1,f,x:f===0?8:6.3,w:1.48,z0:-5.5,z1:3.5});
const add=(f,type,x,z,w,d,h,rot=0)=>furniture(f,type,x,z,w,d,h,rot);
let sofa=add(0,'sofa',-7.5,-4.8,1.05,2.6,.95,Math.PI/2);hide(sofa,'behind sofa',-8.3,-4.8);
add(0,'coffee',-5.1,-4.8,1.3,.75,.48);add(0,'armchair',-3.2,-4.8,.9,.9,.95);add(0,'piano',-8,-7,1.4,.6,1.2);add(0,'bookshelf',-2.6,-6.9,1,.5,2.1);add(0,'lamp',-7.7,-2.5,.36,.36,1.65);
add(0,'dining',1.5,-4.4,2.3,1.05,.78);for(const x of [.5,2.5])for(const z of [-5.4,-3.4])add(0,'chair',x,z,.5,.55,.9,z<-4?Math.PI:0);add(0,'cabinet',3.8,-6.5,.9,.6,1.05);
add(0,'counter',-7.7,6.9,2.2,.65,.94);add(0,'counter',-8.3,4.6,.65,2.7,.94);add(0,'fridge',-3,6.9,.72,.72,1.85);add(0,'island',-5.6,4.7,1.6,.8,.94);
add(0,'desk',1.8,5.5,1.7,.75,.78);add(0,'chair',1.8,4.6,.55,.55,.9);add(0,'bookshelf',3.9,4.6,.65,2.4,2.1,Math.PI/2);add(0,'cabinet',-1.1,7,.8,.55,1.05);
for(const [x,z] of [[-5,-4.3],[1.5,-4.3],[1.5,5.1]]){let p=add(1,'bed',x,z,1.65,2.1,.72);hide(p,'under bed',x+1.18,z);add(1,'nightstand',x-1.2,z-.65,.5,.5,.6);}
add(1,'bath',-5.7,6.7,1.8,.8,.57);add(1,'toilet',-7.6,4.2,.6,.8,.8);add(1,'sink',-3.2,6.5,.7,.55,.87);
for(let f of [-1,2])for(const [x,z] of [[-7,-4],[-3.5,-6.8],[3.5,-4],[-7,5],[3.5,6.8]])add(f,f===-1?'crate':'trunk',x,z,1.2,.85,.8);
add(-1,'washer',-6.9,6.7,.7,.7,.9);add(-1,'workbench',2.3,4.7,1.8,.75,.9);add(2,'bookshelf',-7,-6.8,1.5,.6,2.1);add(2,'bed',1.1,-4.5,1.5,2,.65);
export const exit={f:0,x:0,z:7.82}; // Front door in study south wall, reachable from the hall via its room.
// Move exit to the exterior at the end of the central entrance hall.
exit.x=-8.82;exit.z=0;
export const spawn={x:0,z:0,f:0,y:0};
export const keySites=[];for(let f=-1;f<=2;f++)for(let [x,z] of [[-4.2,-2.7],[.2,-2.7],[-4.2,2.7],[.2,2.7],[-7,0],[3.6,0]])keySites.push({f,x,z});
export const dist=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
export const height=(s,z)=>s.f*LEVEL+Math.max(0,Math.min(1,(z-s.z0)/(s.z1-s.z0)))*LEVEL;
const inRect=(x,z,p,r=0)=>Math.abs(x-p.x)<p.w/2+r&&Math.abs(z-p.z)<p.d/2+r;
export function blocked(f,x,z,open={},r=.23,ghost=false){if(x<-8.84+r||x>8.84-r||z<-7.84+r||z>7.84-r)return true;if(walls.some(p=>p.f===f&&inRect(x,z,p,r)))return true;if(!ghost&&doors.some(p=>{if(p.f!==f)return false;let u=p.axis==='x'?x-p.x:-(z-p.z),v=p.axis==='x'?z-p.z:x-p.x;if(!open[p.id])return Math.abs(u)<p.w/2+r&&Math.abs(v)<.07+r;let a=p.side*Math.PI*.48,du=u+p.w/2-.05;let along=du*Math.cos(a)-v*Math.sin(a),across=du*Math.sin(a)+v*Math.cos(a);return along>-r&&along<p.w-.10+r&&Math.abs(across)<.07+r;}))return true;if(props.some(p=>p.f===f&&inRect(x,z,p,r)))return true;return false;}
export function hole(f,x,z,r=.12){return stairs.some(s=>s.f+1===f&&Math.abs(x-s.x)<s.w/2+r&&z>s.z0+.65-r&&z<s.z1-.08+r);}
export function advance(p,dx,dz,open={},ghost=false){for(const [a,b] of [[dx,0],[0,dz]]){const x=p.x+a,z=p.z+b;if(p.stair!=null){const s=stairs[p.stair];if(Math.abs(x-s.x)>s.w/2-.22)continue;if(z<=s.z0){p.stair=null;p.f=s.f;p.y=p.f*LEVEL;p.x=x;p.z=z;}else if(z>=s.z1){p.stair=null;p.f=s.f+1;p.y=p.f*LEVEL;p.x=x;p.z=z;}else{p.x=x;p.z=z;p.y=height(s,z);}continue;}
 const s=stairs.find(s=>Math.abs(x-s.x)<s.w/2-.22&&((p.f===s.f&&p.z<=s.z0&&z>s.z0&&z<s.z0+.45)||(p.f===s.f+1&&p.z>=s.z1&&z<s.z1&&z>s.z1-.45)));if(s){p.stair=s.id;p.x=x;p.z=z;p.y=height(s,z);continue;}
 if(blocked(p.f,x,z,open,.23,ghost)||hole(p.f,x,z)||stairs.some(s=>s.f===p.f&&Math.abs(x-s.x)<s.w/2+.18&&z>s.z0+.1&&z<s.z1))continue;p.x=x;p.z=z;p.y=p.f*LEVEL;}}
export function nearby(p,o,r=1.45){return p.stair==null&&p.f===o.f&&dist(p,o)<r;}
