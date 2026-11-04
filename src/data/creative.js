export const travelPhotos = [
  { src: '/images/shanghai.jpg', alt: 'Shanghai skyline illuminated at night across the river', caption: 'Shanghai, China', destination: 'Shanghai', shape: 'tall' },
  { src: '/images/mexico.jpg', alt: 'Travel photograph from Tulum, Mexico', caption: 'Tulum, Quintana Roo, Mexico', destination: 'Tulum', shape: 'tall' },
  { src: '/images/Miami.jpg', alt: 'Formula 1 in Miami, Florida', caption: 'F1 Miami, Florida', destination: 'Miami', shape: 'wide' },
  { src: '/images/Yodaguy museum.jpg', alt: 'Inside the Yoda Guy Movie Exhibit', caption: 'Yoda Guy Movie Exhibit · Philipsburg, Sint Maarten', destination: 'Sint Maarten', shape: 'tall' },
  { src: '/images/cruise.jpg', alt: 'Eric standing by the water during his travels', caption: 'By the water · Personal travel archive', destination: 'Travel notes', shape: 'tall' },
];
export const creativeCollections = [
  { slug: 'travel', label: 'Travel & Photography', short: 'Places', number: '01', image: '/images/shanghai.jpg', intro: 'A few places that changed the view. Travel pulls me out of familiar routines and into different ways of living, thinking, and seeing.', photos: travelPhotos },
  { slug: 'music', label: 'Music & Audio', short: 'Sound', number: '02', image: '/images/asfasf.jpg', intro: 'Music production and audio engineering are another way I like to build: listening closely, making small decisions, and shaping something from the ground up.', photos: [
    { src: '/images/asfasf.jpg', alt: 'Music production studio', caption: 'In the studio', shape: 'wide' },
    { src: '/images/ba1.png', alt: 'User-supplied MUSO.AI 2025 producer chart for Renzo On Da Track', caption: 'MUSO.AI · 2025 producer chart · User-supplied archive', shape: 'tall' },
    { src: '/images/fasaf.png', alt: 'User-supplied MUSO.AI 2025 production summary for Renzo On Da Track', caption: 'MUSO.AI · 2025 summary · User-supplied archive', shape: 'tall' },
  ] },
  { slug: 'fitness', label: 'Fitness & Sports', short: 'Movement', number: '03', image: '/images/hoops.jpg', intro: 'The work you come back to. Basketball and consistent training have taught me about teamwork, discipline, and the value of showing up.', photos: [
    { src: '/images/hoops.jpg', alt: 'Basketball photograph from the personal sports archive', caption: 'On the court', shape: 'wide' },
    { src: '/images/gym.jpg', alt: 'Eric training in the gym', caption: 'Training notes', shape: 'tall' },
  ] },
  { slug: 'business', label: 'Business', short: 'Business', number: '04', disabled: true, intro: 'Independent work, built from the ground up. My creative practice has included building an online business alongside music production.', photos: [] },
];

// Trip names and dates supplied by Eric. Add genuine photographs to each array.
export const travelTrips = [
  { slug: 'china-2026', title: 'China', date: 'August ’26', location: 'China', photos: [travelPhotos[0]] },
  { slug: 'f1-miami-2025', title: 'F1 Miami', date: '’25', location: 'Miami, Florida', photos: [travelPhotos[2]] },
  { slug: 'eastern-caribbean-2025', title: 'Eastern Caribbean', date: '’25', location: 'Eastern Caribbean', photos: [travelPhotos[3], travelPhotos[4]] },
  { slug: 'mexico-cancun-2023', title: 'Mexico, Cancun', date: '’23', location: 'Cancun, Mexico', photos: [travelPhotos[1]] },
];

// These blurbs are the editable introductions for the scrollable personal galleries.
export const offClockBlurbs = {
  music: 'I produce and engineer music as Renzo On Da Track. I enjoy the process of listening closely, shaping a sound, and building a track one decision at a time. Here’s a look inside the studio and a few pieces from my production archive.',
};

export const fitnessStories = [
  { title: 'Basketball', text: 'Basketball gives me a different kind of challenge: reading the game, trusting the people around me, and staying present. I enjoy the teamwork and the chance to keep improving every time I step onto the court.' },
  { title: 'Gym', text: 'Strength training is a steady part of my routine. I like the process of showing up, putting in the work, and making progress over time. It’s a place to reset and practice consistency outside of engineering.' },
];
