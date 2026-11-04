import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Experience from './pages/Experience';
import About from './pages/About';
import Creative from './pages/Creative';
import ImageViewer from './components/ImageViewer';

function ScrollToSection() {
  const { hash, key } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const id = decodeURIComponent(hash.slice(1));
    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(id) || ((id === 'creative' || id.startsWith('creative-') || id.startsWith('off-the-clock-')) ? document.getElementById('off-the-clock') : null);
      if (!target) return;
      const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
      if (id === 'home') window.scrollTo({ top: 0, behavior });
      else target.scrollIntoView({ behavior, block: 'start' });
      const heading = target.querySelector('h1,h2,h3') || target;
      heading.setAttribute('tabindex', '-1'); heading.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [hash, key]);
  return null;
}
function LegacyProject() {
  const { projectSlug } = useParams();
  return <Navigate to={`/#project-${projectSlug}`} replace />;
}
function LegacyCreative() {
  const { category } = useParams();
  return <Navigate to={`/#off-the-clock-${category === 'ventures' ? 'business' : category}`} replace />;
}
function Portfolio() {
  return <ImageViewer><ScrollToSection /><Navbar /><main id="main" tabIndex="-1">
    <section id="home" aria-labelledby="home-heading"><Home /></section>
    <section id="about" className="portfolio-section" aria-labelledby="about-heading"><About /></section>
    <section id="experience" className="portfolio-section" aria-labelledby="experience-heading"><Experience /></section>
    <section id="projects" className="portfolio-section" aria-labelledby="projects-heading"><Projects /></section>
    <section id="off-the-clock" className="portfolio-section" aria-labelledby="off-the-clock-heading"><Creative /></section>
  </main><Footer /></ImageViewer>;
}
export default function App() {
  return <Routes><Route path="/" element={<Portfolio />} /><Route path="/projects/:projectSlug" element={<LegacyProject />} /><Route path="/creative/:category" element={<LegacyCreative />} /><Route path="/off-the-clock/:category" element={<LegacyCreative />} /><Route path="/creative" element={<Navigate to="/#off-the-clock" replace />} />{['experience','projects','about','off-the-clock'].map(section => <Route key={section} path={'/'+section} element={<Navigate to={'/#'+section} replace />} />)}<Route path="*" element={<Navigate to="/" replace />} /></Routes>;
}
