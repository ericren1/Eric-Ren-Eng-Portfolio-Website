import assert from 'node:assert/strict';
import {connect} from './cdp.mjs';
import {projects} from '../src/data/projects.js';
import {travelTrips} from '../src/data/creative.js';
const c=await connect();
let count=0;
const check=(value,label)=>{assert.ok(value,label);count++;};
try {
 await c.send('Page.addScriptToEvaluateOnNewDocument',{source:'const originalFetch=window.fetch.bind(window);window.fetch=(i,o)=>i==="/api/visit"?Promise.resolve(new Response("{}",{status:202})):originalFetch(i,o);'});
 const routes=['/','/experience',...['td-securities','romaeris','ldrs','unity-health'].map(s=>'/experience/'+s),...projects.map(p=>'/projects/'+p.slug),'/more-projects','/more-about-me','/more-about-me#off-the-clock-music','/more-about-me#off-the-clock-fitness','/missing',...travelTrips.map(t=>'/more-about-me?album='+t.slug)];
 for(const theme of ['light','dark'])for(const width of [375,768,1440]){
  await c.viewport(width,900);await c.navigate('http://127.0.0.1:4173');await c.evaluate('localStorage.setItem("portfolio-theme",'+JSON.stringify(theme)+')');
  for(const route of routes){
   await c.navigate('http://127.0.0.1:4173'+route);
   check(await c.evaluate('document.documentElement.scrollWidth<=innerWidth'),'No overflow '+width+' '+route);
   if(route!=='/')check(await c.evaluate('document.querySelector("main").getBoundingClientRect().bottom<document.querySelector(".persistent-contact").getBoundingClientRect().top'),'Protected contact area '+route);
   check(await c.evaluate('!!document.querySelector("h1")'),'Page heading '+route);
  }
 }
 await c.navigate('http://127.0.0.1:4173/more-about-me');
 await c.evaluate('document.querySelector(".trip-open").click()');
 await c.wait('!!document.querySelector(".trip-gallery")');
 check(await c.evaluate('new URLSearchParams(location.search).has("album")'),'Album URL state');
 await c.send('Page.reload');await c.wait('!!document.querySelector(".trip-gallery")');
 check(true,'Album survives reload');
 await c.evaluate('document.querySelector("#off-clock-tab-music").click()');
 await c.wait('location.hash==="#off-the-clock-music"');
 check(true,'Tab URL state');
 await c.evaluate('history.back()');await c.wait('!!document.querySelector(".trip-gallery")');
 check(true,'Back restores album');
 check(!c.events.some(e=>e.method==='Runtime.exceptionThrown'),'No runtime exceptions');
 console.log('PASS: '+count+' production polish route and interaction checks.');
}finally{await c.close();}
