import { useEffect, useState } from 'react';
import { Link, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import ImageViewer from './components/ImageViewer';
import VisitorTracker from './components/VisitorTracker';
import Creative from './pages/Creative';
import Privacy from './pages/Privacy';
import { profile } from './data/profile';
import { EditorialHome, ExperienceIndex, CompanyExperience, FeaturedProject, MoreProjects, NotFound, SocialIcon } from './pages/Editorial';

function ThemeToggle({theme,toggle}){return <button className="theme-toggle" onClick={toggle} aria-label={'Switch to '+(theme==='light'?'dark':'light')+' mode'}><svg viewBox="0 0 24 24" aria-hidden="true">{theme==='light'?<><circle cx="12" cy="12" r="4"/><path d="M12 1v3m0 16v3M1 12h3m16 0h3M4.2 4.2l2.1 2.1m11.4 11.4 2.1 2.1M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></>:<path d="M20 15.5A9 9 0 0 1 8.5 4 9 9 0 1 0 20 15.5Z"/>}</svg><span>{theme==='light'?'Light':'Dark'}</span></button>;}
function Header({theme,toggle}){
 const home=useLocation().pathname==='/';
 return <header className={'editorial-header'+(home?' editorial-header--home':'')}><a href="#main" className="skip-link">Skip to content</a>{!home&&<Link to="/" className="signature" aria-label="Eric Ren, home">Eric Ren</Link>}<ThemeToggle theme={theme} toggle={toggle}/></header>;
}
function PersistentContact(){
 return <nav className="persistent-contact" aria-label="Contact and social profiles">{[['LinkedIn',profile.linkedin],['GitHub',profile.github],['Email',profile.contact]].map(([label,url])=><a key={label} href={url} target={label==='Email'?undefined:'_blank'} rel={label==='Email'?undefined:'noreferrer'} aria-label={label==='Email'?'Email '+profile.email:label}><SocialIcon type={label}/><span>{label}</span><span aria-hidden="true">&#8599;</span></a>)}</nav>;
}
function RouteFocus(){
 const {pathname,hash}=useLocation();
 useEffect(()=>{
   const timer=setTimeout(()=>{
     const target=hash?document.getElementById(decodeURIComponent(hash.slice(1))):null;
     if(target)target.scrollIntoView({block:'start'});else {window.scrollTo(0,0);document.getElementById('main')?.scrollTo(0,0);}
     const heading=target?.querySelector('h1,h2')||document.querySelector('main h1');
     if(heading){heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});}
     document.title='Eric Ren';
   },30);
   return ()=>clearTimeout(timer);
 },[pathname]);
 return null;
}
function OutsideWork(){return <div className="outside-page"><Link to="/" className="back-link">&larr; Home</Link><h1 className="sr-only">More About Me</h1><Creative/></div>;}
function LegacyCreative(){const {category}=useParams();return <Navigate to={'/more-about-me#off-the-clock-'+(category||'travel')} replace/>;}
function Root(){const {hash}=useLocation();if(hash.startsWith('#project-'))return <Navigate to={'/projects/'+hash.slice(9)} replace/>;if(hash.startsWith('#off-the-clock')||hash.startsWith('#creative')||hash==='#about')return <Navigate to={'/more-about-me'+(hash==='#about'?'':hash)} replace/>;if(hash==='#experience'||hash.startsWith('#td-'))return <Navigate to={'/experience'+(hash.startsWith('#td-')?'/td-securities'+hash:'')} replace/>;if(hash==='#projects')return <Navigate to="/more-projects" replace/>;return <EditorialHome/>;}
export default function App(){
 const [theme,setTheme]=useState(()=>{try{return localStorage.getItem('portfolio-theme')==='dark'?'dark':'light';}catch{return 'light';}});
 useEffect(()=>{document.documentElement.dataset.theme=theme;try{localStorage.setItem('portfolio-theme',theme);}catch{}document.querySelector('meta[name="theme-color"]')?.setAttribute('content',theme==='light'?'#E8E5DD':'#252622');},[theme]);
 return <ImageViewer><VisitorTracker/><Header theme={theme} toggle={()=>setTheme(value=>value==='light'?'dark':'light')}/><RouteFocus/><main id="main"><Routes>
 <Route path="/" element={<Root/>}/><Route path="/experience" element={<ExperienceIndex/>}/><Route path="/experience/:companySlug" element={<CompanyExperience/>}/><Route path="/projects/:projectSlug" element={<FeaturedProject/>}/><Route path="/more-projects" element={<MoreProjects/>}/><Route path="/projects" element={<Navigate to="/more-projects" replace/>}/><Route path="/more-about-me" element={<OutsideWork/>}/><Route path="/creative/:category" element={<LegacyCreative/>}/><Route path="/off-the-clock/:category" element={<LegacyCreative/>}/>{['creative','off-the-clock','about'].map(path=><Route key={path} path={'/'+path} element={<Navigate to="/more-about-me" replace/>}/>)}<Route path="*" element={<NotFound/>}/>
 <Route path="/privacy" element={<Privacy/>}/></Routes></main><PersistentContact/></ImageViewer>;
}
