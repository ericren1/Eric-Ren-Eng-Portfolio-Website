import { Link, useParams } from 'react-router-dom';
import HomeCollage from '../components/HomeCollage';
import Photo from '../components/Photo';
import CompanyLogo from '../components/CompanyLogo';
import { experiences } from '../data/experience';
import { projects, otherProjects } from '../data/projects';

export const featuredSlugs=['url-shortener','ai-personal-scheduler','ai-exercise-form-tracker'];
export const companySlugs={'td-securities':'TD Securities',romaeris:'Romaeris Corporation',ldrs:'LDRS Investments'};
const companyWebsites={'td-securities':'https://www.tdsecurities.com/ca/en',romaeris:'https://romaeris.com/'};
function Arrow(){return <span aria-hidden="true">&#8599;</span>;}
function Stack({items,label='Technologies'}){return <div className="detail-stack"><span className="eyebrow">{label}</span><p>{items.join(' / ')}</p></div>;}
function Back({to='/',children='Home'}){return <Link className="back-link" to={to}>&larr; {children}</Link>;}
export function SocialIcon({type}){if(type==='Email')return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="1"/><path d="m3 6 9 7 9-7"/></svg>;return type==='GitHub'?<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .7a11.5 11.5 0 0 0-3.64 22.4c.58.1.79-.25.79-.56v-2.23c-3.22.7-3.9-1.37-3.9-1.37-.53-1.34-1.3-1.7-1.3-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.57-.29-5.27-1.28-5.27-5.7 0-1.26.45-2.29 1.19-3.1-.12-.3-.52-1.47.11-3.07 0 0 .97-.31 3.16 1.18a11 11 0 0 1 5.75 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.6.24 2.78.12 3.07.74.81 1.18 1.84 1.18 3.1 0 4.43-2.7 5.41-5.28 5.7.42.36.79 1.06.79 2.14v3.26c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .7Z"/></svg>:<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.45 2H3.55C2.69 2 2 2.68 2 3.52v16.96c0 .84.69 1.52 1.55 1.52h16.9c.86 0 1.55-.68 1.55-1.52V3.52c0-.84-.69-1.52-1.55-1.52ZM7.93 18.75H4.98V9.2h2.95v9.55ZM6.45 7.9a1.71 1.71 0 1 1 0-3.42 1.71 1.71 0 0 1 0 3.42Zm12.3 10.85H15.8V14.1c0-1.11-.02-2.54-1.55-2.54-1.55 0-1.79 1.21-1.79 2.46v4.73H9.51V9.2h2.83v1.3h.04c.4-.76 1.36-1.56 2.79-1.56 2.98 0 3.58 1.96 3.58 4.51v5.3Z"/></svg>;}
export function EditorialHome({themeControl}){
 return <div className="editorial-home"><div className="home-index">
   <section className="introduction"><div className="intro-heading"><h1><Link className="signature" to="/" aria-label="Eric Ren, home">Eric Ren</Link></h1>{themeControl}</div><p className="degree">Computer Engineering @ TMU</p><p>I like building useful software, exploring AI, and making things of my own. Away from the screen, you&rsquo;ll find me making music, traveling, or getting a workout in.</p></section>
   <section className="index-section" aria-labelledby="index-experience"><h2 id="index-experience">Experience</h2><div className="index-links">
    {Object.entries(companySlugs).slice(0,3).map(([slug,name])=><Link to={'/experience/'+slug} key={slug}>{name}<Arrow/></Link>)}
   </div><Link className="all-experience" to="/experience">All experience <Arrow/></Link><Link className="all-experience" to="/privacy">Visitor privacy</Link></section>
   <section className="index-section" aria-labelledby="index-projects"><h2 id="index-projects">Projects</h2><div className="index-links">{featuredSlugs.map(slug=>{const project=projects.find(p=>p.slug===slug);return <Link key={slug} to={'/projects/'+slug}>{slug==='url-shortener'?'URL Shortener & Analytics':project.title}<Arrow/></Link>;})}<Link to="/more-projects">More Projects<Arrow/></Link></div></section>
 </div><HomeCollage/></div>;
}
export function ExperienceIndex(){
 return <div className="reading-page"><Back/><header className="page-intro"><span className="eyebrow">Selected work</span><h1>Experience</h1><p>Software, systems, and the teams I&rsquo;ve learned from.</p></header><div className="company-index">{Object.entries(companySlugs).map(([slug,name])=><Link to={'/experience/'+slug} key={slug}><span>{name}</span><Arrow/></Link>)}</div></div>;
}
function JobDetail({job}){
 return <section className="role-detail" id={job.id}><header><p className="role-date">{job.period}</p><h2>{job.role}</h2><p className="secondary">{job.team}</p></header><Stack items={job.tech}/><ul>{job.bullets.map(bullet=><li key={bullet}>{bullet}</li>)}</ul>
 {job.challenge&&<div className="engineering-note"><h3>Engineering focus</h3><p>{job.challenge}</p></div>}
 {job.outcomes?.length>0&&<div className="role-outcomes">{job.outcomes.map(item=><p key={item.label}><strong>{item.value}</strong><span>{item.label}</span></p>)}</div>}
 {job.result&&<p className="result-note">{job.result}</p>}
 {job.photos?.length>0&&<div className={'role-photos role-photos--'+job.photos.length}>{job.photos.map(photo=><figure key={photo.src}><Photo {...photo}/><figcaption>{photo.caption}</figcaption></figure>)}</div>}
 </section>;
}
export function CompanyExperience(){
 const {companySlug}=useParams();
 const company=companySlugs[companySlug];
 const jobs=experiences.filter(job=>job.company===company);
 if(!company)return <NotFound/>;
 return <div className="reading-page company-page"><Back to="/experience">Experience</Back><header className="page-intro company-title"><CompanyLogo company={company}/><div><span className="eyebrow">Experience</span><h1>{company}</h1>{companyWebsites[companySlug]&&<a className="text-link company-website" href={companyWebsites[companySlug]} target="_blank" rel="noreferrer">Company website <Arrow/></a>}</div></header>{jobs.map(job=><JobDetail job={job} key={job.id}/>)}</div>;
}
export function FeaturedProject(){
 const {projectSlug}=useParams();
 const project=projects.find(item=>item.slug===projectSlug);
 if(!project)return <NotFound/>;
 return <div className="reading-page project-detail"><Back/><header className="page-intro"><span className="eyebrow">{project.type}</span><h1>{project.title}</h1>{project.stage!=='built'&&<p className="project-state">{project.stage==='planned'?'Planned':'In progress'}</p>}<p>{project.description}</p>{project.github&&<a className="text-link" href={project.github} target="_blank" rel="noreferrer">Repository <Arrow/></a>}</header>
 {project.tech.length>0&&<Stack items={project.tech}/>} {project.plannedTech&&<Stack items={project.plannedTech} label="Planned technologies"/>}
 {project.visual&&<figure className="project-screenshot"><Photo {...project.visual}/><figcaption>{project.visual.caption}</figcaption></figure>}
 <section className="detail-section"><h2>{project.stage==='planned'?'Planned scope':'What it does'}</h2><ul>{project.bullets.map(bullet=><li key={bullet}>{bullet}</li>)}</ul></section>
 {[['The problem',project.problem],['Technical approach',project.architecture],['Engineering challenges',project.challenges],['Results & current scope',project.results],['Next steps',project.future]].filter(([,text])=>text).map(([title,text])=><section className="detail-section" key={title}><h2>{title}</h2><p>{text}</p></section>)}
 {project.decisions&&<section className="detail-section"><h2>Design decisions</h2>{project.decisions.map(([title,text])=><div className="decision" key={title}><h3>{title}</h3><p>{text}</p></div>)}</section>}
 <nav className="project-next" aria-label="Other projects">{featuredSlugs.filter(slug=>slug!==projectSlug).map(slug=><Link key={slug} to={'/projects/'+slug}>{projects.find(p=>p.slug===slug).title}<Arrow/></Link>)}<Link to="/more-projects">More Projects<Arrow/></Link></nav>
 </div>;
}
export function MoreProjects(){
 const secondary=[...projects.filter(p=>!featuredSlugs.includes(p.slug)),...otherProjects];
 return <div className="reading-page more-projects"><Back/><header className="page-intro"><span className="eyebrow">Experiments & other builds</span><h1>More Projects</h1></header>{secondary.map(project=><section className="secondary-project" key={project.title}><h2>{project.title}</h2>{project.stage==='planned'&&<p className="project-state">Planned scope</p>}<ul>{(project.bullets?(project.bullets.length>4?[...project.bullets.slice(0,3),project.bullets.slice(3).join(' ')]:project.bullets):[project.description,'Technical focus: '+project.field.toLowerCase()+'.']).map(text=><li key={text}>{text}</li>)}</ul><p className="secondary">{Array.isArray(project.tech)?(project.tech.length?project.tech:project.plannedTech).join(' / '):project.tech}</p></section>)}</div>;
}
export function NotFound(){return <div className="reading-page"><Back/><h1>That page isn&rsquo;t here.</h1><p>Head home to find the work and personal archive.</p></div>;}
