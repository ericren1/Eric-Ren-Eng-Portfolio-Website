import { profile } from '../data/profile';
import HomeCollage from '../components/HomeCollage';
export default function Home() {
  return <div className="home-hero wrap"><div className="home-layout"><div className="home-copy">
    <h1 className="hero-name" id="home-heading">Eric Ren<span className="name-period">.</span></h1>
    <p className="hero-role"><span>Computer Engineering student</span><em>Software engineer.</em></p>
    <div className="home-quick-intro"><p>I like building software that solves real problems, whether that's scalable backend systems, embedded applications, or AI-powered tools. My experience spans fintech, full-stack development, and projects involving LLMs and computer vision.

Away from the screen, I'm usually making music, traveling, working out, or exploring something new.</p><div className="home-socials"><a href={profile.github} target="_blank" rel="noreferrer">GitHub ↗</a><a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a></div><a className="home-email" href={profile.contact}>{profile.email}</a></div>
  </div><HomeCollage /></div></div>;
}
