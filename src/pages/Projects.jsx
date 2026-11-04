import SectionHeading from '../components/SectionHeading';
import { projects, otherProjects } from '../data/projects';

function DemoPlaceholder({ title }) {
  return <div className="project-demo" aria-label={title+' demo video placeholder'}>
    <span className="demo-play" aria-hidden="true">&#9654;</span>
    <span>Demo video</span><small>Coming soon</small>
  </div>;
}
export default function Projects() {
  return <article className="projects-page wrap">
    <SectionHeading id="projects-heading" index="03">GitHub Projects</SectionHeading>
    <div className="project-sequence">{projects.map(project=><article className={'project-entry project-entry--demo project-entry--'+project.slug} id={'project-'+project.slug} key={project.slug} aria-labelledby={project.slug+'-title'}>
      <div className="project-copy"><div className="project-overline"><span className="entry-number">{project.type}</span>{project.stage!=='built'&&<span className="project-status">In progress</span>}</div><h3 id={project.slug+'-title'}>{project.title}</h3><p className="entry-context">{project.description}</p><ul className="entry-bullets">{project.bullets.map(bullet=><li key={bullet}>{bullet}</li>)}</ul>{project.tech.length>0&&<p className="entry-technologies">{project.tech.map(tech=><span className="technology-tag" key={tech}>{tech}</span>)}</p>}{project.plannedTech&&<p className="entry-technologies">Planned stack: {project.plannedTech.map(tech=><span className="technology-tag" key={tech}>{tech}</span>)}</p>}<div className="project-links">{project.github&&<a className="project-github" href={project.github} target="_blank" rel="noreferrer" aria-label={'View '+project.title+' on GitHub'}>GitHub &#8599;</a>}</div></div>
      <DemoPlaceholder title={project.title}/>
    </article>)}</div>
    <section className="earlier-projects" aria-labelledby="earlier-projects-heading"><h3 id="earlier-projects-heading">Earlier Projects</h3>{otherProjects.map(project=><article className="earlier-project" key={project.title}><div><h4>{project.title}</h4><p>{project.description}</p><p className="entry-technologies">{project.tech}</p>{project.github&&<a className="project-github" href={project.github} target="_blank" rel="noreferrer" aria-label={'View '+project.title+' on GitHub'}>GitHub &#8599;</a>}</div></article>)}<a className="project-github all-projects-link" href="https://github.com/ericren1?tab=repositories" target="_blank" rel="noreferrer">The rest of my projects &#8599;</a></section>
  </article>;
}
