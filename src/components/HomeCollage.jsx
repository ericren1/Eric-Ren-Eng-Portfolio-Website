import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import images from '../data/images.json';
import { selectContactPhotos } from '../data/contactSheet';

const photos = selectContactPhotos();
const assemblyDuration = 850;
const waveDelay = 50;
const placements = [
  [9,7,-12,1.05],[40,2,8,.85],[72,10,-5,1.05],[1,36,6,.95],
  [34,28,-9,1.2],[67,37,12,1.08],[13,64,-6,.9],[45,65,7,1.1],
  [78,71,-8,.9],[55,48,-4,.95],[20,46,10,.84],[75,51,5,.9],
  [100,-10,-7,.62],[60,75,-4,.84],[-115,22,7,.6],[5,75,6,.8],
  [95,100,-9,.65],[75,35,-8,.82],
  [3,17,-6,.8],[62,82,9,.8],
];
const roaming = {
  2: [-87,-7,-13,.68], 6: [-55,48,9,.7], 10: [-114,105,-8,.6],
  12: [100,-10,-7,.62], 14: [-115,22,7,.6], 16: [95,100,-9,.65],
};
function setDriftBounds(tile, frame, drift, canvas) {
  const matrix = new DOMMatrix(tile.style.transform), inverse = matrix.inverse();
  const width = parseFloat(frame.style.width), height = parseFloat(frame.style.height);
  const bounds = canvas.getBoundingClientRect();
  const wide = window.innerWidth >= 1000;
  const area = wide ? {left:0,top:0,right:window.innerWidth,bottom:window.innerHeight} : bounds;
  const rawX = parseFloat(drift.style.getPropertyValue('--drift-x'));
  const rawY = parseFloat(drift.style.getPropertyValue('--drift-y'));
  const desiredX = wide ? rawX : Math.sign(rawX)*15;
  const desiredY = wide ? rawY : Math.sign(rawY)*12;
  const fit = (x,y) => {
    const translated = matrix.translate(x,y);
    const corners = [[0,0],[width,0],[0,height],[width,height]].map(([px,py])=>translated.transformPoint({x:px,y:py}));
    const left = Math.min(...corners.map(point=>point.x))+bounds.left;
    const right = Math.max(...corners.map(point=>point.x))+bounds.left;
    const top = Math.min(...corners.map(point=>point.y))+bounds.top;
    const bottom = Math.max(...corners.map(point=>point.y))+bounds.top;
    const dx = left<area.left+12 ? area.left+12-left : right>area.right-12 ? area.right-12-right : 0;
    const dy = top<area.top+12 ? area.top+12-top : bottom>area.bottom-12 ? area.bottom-12-bottom : 0;
    return [x+inverse.a*dx+inverse.c*dy,y+inverse.b*dx+inverse.d*dy];
  };
  for (const [name,point] of [['start',fit(0,0)],['from',fit(-desiredX*.65,-desiredY*.65)],['to',fit(desiredX,desiredY)]]) {
    drift.style.setProperty('--bounded-'+name+'-x',point[0]+'px');
    drift.style.setProperty('--bounded-'+name+'-y',point[1]+'px');
  }
}
export default function HomeCollage() {
  const board = useRef(null);
  const tiles = useRef([]);
  const animations = useRef([]);
  const touch = useRef(false);
  const firstTouch = useRef(false);
  const previousSize = useRef(null);
  const drag = useRef(null);
  const manualTransforms = useRef({});
  const [draggingIndex,setDraggingIndex] = useState(null);
  const [selectedPhoto,setSelectedPhoto] = useState(null);
  const [size,setSize] = useState({width:600,height:650});
  const [assembled,setAssembled] = useState(false);
  const [ready,setReady] = useState(false);
  const [paused,setPaused] = useState(false);
  const [hidden,setHidden] = useState(document.hidden);
  useEffect(()=>{const update=()=>setHidden(document.hidden);document.addEventListener('visibilitychange',update);return ()=>document.removeEventListener('visibilitychange',update);},[]);
  const [reduced,setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setSize({width:entry.contentRect.width,height:entry.contentRect.height}));
    observer.observe(board.current);
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => setReduced(media.matches);
    media.addEventListener('change',change);
    return () => {observer.disconnect(); media.removeEventListener('change',change);};
  },[]);
  useLayoutEffect(() => {
    const resized = !previousSize.current || previousSize.current.width !== size.width || previousSize.current.height !== size.height;
    previousSize.current = size;
    if (resized) manualTransforms.current = {};
    const compact = assembled || reduced;
    const cols = Math.ceil(Math.sqrt(photos.length));
    const rows = Math.ceil(photos.length / cols);
    const sheet = size.width * .63;
    const cell = sheet / cols;
    const gap = Math.max(3,size.width * .007);
    const waveCount = cols + rows - 2;
    const timer = setTimeout(() => setReady(compact),reduced ? 0 : compact ? assemblyDuration + waveCount * waveDelay : 0);
    if (!compact) setReady(false);
    tiles.current.forEach((tile,index) => {
      if (!tile) return;
      const col = index % cols, row = Math.floor(index / cols);
      const placement = (window.innerWidth >= 1000 && roaming[index]) || placements[index] || [8+(index*31)%72,4+(index*23)%74,(index%2?1:-1)*7,.9];
      const [x,y,angle,scale] = placement;
      const base = size.width * .25 * scale;
      const transform = compact
        ? `translate3d(${(size.width-sheet)/2+col*cell}px,${(size.height-rows*cell)/2+row*cell}px,0) rotate(0deg) scale(${(cell-gap)/100})`
        : manualTransforms.current[index] || `translate3d(${size.width*x/100}px,${size.height*y/100}px,0) rotate(${angle}deg) scale(${base/100})`;
      const frameSize = {width:!compact && index%3===2?'75px':'100px',height:!compact && index%3===1?'70px':'100px'};
      const drift = tile.querySelector('.contact-drift');
      const frame = tile.querySelector('.contact-frame');
      // Preserve the visible position, including drift, on interrupted assembly.
      const visibleTransform = new DOMMatrix(getComputedStyle(tile).transform)
        .multiply(new DOMMatrix(getComputedStyle(drift).transform));
      const previousFrame = {width:getComputedStyle(frame).width,height:getComputedStyle(frame).height};
      animations.current[index]?.forEach(animation => animation.cancel());
      drift.style.animationName = compact ? 'none' : '';
      drift.style.transform = compact ? 'none' : '';
      tile.style.transform = transform;
      frame.style.width = frameSize.width;
      frame.style.height = frameSize.height;
      if (!compact) setDriftBounds(tile,frame,drift,board.current);
      const fromTransform = visibleTransform.multiply(new DOMMatrix(getComputedStyle(drift).transform).inverse()).toString();
      if (reduced || resized || !tile.dataset.initialized) tile.dataset.initialized='true';
      else {
        const timing = { duration:assemblyDuration,delay:(compact ? row+col : waveCount-row-col)*waveDelay,
          easing:'cubic-bezier(.35,0,.25,1)',fill:'backwards' };
        animations.current[index] = [
          tile.animate([{transform:fromTransform},{transform}],timing),
          frame.animate([previousFrame,frameSize],timing),
        ];
      }
    });
    return () => clearTimeout(timer);
  },[assembled,reduced,size]);
  const movePhoto = (index,x,y) => {
    const tile = tiles.current[index];
    const matrix = new DOMMatrix(tile.style.transform);
    const canvas = board.current.getBoundingClientRect(), bounds = tile.getBoundingClientRect();
    x = Math.max(-canvas.left+10,Math.min(window.innerWidth-canvas.left-bounds.width-10,x));
    y = Math.max(-canvas.top+10,Math.min(window.innerHeight-canvas.top-bounds.height-10,y));
    matrix.e = x; matrix.f = y;
    tile.style.transform = matrix.toString();
    manualTransforms.current[index] = tile.style.transform;
  };
  const beginDrag = (event,index) => {
    if (event.button !== 0 || assembled || reduced) return;
    event.preventDefault(); event.stopPropagation();
    const tile = tiles.current[index], drift = tile.querySelector('.contact-drift');
    const matrix = new DOMMatrix(getComputedStyle(tile).transform).multiply(new DOMMatrix(getComputedStyle(drift).transform));
    const frame = tile.querySelector('.contact-frame');
    const frameSize = {width:getComputedStyle(frame).width,height:getComputedStyle(frame).height};
    animations.current[index]?.forEach(animation=>animation.cancel());
    Object.assign(frame.style,frameSize);
    drift.style.animationName='none'; drift.style.transform='none';
    tile.style.transform=matrix.toString();
    drag.current={index,x:event.clientX,y:event.clientY,matrix};
    event.currentTarget.setPointerCapture(event.pointerId);
    setDraggingIndex(index);
  };
  const endDrag = event => {
    if (!drag.current) return;
    const index=drag.current.index;
    if(Math.hypot(event.clientX-drag.current.x,event.clientY-drag.current.y)<5)setSelectedPhoto(index);
    else setSelectedPhoto(null);
    const tile=tiles.current[index], drift=tile.querySelector('.contact-drift');
    const droppedTransform=new DOMMatrix(tile.style.transform);
    setDriftBounds(tile,tile.querySelector('.contact-frame'),drift,board.current);
    drift.style.animationDelay='0s';
    drift.style.animationName=''; drift.style.transform='';
    // Resume at the drop location without jumping to the drift animation's phase.
    const resumedDrift=new DOMMatrix(getComputedStyle(drift).transform);
    tile.style.transform=droppedTransform.multiply(resumedDrift.inverse()).toString();
    manualTransforms.current[index]=tile.style.transform;
    drag.current=null; setDraggingIndex(null);
    if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);
  };
  useEffect(()=>{
    if(selectedPhoto===null)return;
    const place=event=>{
      if(event.target.closest('a,button,.contact-tile'))return;
      const bounds=board.current.getBoundingClientRect();
      movePhoto(selectedPhoto,event.clientX-bounds.left,event.clientY-bounds.top);
      const tile=tiles.current[selectedPhoto];
      setDriftBounds(tile,tile.querySelector('.contact-frame'),tile.querySelector('.contact-drift'),board.current);
      setSelectedPhoto(null);
    };
    const cancel=event=>{if(event.key==='Escape')setSelectedPhoto(null);};
    window.addEventListener('pointerdown',place);window.addEventListener('keydown',cancel);
    return ()=>{window.removeEventListener('pointerdown',place);window.removeEventListener('keydown',cancel);};
  },[selectedPhoto,size]);
  const renderPhoto = (photo,index) => {
    const movable = window.innerWidth >= 1000 && Boolean(roaming[index]);
    const info=images[photo.src],variants=info?.variants||[];
    return <span className={'contact-tile'+(movable?' contact-tile--roaming':'')+(draggingIndex===index?' is-dragging':'')+(selectedPhoto===index?' is-selected':'')}
      key={photo.src} ref={node=>{tiles.current[index]=node;}} style={{zIndex:movable?1:index+1}}
      role={movable?'button':undefined} tabIndex={movable&&!assembled&&!reduced?0:undefined}
      aria-label={movable?'Move photograph: '+photo.alt:undefined} aria-describedby={movable?'photo-drag-help':undefined}
      onPointerDown={movable?event=>beginDrag(event,index):undefined}
      onPointerMove={movable?event=>{if(drag.current?.index!==index)return;event.preventDefault();const current=drag.current;movePhoto(index,current.matrix.e+event.clientX-current.x,current.matrix.f+event.clientY-current.y);}:undefined}
      onPointerUp={movable?endDrag:undefined} onPointerCancel={movable?endDrag:undefined} onLostPointerCapture={movable?endDrag:undefined}
      onKeyDown={movable?event=>{
        const steps={ArrowLeft:[-20,0],ArrowRight:[20,0],ArrowUp:[0,-20],ArrowDown:[0,20]};
        if(steps[event.key]){event.preventDefault();const matrix=new DOMMatrix(tiles.current[index].style.transform);movePhoto(index,matrix.e+steps[event.key][0],matrix.f+steps[event.key][1]);}
        if(event.key==='Enter'||event.key===' '){event.preventDefault();board.current.focus();setAssembled(true);}
      }:undefined}>
      <span className="contact-drift" style={{animationDuration:(8+index%5*1.25)+'s',animationDelay:(-index*2.1)+'s','--drift-x':(index%2?-1:1)*(roaming[index]?160:30+index%3*15)+'px','--drift-y':(index%3?-1:1)*(roaming[index]?140:25+index%4*8)+'px'}}>
        <span className="contact-frame"><img src={variants[0]?.src||photo.src} srcSet={variants.map(v=>`${v.src} ${v.width}w`).join(", ")} sizes="(max-width: 700px) 120px, 180px" width="100" height="100" alt="" draggable="false" decoding="async" loading="eager" onError={event=>{if(event.currentTarget.dataset.originalFallback)return;event.currentTarget.dataset.originalFallback='true';event.currentTarget.src=photo.src;}}/></span>
      </span>
    </span>;
  };
  const wide = window.innerWidth >= 1000;
  return <div className={'contact-sheet-wrap'+((assembled||reduced)?' is-assembled':'')+(paused||hidden?' is-paused':'')}>
    <span className="sr-only" id="photo-drag-help">Drag to move this photograph, or click it and then click an empty area to place it. Use arrow keys to move it with the keyboard, or Enter to return to the contact sheet.</span>
    {selectedPhoto!==null&&<p className="photo-place-hint" role="status">Click an empty area to place the photo. Escape to cancel.</p>}
    <Link ref={board} to="/more-about-me" className={'contact-canvas'+((assembled||reduced)?' is-assembled':'')+(ready?' is-ready':'')+(paused||hidden?' is-paused':'')}
      aria-label="More about me: travel, music, fitness, and life outside work"
      onPointerEnter={event=>{if(event.pointerType!=='touch'&&!drag.current)setAssembled(true);}}
      onPointerLeave={event=>{if(event.pointerType!=='touch')setAssembled(false);}}
      onPointerDown={event=>{touch.current=event.pointerType==='touch';firstTouch.current=touch.current&&!assembled&&!reduced;}}
      onFocus={()=>setAssembled(true)} onBlur={()=>setAssembled(false)}
      onClick={event=>{if(firstTouch.current){event.preventDefault();firstTouch.current=false;setAssembled(true);}}}>
      {photos.map((photo,index)=>wide&&roaming[index]?null:renderPhoto(photo,index))}
      <span className="contact-overlay">More About Me <span aria-hidden="true">&#8599;</span></span>
    </Link>
    {wide&&photos.map((photo,index)=>roaming[index]?renderPhoto(photo,index):null)}
    <div className="contact-caption"><Link className="contact-explore" to="/more-about-me">More About Me <span aria-hidden="true">&#8599;</span></Link><span className="touch-caption">{assembled||reduced?"Tap the contact sheet to explore":"Tap to arrange the photographs"}</span><button onClick={()=>setPaused(value=>!value)} aria-pressed={paused}>{paused?'Resume motion':'Pause motion'}</button></div>
  </div>;
}
