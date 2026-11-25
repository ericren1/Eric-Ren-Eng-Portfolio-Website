import { travelPhotos, travelTrips, creativeCollections } from './creative.js';
import { workPhotos } from './workPhotos.js';

// Dates come from Eric's album names and internship seasons, never file order.
// Unknown dates stay null and follow dated images in an explicit curated order.
const music = creativeCollections[1].photos.filter(photo => !photo.graphic && !photo.excludeFromCollage);
const sports = creativeCollections[2].photos;
const work = [workPhotos.fallLunch, workPhotos.summerConference, workPhotos.fallSpeedMentoring];
const curatedOrder = Array.from({length:3},(_,round)=>[
  work[round], music[round], sports[round],
  ...(round<2 ? travelTrips.slice(0,round===0?6:4).map(trip=>trip.photos[round]) : []),
]).flat().filter(Boolean).map(photo=>photo.src);
export const contactSheetConfig = { count: 20, pinned: ['/images/about me photo.jpg'], excluded: [], order: curatedOrder };
export const photoArchive = [
  { src: '/images/about me photo.jpg', alt: 'Portrait of Eric Ren', date: null },
  { ...workPhotos.fallLunch, date: '2026-10-08', dateSource: 'EXIF DateTimeOriginal: 2026:10:08 13:53:17' },
  { ...workPhotos.fallSpeedMentoring, date: '2026-09', dateSource: 'Fall 2026 internship' },
  { ...workPhotos.summerConference, date: '2026-05', dateSource: 'Summer 2026 internship' },
  ...travelPhotos,
  ...creativeCollections[1].photos.filter(photo => !photo.graphic && !photo.excludeFromCollage),
  ...creativeCollections[2].photos,
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
