import { profile } from '../data/profile';
import HomeCollage from '../components/HomeCollage';
export default function Home() {
  return <div className="home-hero wrap"><div className="home-layout"><div className="home-copy">
    <h1 className="hero-name" id="home-heading">Eric Ren<span className="name-period">.</span></h1>
    <p className="hero-role"><span>Computer Engineering student</span><em>Software engineer.</em></p>
    <div className="home-quick-intro"><p>I'm a Computer Engineering student at Toronto Metropolitan University who enjoys building useful software, solving challenging problems, and turning ideas into real products.</p><div className="home-socials"><a href={profile.github} target="_blank" rel="noreferrer">GitHub ↗</a><a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a></div><a className="home-email" href={profile.contact}>{profile.email}</a></div>
  </div><HomeCollage /></div></div>;
}
