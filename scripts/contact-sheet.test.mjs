import test from 'node:test';
import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import { contactSheetConfig, photoArchive, selectContactPhotos } from '../src/data/contactSheet.js';

test('Contact sheet uses distinct real photos without filling to 25 with duplicates', async () => {
  const photos=selectContactPhotos();
  assert.equal(contactSheetConfig.count,25);
  assert.equal(photos.length,12);
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
