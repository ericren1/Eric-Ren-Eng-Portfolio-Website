import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
const links = [['about','About'],['experience','Experience'],['projects','Projects'],['off-the-clock','Off the Clock']];
export default function Navbar() {
  const [active,setActive]=useState('home');
  useEffect(()=>{
    let frame;
    const update=()=>{frame=requestAnimationFrame(()=>{
      const line=(document.querySelector('.site-header')?.offsetHeight || 80)+130;
      const current=['home',...links.map(([id])=>id)].filter(id=>document.getElementById(id)?.getBoundingClientRect().top<=line).pop();
      setActive(current || 'home');
    });};
    window.addEventListener('scroll',update,{passive:true});update();
    return()=>{window.removeEventListener('scroll',update);cancelAnimationFrame(frame);};
  },[]);
  return <header className="site-header"><a className="skip-link" href="#main">Skip to content</a><nav className="sticky-navigation wrap" aria-label="Portfolio sections">
    <Link className="brand" to="/#home" aria-label="Eric Ren, home">Eric Ren</Link>
    <div className="nav-section-links">{links.map(([id,label])=><Link key={id} className={id==='off-the-clock'?'nav-off-clock':undefined} to={'/#'+id} aria-current={active===id?'location':undefined}>{label}</Link>)}</div>
    <span className="nav-location">Toronto, Canada</span>
  </nav></header>;
}
