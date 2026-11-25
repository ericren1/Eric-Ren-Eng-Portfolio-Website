import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access, readdir } from 'node:fs/promises';
import { projects } from '../src/data/projects.js';
import { creativeCollections, travelTrips } from '../src/data/creative.js';
import { experiences } from '../src/data/experience.js';
import { getCompanyLogo, fallbackCompanyLogo } from '../src/data/companyLogos.js';
import { workPhotos } from '../src/data/workPhotos.js';

test('Published benchmark values match the bundled original k6 summaries', async () => {
  const hit=JSON.parse(await readFile('public/evidence/url-shortener-hit.json','utf8'));
  const miss=JSON.parse(await readFile('public/evidence/url-shortener-miss.json','utf8'));
  const rate=s=>s.metrics.http_reqs.values.rate;
  const p99=s=>s.metrics.http_req_duration.values['p(99)'];
  assert.equal(Math.round(rate(hit)),3109);
  assert.equal(Math.round(rate(miss)),2608);
  assert.equal(Math.round((rate(hit)/rate(miss)-1)*100),19);
  assert.equal(Math.round((1-p99(hit)/p99(miss))*100),42);
  assert.equal(hit.metrics.http_req_failed.values.rate,0);
  assert.equal(miss.metrics.http_req_failed.values.rate,0);
});
test('Creative originals and responsive variants exist',async()=>{
  const images=JSON.parse((await readFile('src/data/images.json','utf8')).replace(/^\uFEFF/,''));
  for(const collection of creativeCollections)for(const photo of collection.photos){
    await access('public'+photo.src);
    assert.ok(images[photo.src]?.variants.length);
    for(const variant of images[photo.src].variants) await access('public'+variant.src);
  }
});

test('Organized Photography folders are completely represented by dated albums',async()=>{
  const folders=(await readdir('public/images/Photography',{withFileTypes:true})).filter(entry=>entry.isDirectory());
  const physical=[];
  for(const folder of folders){
    for(const file of await readdir('public/images/Photography/'+folder.name)){
      if(/\.(jpe?g|png|webp)$/i.test(file))physical.push('/images/Photography/'+folder.name+'/'+file);
    }
  }
  const represented=travelTrips.flatMap(trip=>trip.photos.map(photo=>photo.src));
  assert.deepEqual([...represented].sort(),physical.sort());
  assert.equal(new Set(represented).size,represented.length);
  assert.equal(travelTrips.find(trip=>trip.slug==='china-2026').date,"26'");
  for(const trip of travelTrips)if(trip.year)assert.equal(trip.date,String(trip.year).slice(-2)+"'");
});
test('Reconciliation outcomes remain labeled as projections',()=>{
  const job=experiences.find(j=>j.id==='td-reconciliation');
  assert.ok(job.outcomes.every(o=>o.label.startsWith('Projected')));
  assert.match(job.result,/not measured production/);
});
test('Incomplete projects retain explicit implementation boundaries',()=>{
  const scheduler=projects.find(p=>p.slug==='ai-personal-scheduler');
  const exercise=projects.find(p=>p.slug==='ai-exercise-form-tracker');
  assert.equal(scheduler.status,'In development');
  assert.match(scheduler.results,/not implemented/);
  assert.equal(exercise.status,'Prototype');
  assert.match(exercise.challenges,/does not establish completed repetitions/);
});
test('Real product capture and sharing assets are available',async()=>{
  for(const path of ['public/images/projects/scheduler.png','public/social-preview.jpg','public/favicon.svg'])await access(path);
});

test('Company logos match their names and unmatched companies use the supplied fallback',async()=>{
  assert.equal(getCompanyLogo('TD Securities'),'/images/Logos/TD Logo.jpg');
  assert.equal(getCompanyLogo('Romaeris Corporation'),'/images/Logos/romaeris_corporation_logo.jpg');
  assert.equal(getCompanyLogo('LDRS Investments'),fallbackCompanyLogo);
  assert.equal(getCompanyLogo('Unknown company'),fallbackCompanyLogo);
  for(const company of experiences)await access('public'+getCompanyLogo(company.company));
});

test('Work photographs are assigned to the matching seasons and have responsive assets',async()=>{
  const images=JSON.parse((await readFile('src/data/images.json','utf8')).replace(/^\uFEFF/,''));
  assert.equal(experiences.find(job=>job.id==='td-reconciliation').photo,workPhotos.fallLunch);
  assert.deepEqual(experiences.find(job=>job.id==='td-reconciliation').photos,[workPhotos.fallLunch,workPhotos.fallSpeedMentoring]);
  assert.deepEqual(experiences.find(job=>job.id==='td-backend').photos,[workPhotos.summerConference]);
  for(const photo of Object.values(workPhotos)){
    await access('public'+photo.src);
    assert.ok(images[photo.src]?.variants.length);
    for(const variant of images[photo.src].variants)await access('public'+variant.src);
  }
});
