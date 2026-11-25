import photoLibrary from './photoLibrary.js';

export const travelTrips = photoLibrary.travelTrips;
export const travelPhotos = travelTrips.flatMap(trip => trip.photos);
export const creativeCollections = [
  { slug: 'travel', label: 'Photography/Travel', short: 'Places', number: '01', image: travelPhotos[0]?.src, intro: 'A few places that changed the view.', photos: travelPhotos },
  { slug: 'music', label: 'Music & Audio', short: 'Sound', number: '02', image: photoLibrary.musicPhotos[0]?.src, intro: 'Music production and audio engineering.', photos: photoLibrary.musicPhotos },
  { slug: 'fitness', label: 'Fitness & Sports', short: 'Movement', number: '03', image: photoLibrary.sportPhotos[0]?.src, intro: 'Basketball, consistent training, and time outside.', photos: photoLibrary.sportPhotos },
  { slug: 'business', label: 'Business', short: 'Business', number: '04', disabled: true, intro: 'Independent work, built from the ground up.', photos: [] },
];

export const offClockBlurbs = {
  fitness: "I enjoy playing basketball and played on an OBA team in high school. I also like working out and snowboarding.",
  music: ["I produce music and work as an audio engineer, with experience recording, mixing, and mastering artists in professional studios. I was also part of The Remix Project's Round 18 cohort. I've worked with gold- and platinum-selling artists and built an online music production business that generated over 200,000 impressions and $20,000 in revenue.","Music has been one of my biggest creative outlets, and I enjoy everything from developing an idea into a finished track to helping artists bring their sound to life."],
};
