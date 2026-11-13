import { travelPhotos, creativeCollections } from './creative.js';
import { workPhotos } from './workPhotos.js';

// Dates come from Eric's album names and internship seasons, never file order.
// Unknown dates stay null and follow dated images in an explicit curated order.
export const contactSheetConfig = { count: 25, pinned: ['/images/about me photo.jpg'], excluded: [], order: [] };
export const photoArchive = [
  { src: '/images/about me photo.jpg', alt: 'Portrait of Eric Ren', date: null },
  { ...workPhotos.fallLunch, date: '2026-10-08', dateSource: 'EXIF DateTimeOriginal: 2026:10:08 13:53:17' },
  { ...workPhotos.fallSpeedMentoring, date: '2026-09', dateSource: 'Fall 2026 internship' },
  { ...travelPhotos[0], date: '2026-08', dateSource: 'China / August 2026 album' },
  { ...workPhotos.summerConference, date: '2026-05', dateSource: 'Summer 2026 internship' },
  { ...travelPhotos[2], date: '2025', dateSource: 'F1 Miami 2025 album' },
  { ...travelPhotos[3], date: '2025', dateSource: 'Eastern Caribbean 2025 album' },
  { ...travelPhotos[4], date: '2025', dateSource: 'Eastern Caribbean 2025 album' },
  { ...travelPhotos[1], date: '2023', dateSource: 'Mexico 2023 album' },
  ...[creativeCollections[1].photos[0], ...creativeCollections[2].photos].map(photo => ({ ...photo, date: null })),
];
export function selectContactPhotos(config = contactSheetConfig) {
  const rank = photo => config.order.indexOf(photo.src);
  const photos = [...new Map(photoArchive.filter(photo => !config.excluded.includes(photo.src)).map(photo => [photo.src, photo])).values()];
  return photos.sort((a,b) => {
    const pinned = Number(config.pinned.includes(b.src)) - Number(config.pinned.includes(a.src));
    if (pinned) return pinned;
    if (rank(a) >= 0 || rank(b) >= 0) return (rank(a) < 0 ? Infinity : rank(a)) - (rank(b) < 0 ? Infinity : rank(b));
    return (b.date || '').localeCompare(a.date || '');
  }).slice(0, config.count);
}
