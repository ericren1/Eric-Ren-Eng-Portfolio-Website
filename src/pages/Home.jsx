import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <section className="home-hero container">
        <p className="eyebrow">COMPUTER ENGINEERING · SOFTWARE ENGINEERING</p>

        <h1>
          Eric Ren
          <span>Computer Engineer.</span>
        </h1>

        <p className="home-intro">
          I’m a Computer Engineering student at Toronto Metropolitan University
          with experience building software across financial technology,
          full-stack development, backend systems, AI, and computer vision.
        </p>

        <div className="hero-actions">
          <a
            className="button primary"
            href="https://github.com/ericren1"
            target="_blank"
            rel="noreferrer"
          >
            GitHub ↗
          </a>

          <a
            className="button secondary"
            href="https://linkedin.com/in/ericren1/"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn ↗
          </a>
        </div>
      </section>

      <section className="home-paths container">

      <Link to="/experience" className="path-row">
          <div>
            <p className="eyebrow">01 · EXPERIENCE</p>
            <h2>Where I’ve worked.</h2>
          </div>
          <p>Software and technical experience across finance, healthcare, and web development.</p>
          <span className="path-arrow">→</span>
        </Link>

        <Link to="/projects" className="path-row">
          <div>
            <p className="eyebrow">02 · PROJECTS</p>
            <h2>Things I’ve built.</h2>
          </div>
          <p>Software, embedded systems, computer vision, and engineering projects.</p>
          <span className="path-arrow">→</span>
        </Link>

        

        <Link to="/about" className="path-row">
          <div>
            <p className="eyebrow">03 · ABOUT ME</p>
            <h2>Fun Facts.</h2>
          </div>
          <p>Interesting things about me.</p>
          <span className="path-arrow">→</span>
        </Link>
      </section>
    </>
  );
}
