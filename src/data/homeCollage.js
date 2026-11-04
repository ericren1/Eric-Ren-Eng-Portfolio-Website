import { creativeCollections, travelPhotos } from './creative';
import { workPhotos } from './workPhotos';

// Authentic archive images. Placement is separate from content for easy curation.
export const homeCollage = [
  { photo: travelPhotos[0], x: 22, y: 2, width: 32, ratio: '3 / 4', tilt: '-8deg', layer: 2, duration: '3.9s', delay: '-4s' },
  { photo: workPhotos.summerConference, x: 59, y: 15, width: 37, ratio: '4 / 3', tilt: '8deg', layer: 3, duration: '4.6s', delay: '-13s' },
  { photo: creativeCollections[1].photos[0], x: 1, y: 35, width: 41, ratio: '4 / 3', tilt: '-5deg', layer: 4, duration: '5.2s', delay: '-8s' },
  { photo: workPhotos.fallLunch, x: 36, y: 35, width: 36, ratio: '4 / 3', position: '50% 86%', tilt: '5deg', layer: 6, duration: '4.6s', delay: '-3s' },
  { photo: travelPhotos[1], x: 3, y: 70, width: 35, ratio: '4 / 3', tilt: '7deg', layer: 5, duration: '4.6s', delay: '-17s' },
  { photo: creativeCollections[2].photos[0], x: 64, y: 60, width: 33, ratio: '5 / 4', tilt: '-7deg', layer: 7, duration: '4.6s', delay: '-10s' },
  { photo: creativeCollections[2].photos[1], x: 35, y: 70, width: 25, ratio: '4 / 5', tilt: '-4deg', layer: 8, duration: '5.2s', delay: '-16s' },
];
