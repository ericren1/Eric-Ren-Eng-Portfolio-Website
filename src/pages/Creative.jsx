import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Photo from '../components/Photo';
import SectionHeading from '../components/SectionHeading';
import { creativeCollections, offClockBlurbs, travelTrips } from '../data/creative';

const labels = { travel: 'Photography/Travel', music: 'Music', fitness: 'Fitness & Sports', business: 'Business' };
function ScatterGallery({ photos, className = '', browse = false }) {
  return <div className={'scatter-gallery '+className}>{photos.map((photo,i)=><figure className={'scatter-image scatter-image--'+i} key={photo.src}>
    <Photo src={photo.src} alt={photo.alt} caption={photo.caption || photo.alt} gallery={photos} browse={browse} sizes={browse ? "(max-width: 700px) 86vw, (max-width: 1000px) 43vw, 355px" : "(max-width: 700px) 86vw, 355px"}/>
    {photo.caption&&<figcaption>{photo.caption}</figcaption>}
  </figure>)}</div>;
}
function MusicGallery({ photos }) {
  const photographs = photos.filter(photo=>!photo.graphic);
  const achievements = photos.filter(photo=>photo.graphic);
  const figure = photo => <figure className="scatter-image" key={photo.src}>
    <Photo src={photo.src} alt={photo.alt} caption={photo.caption || photo.alt} sizes="(max-width: 700px) 86vw, 55vw"/>
    {photo.caption&&<figcaption>{photo.caption}</figcaption>}
  </figure>;
  return <div className="music-gallery"><div className="music-photo-composition">
    {photographs[0]&&figure(photographs[0])}
    <div className="music-remix-photos">{photographs.slice(1).map(figure)}</div>
  </div><div className="music-achievements">{achievements.map(figure)}</div></div>;
}
function TravelPhotography() {
  const [params,setParams]=useSearchParams();
  const trip=travelTrips.find(item=>item.slug===params.get('album')) || null;
  const setTrip=selected=>setParams(previous=>{const next=new URLSearchParams(previous);if(selected)next.set('album',selected.slug);else next.delete('album');return next;});
  const title=useRef(null);
  const folderTrigger=useRef(null);
  const chooseTrip=selected=>{
    folderTrigger.current=selected.slug;setTrip(selected);
  };
  useEffect(()=>{if(trip){title.current?.focus({preventScroll:true});title.current?.scrollIntoView({block:'start',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}},[trip]);
  return <div className="travel-photography">
    {trip&&<header className="off-clock-subheading"><h3 ref={title} tabIndex="-1">{trip.title} <span className="album-date">{trip.date}</span></h3><div className="trip-breadcrumb"><button onClick={()=>{setTrip(null);requestAnimationFrame(()=>document.getElementById('album-'+folderTrigger.current)?.focus({preventScroll:true}));}}>← All albums</button></div></header>}
    {trip?<div className="trip-gallery"><ScatterGallery photos={trip.photos} browse/></div>:<div className="trip-folders">{travelTrips.map((item,i)=><article className={'trip-folder trip-folder--'+i} key={item.slug}>
      <div className="trip-folder-cover"><button className="trip-open" id={'album-'+item.slug} onClick={()=>chooseTrip(item)} aria-label={'Open '+item.title+' album'}>{[2,1,0].map(layer=>{const photo=item.photos[Math.min(layer,item.photos.length-1)];return <span className={'album-layer album-layer--'+layer} key={layer} aria-hidden={layer>0?true:undefined}><Photo src={photo.src} alt={layer===0?photo.alt:''} zoom={false} sizes="(max-width: 700px) 85vw, 38vw"/></span>;})}<span className="album-hover" aria-hidden="true">Open album <span>↗</span></span></button></div>
      <button className="trip-folder-name" onClick={()=>chooseTrip(item)}><span>{item.title} <small>{item.date}</small></span><span>{item.photos.length} {item.photos.length===1?'photograph':'photographs'} / {item.location}</span></button>
    </article>)}</div>}
  </div>;
}
export default function Creative() {
  const {hash}=useLocation();
  const navigate=useNavigate();
  const [active,setActive]=useState('travel');
  const tabs=useRef([]);
  useEffect(()=>{
    let slug=hash.replace(/^#(?:creative|off-the-clock)-/,'');
    if(slug==='ventures')slug='business';
    const target=creativeCollections.find(c=>c.slug===slug);
    setActive(target&&!target.disabled?slug:'travel');
  },[hash]);
  const collection=creativeCollections.find(c=>c.slug===active);
  const enabled=creativeCollections.flatMap((c,index)=>c.disabled?[]:[index]);
  const changeTab=index=>{if(creativeCollections[index].disabled)return;setActive(creativeCollections[index].slug);navigate('#off-the-clock-'+creativeCollections[index].slug,{preventScrollReset:true});tabs.current[index]?.focus();};
  return <div className="off-clock-section wrap">
    <SectionHeading id="off-the-clock-heading" index="04">Off the Clock</SectionHeading>
    <div className="off-clock-tabs" role="tablist" aria-label="Off the Clock collections">
      {creativeCollections.map((c,i)=><button key={c.slug} type="button" role="tab" className={c.slug==='business'?'is-muted':''}
        ref={node=>{tabs.current[i]=node;}} id={'off-clock-tab-'+c.slug} aria-controls="off-clock-panel" aria-selected={active===c.slug} disabled={c.disabled || undefined} aria-disabled={c.disabled || undefined} title={c.disabled?'Coming soon':undefined} tabIndex={active===c.slug?0:-1}
        onClick={()=>changeTab(i)} onKeyDown={event=>{
          let index;
          const position=enabled.indexOf(i);
          if(event.key==='ArrowRight')index=enabled[(position+1)%enabled.length];
          if(event.key==='ArrowLeft')index=enabled[(position-1+enabled.length)%enabled.length];
          if(event.key==='Home')index=enabled[0];
          if(event.key==='End')index=enabled[enabled.length-1];
          if(index!==undefined){event.preventDefault();changeTab(index);}
        }}>{labels[c.slug]}{c.disabled&&<small className="coming-soon">Coming soon</small>}</button>)}
    </div>
    <div id="off-clock-panel" className={'off-clock-panel off-clock-panel--'+active} role="tabpanel" aria-labelledby={'off-clock-tab-'+active} tabIndex="0">
      {active==='travel'?<TravelPhotography/>:<><div className={'off-clock-blurb off-clock-blurb--'+active}><h3>{active==='music'?'Music Production & Audio Engineering':'Fitness & Sports'}</h3>{active==='music'?offClockBlurbs.music.map(paragraph=><p key={paragraph}>{paragraph}</p>):<p>{offClockBlurbs.fitness}</p>}</div>{active==='music'?<MusicGallery photos={collection.photos}/>:<ScatterGallery key={active} photos={collection.photos} className={'scatter-gallery--'+active}/>}</>}
    </div>
  </div>;
}
