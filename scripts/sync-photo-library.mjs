import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('public/images');
const manifest = JSON.parse((await readFile('src/data/images.json', 'utf8')).replace(/^\uFEFF/, ''));
const albums = {
  'China 2026': { title: 'China', year: 2026, slug: 'china-2026', cover: 'shanghai.jpg' },
  'US road trip 2026': { title: 'US Road Trip', year: 2026, slug: 'us-road-trip-2026', cover: 'canyon.jpg' },
  'F1 Miami 2025': { title: 'F1 Miami', year: 2025, slug: 'f1-miami-2025', cover: 'Miami.jpg' },
  'Carribean Cruise 2025': { title: 'Caribbean Cruise', year: 2025, slug: 'caribbean-cruise-2025', cover: 'cruise.jpg' },
  'Yodaguy museum': { title: 'Yoda Guy Museum', year: 2025, slug: 'yoda-guy-museum-2025', cover: 'Yodaguy museum.jpg', dateSource: 'Existing Eastern Caribbean 2025 album' },
  'Mexico Playa Del carmen 2023': { title: 'Mexico, Playa del Carmen', year: 2023, slug: 'mexico-playa-del-carmen-2023', cover: 'mexico.jpg' },
};
const imageFiles = async folder => (await readdir(path.join(root, folder), { withFileTypes: true }))
  .filter(entry => entry.isFile() && /\.(jpe?g|png|webp)$/i.test(entry.name)).map(entry => entry.name);
const photo = (folder, file, label, year, dateSource) => {
  const src = '/images/' + folder + '/' + file;
  const info = manifest[src];
  if (!info) throw new Error('Optimize this image before syncing: ' + src);
  return {
    src, alt: label, shape: info.width > info.height ? 'wide' : 'tall',
    date: info.capturedAt?.slice(0, 10) || (year ? String(year) : null),
    dateSource: info.capturedAt ? 'EXIF DateTimeOriginal' : year ? dateSource || folder : null,
  };
};
const folders = (await readdir(path.join(root, 'Photography'), { withFileTypes: true })).filter(entry => entry.isDirectory());
const travelTrips = [];
for (const folder of folders) {
  const supplied = albums[folder.name];
  const year = supplied?.year || Number(folder.name.match(/\b(20\d{2})\b/)?.[1]) || null;
  const title = supplied?.title || folder.name.replace(/\s*20\d{2}\b/, '').trim();
  const slug = supplied?.slug || (title + (year ? '-' + year : '')).toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const files = await imageFiles('Photography/' + folder.name);
  files.sort((a,b) => Number(b === supplied?.cover) - Number(a === supplied?.cover) ||
    (manifest['/images/Photography/' + folder.name + '/' + a]?.capturedAt || '').localeCompare(manifest['/images/Photography/' + folder.name + '/' + b]?.capturedAt || '') || a.localeCompare(b));
  if (!files.length) continue;
  travelTrips.push({ slug, title, date: year ? String(year).slice(-2) + "'" : '', year, location: title,
    photos: files.map((file,index) => photo('Photography/' + folder.name, file, title + ' / Photograph ' + (index+1), year, supplied?.dateSource)),
  });
}
const albumOrder = Object.keys(albums);
travelTrips.sort((a,b) => (b.year || 0) - (a.year || 0) ||
  albumOrder.findIndex(folder => albums[folder].slug === a.slug) - albumOrder.findIndex(folder => albums[folder].slug === b.slug));
const musicOrder = ['Studio.jpg', 'muso prod.png', 'muso.png', 'Remixprojectgrad.jpg', 'remixprojectwitrich.jpg', 'Remixprojectgradgrey.jpg'];
const musicFiles = await imageFiles('Music');
musicFiles.sort((a,b) => (musicOrder.indexOf(a) < 0 ? 99 : musicOrder.indexOf(a)) - (musicOrder.indexOf(b) < 0 ? 99 : musicOrder.indexOf(b)) || a.localeCompare(b));
const captions = {
  'Studio.jpg': 'In the studio', 'muso prod.png': 'MUSO.AI / 2025 producer chart', 'muso.png': 'MUSO.AI / 2025 summary',
  'Remixprojectgrad.jpg': 'The Remix Project', 'remixprojectwitrich.jpg': 'The Remix Project', 'Remixprojectgradgrey.jpg': 'The Remix Project / Black and white',
};
const musicPhotos = musicFiles.map(file => ({ ...photo('Music', file, captions[file] || 'Music production archive'),
  caption: captions[file] || '', graphic: file.startsWith('muso'), excludeFromCollage: file === 'Remixprojectgradgrey.jpg',
}));
const sportOrder = ['hoops.jpg', 'gym.jpg', 'Snowboarding.jpg'];
const sportFiles = await imageFiles('Sports');
sportFiles.sort((a,b) => (sportOrder.indexOf(a) < 0 ? 99 : sportOrder.indexOf(a)) - (sportOrder.indexOf(b) < 0 ? 99 : sportOrder.indexOf(b)) || a.localeCompare(b));
const sportCaptions = { 'hoops.jpg': 'Basketball', 'gym.jpg': 'Gym', 'Snowboarding.jpg': 'Snowboarding' };
const sportPhotos = sportFiles.map(file => ({ ...photo('Sports', file, sportCaptions[file] || 'Sports archive'), caption: sportCaptions[file] || '' }));
await writeFile('src/data/photoLibrary.js', 'export default ' + JSON.stringify({ travelTrips, musicPhotos, sportPhotos }, null, 2) + ';\n');
console.log('Synced ' + travelTrips.length + ' albums, ' + travelTrips.flatMap(trip => trip.photos).length + ' travel photos, ' + musicPhotos.length + ' music assets, and ' + sportPhotos.length + ' sports photos.');
