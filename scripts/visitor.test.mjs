import test from 'node:test';
import assert from 'node:assert/strict';
import {onRequest,maskIP,clientInfo,createVisitGuard} from '../functions/api/visit.js';

const envFor=()=>({DISCORD_WEBHOOK_URL:'https://discord.com/api/webhooks/test'});
function context(env,{ip='203.0.113.45',ua='Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0.0.0 Safari/537.36',cf={},body={page:'/projects?secret=hidden',referrer:'https://example.com/path?secret=hidden'},origin='https://portfolio.test'}={}){
  const request=new Request('https://portfolio.test/api/visit',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json','CF-Connecting-IP':ip,'User-Agent':ua},body:JSON.stringify(body)});
  Object.defineProperty(request,'cf',{value:cf});const tasks=[];return {request,env,tasks,waitUntil(promise){tasks.push(promise);}};
}
test('Masks IPv4 and expanded/compressed IPv6 without sending the full address',()=>{
  assert.equal(maskIP('203.0.113.45'),'203.0.113.xxx');
  assert.equal(maskIP('2607:fea8:842b:4100:fc7a:8b1f:2abd:9003'),'2607:fea8:842b:xxxx:xxxx:xxxx:xxxx:xxxx');
  assert.equal(maskIP('2001:db8::1'),'2001:db8:0:xxxx:xxxx:xxxx:xxxx:xxxx');
  assert.equal(maskIP('nonsense'),'Unknown');
});
test('Readable clients distinguish browser precedence and mobile/tablet',()=>{
  assert.equal(clientInfo('Mozilla Windows Chrome/130.0 Edg/130.0').browser,'Edge 130');
  assert.deepEqual(clientInfo('Mozilla iPhone Mobile Version/18.0 Safari/604.1'),{browser:'Safari 18',os:'iOS / iPadOS',device:'Mobile'});
  assert.equal(clientInfo('Mozilla Android Chrome/130.0').device,'Tablet');
});
test('In-memory guard deduplicates, caps visitor/instance budgets, and expires entries',()=>{
  const guard=createVisitGuard(),now=180000;
  assert.ok(guard.reserve('2001:db8::1','/',now));
  assert.equal(guard.reserve('2001:0db8:0:0:0:0:0:1','/',now),false);
  assert.ok(guard.reserve('2001:db8::1','/',now+60001));
  const other=createVisitGuard();for(let n=0;n<5;n++)assert.ok(other.reserve('203.0.113.1','/'+n,now));
  assert.equal(other.reserve('203.0.113.1','/blocked',now),false);
  assert.ok(other.reserve('203.0.113.1','/blocked',now+60000));
  const global=createVisitGuard();for(let n=0;n<30;n++)assert.ok(global.reserve('203.0.113.'+n,'/',now));
  assert.equal(global.reserve('203.0.113.99','/',now),false);
  assert.ok(global.reserve('203.0.113.99','/',now+60000));
  const restarted=createVisitGuard();assert.ok(restarted.reserve('203.0.113.1','/blocked',now));
});
test('Cooldown suppresses notifications for the requested interval',()=>{
  const guard=createVisitGuard();guard.pause(60000);
  assert.equal(guard.reserve('203.0.113.1','/'),false);
  assert.ok(guard.reserve('203.0.113.1','/',Date.now()+61000));
});
test('Notification uses CF metadata, masks IP, strips secrets, and contacts Discord only',async()=>{
  const original=globalThis.fetch,calls=[];
  globalThis.fetch=async(url,options)=>{calls.push({url,body:JSON.parse(options.body)});return new Response(null,{status:204});};
  try{
    const ctx=context(envFor(),{cf:{asOrganization:'Google LLC',asn:15169,city:'Toronto',region:'Ontario',country:'CA',timezone:'America/Toronto'}});
    assert.equal((await onRequest(ctx)).status,202);await Promise.all(ctx.tasks);
    assert.equal(calls.length,1);const embed=calls[0].body.embeds[0];
    assert.match(embed.description,/Google LLC/);assert.equal(embed.color,0x4b5739);
    assert.equal(embed.fields.find(f=>f.name==='ASN').value,'AS15169');
    assert.match(embed.fields.find(f=>f.name==='Approximate location').value,/google.com\/maps/);
    assert.ok(!JSON.stringify(embed).includes('203.0.113.45'));assert.ok(!JSON.stringify(embed).includes('secret=hidden'));
    assert.ok(!embed.fields.some(f=>f.name==='User agent'));
    assert.equal(calls[0].url,ctx.env.DISCORD_WEBHOOK_URL);
    const duplicate=context(ctx.env);await onRequest(duplicate);await Promise.all(duplicate.tasks);assert.equal(calls.length,1);
  }finally{globalThis.fetch=original;}
});
test('Bots, owner IP, invalid requests and missing webhook do not notify',async()=>{
  const env=envFor();env.IGNORED_VISITOR_IPS='2001:db8::1';
  for(const options of [{ip:'2001:0db8:0:0:0:0:0:1'},{ua:'Googlebot/2.1'},{cf:{botManagement:{verifiedBot:true}}}]){
    const ctx=context(env,options);assert.equal((await onRequest(ctx)).status,202);assert.equal(ctx.tasks.length,0);
  }
  assert.equal((await onRequest(context(env,{origin:'https://evil.test'}))).status,403);
  assert.equal((await onRequest(context(env,{body:{page:'//evil.test',referrer:''}}))).status,400);
  assert.equal((await onRequest(context({}))).status,503);
});
test('Missing metadata and Discord outages fail gracefully',async()=>{
  const original=globalThis.fetch;globalThis.fetch=async()=>{throw new Error('offline');};
  try{const ctx=context(envFor(),{ip:'198.51.100.12'});assert.equal((await onRequest(ctx)).status,202);assert.equal(ctx.tasks.length,1);await Promise.all(ctx.tasks);}finally{globalThis.fetch=original;}
});
