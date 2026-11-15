import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { FIXED_EXPOSURE, loadSettings } from './public/settings.js';
test('old player brightness and vignette preferences cannot override fixed visibility',()=>{
 for (const brightness of [.8,2,999]) {
  const s=loadSettings(()=>JSON.stringify({brightness,vignette:false,volume:.4,quality:'low'}));
  assert.equal(FIXED_EXPOSURE,1.23); assert.equal('brightness' in s,false); assert.equal('vignette' in s,false); assert.equal(s.volume,.4); assert.equal(s.quality,'low');
 }
});
test('settings recover from invalid or unavailable browser storage',()=>{
 assert.deepEqual(loadSettings(()=>'{'),loadSettings(()=>null));
 assert.deepEqual(loadSettings(()=>{throw Error('disabled');}),loadSettings(()=>null));
});
test('renderer uses fixed exposure and UI contains no brightness or vignette controls',()=>{
 const app=fs.readFileSync(new URL('./public/app.js',import.meta.url),'utf8');
 const house=fs.readFileSync(new URL('./public/house.js',import.meta.url),'utf8');
 assert.match(house,/toneMappingExposure=FIXED_EXPOSURE/);assert.equal((house.match(/toneMappingExposure=/g)||[]).length,1);
 assert.doesNotMatch(app,/id="bright"|vignetteToggle|settings\.brightness|settings\.vignette/);assert.match(app,/\$\('vignette'\)\.classList\.toggle\('hidden',s!=='hud'\)/);
});
