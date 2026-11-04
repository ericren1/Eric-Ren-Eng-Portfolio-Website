import { Link } from 'react-router-dom';
import { profile } from '../data/profile';
export default function Footer() {
  return <footer className="site-footer compact-footer" id="contact">
    <div className="footer-identity"><Link className="footer-name" to="/#home">Eric Ren</Link><span>Toronto, Canada</span></div>
    <div className="footer-links"><a href={profile.github} target="_blank" rel="noreferrer">GitHub ↗</a><a href={profile.contact}>{profile.email}</a><a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a></div>
    <span className="footer-copyright">© {new Date().getFullYear()}</span>
  </footer>;
}
