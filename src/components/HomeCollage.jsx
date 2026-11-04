import { useEffect, useRef, useState } from 'react';
import Photo from './Photo';
import { homeCollage } from '../data/homeCollage';

const gallery = homeCollage.map(item => item.photo);
export default function HomeCollage() {
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [visible, setVisible] = useState(true);
  const collage = useRef(null);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const change = event => setReduced(event.matches);
    preference.addEventListener('change', change);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(collage.current);
    return () => { preference.removeEventListener('change', change); observer.disconnect(); };
  }, []);
  return <aside ref={collage} className={'home-collage'+(!paused && !reduced && visible ? ' is-moving' : '')} aria-label="Interactive personal photo collage">
    <div className="collage-board">{homeCollage.map((item,i) => <div className="collage-item" key={item.photo.src} style={{ '--x': item.x+'%', '--y': item.y+'%', '--width': item.width+'%', '--ratio': item.ratio, '--photo-position': item.position || 'center', '--tilt': item.tilt, '--layer': item.layer, '--duration': item.duration, '--delay': item.delay }}>
      <div className="collage-drift"><Photo src={item.photo.src} alt={item.photo.alt} caption={item.photo.caption} gallery={gallery} sizes="(max-width: 760px) 42vw, 25vw" eager={i<3} /></div>
    </div>)}</div>
    {!reduced && <button className="collage-motion-control" type="button" onClick={() => setPaused(value => !value)}>{paused ? 'Play motion' : 'Pause motion'} <span aria-hidden="true">{paused ? '▷' : 'Ⅱ'}</span></button>}
  </aside>;
}
