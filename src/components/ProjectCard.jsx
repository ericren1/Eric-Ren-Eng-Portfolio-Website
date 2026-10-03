export default function ProjectCard({ project, number }) {
  return (
    <article className="project-card">
      <div className="project-number">{number}</div>

      <div className="project-content">
        <p className="project-type">{project.type}</p>
        <h2>{project.title}</h2>
        <p className="project-description">{project.description}</p>

        <div className="tech-list">
          {project.tech.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>

        <div className="project-links">
          {project.github && (
            <a href={project.github} target="_blank" rel="noreferrer">
              GitHub ↗
            </a>
          )}

          {project.demo && (
            <a href={project.demo} target="_blank" rel="noreferrer">
              Live Demo ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}