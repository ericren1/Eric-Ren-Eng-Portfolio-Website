import { connect } from './cdp.mjs';
import { writeFile } from 'node:fs/promises';
const c=await connect();
try {
  await c.viewport(1200,630);
  await c.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await c.navigate(process.env.QA_URL || 'http://127.0.0.1:4173');
  await c.evaluate('Promise.all([...document.images].map(i=>{i.loading="eager";return i.decode().catch(()=>{})}))');
  await c.evaluate('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))');
  const result=await c.send('Page.captureScreenshot',{format:'jpeg',quality:90});
  await writeFile('public/social-preview.jpg',Buffer.from(result.data,'base64'));
} finally {await c.close();}
