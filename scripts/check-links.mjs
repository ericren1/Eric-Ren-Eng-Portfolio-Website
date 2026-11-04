import { projects, otherProjects } from '../src/data/projects.js';
import { profile } from '../src/data/profile.js';
const links=[...new Set([profile.github,profile.linkedin,...projects.map(p=>p.github),...otherProjects.map(p=>p.github),'https://github.com/ericren1/url-shortener-api/blob/main/performance/README.md'].filter(Boolean))];
const results=await Promise.allSettled(links.map(async url=>{
  const response=await fetch(url,{method:'HEAD',redirect:'follow',signal:AbortSignal.timeout(15000)});
  return {url,status:response.status};
}));
for(let i=0;i<results.length;i++) {
  const result=results[i];
  console.log(result.status==='fulfilled'?JSON.stringify(result.value):JSON.stringify({url:links[i],error:result.reason.message}));
}
