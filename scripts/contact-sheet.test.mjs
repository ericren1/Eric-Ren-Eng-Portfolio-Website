import test from 'node:test';
import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import { contactSheetConfig, photoArchive, selectContactPhotos } from '../src/data/contactSheet.js';
import { travelTrips, creativeCollections } from '../src/data/creative.js';
import { workPhotos } from '../src/data/workPhotos.js';

test('Homepage represents every travel album, music, sports, and work',()=>{
  const selected=new Set(selectContactPhotos().map(photo=>photo.src));
  for(const trip of travelTrips)assert.ok(trip.photos.some(photo=>selected.has(photo.src)),trip.title);
  for(const photo of Object.values(workPhotos))assert.ok(selected.has(photo.src));
  for(const photo of creativeCollections[1].photos.filter(photo=>!photo.graphic&&!photo.excludeFromCollage))assert.ok(selected.has(photo.src));
  for(const photo of creativeCollections[2].photos)assert.ok(selected.has(photo.src));
});

test('Contact sheet uses distinct real photos without duplicating images', async () => {
  const photos=selectContactPhotos();
  assert.equal(contactSheetConfig.count,20);
  assert.equal(photos.length,Math.min(contactSheetConfig.count,photoArchive.length));
  assert.equal(new Set(photos.map(photo=>photo.src)).size,photos.length);
  for(const photo of photos){
    await access('public'+photo.src);
    if(photo.date)assert.ok(photo.dateSource);
  }
});
test('Curators can pin, exclude, order, and limit the archive',()=>{
  const config={count:4,pinned:[photoArchive[3].src],excluded:[photoArchive[0].src],order:[photoArchive[5].src]};
  const result=selectContactPhotos(config);
  assert.equal(result.length,4);
  assert.equal(result[0].src,photoArchive[3].src);
  assert.equal(result[1].src,photoArchive[5].src);
  assert.ok(result.every(photo=>photo.src!==photoArchive[0].src));
});
