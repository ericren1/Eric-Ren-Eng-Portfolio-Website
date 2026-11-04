import SectionHeading from '../components/SectionHeading';
import Photo from '../components/Photo';
import CompanyLogo from '../components/CompanyLogo';
import { experiences } from '../data/experience';

function InternshipPhoto({ job }) {
  if(!job.photo)return null;
  return <figure className={'internship-photo internship-photo--'+job.id}>{job.photo.src?<><Photo src={job.photo.src} alt={job.photo.alt} caption={job.photo.caption} gallery={job.photos}/><figcaption>{job.photo.caption}</figcaption></>:<div className="photo-placeholder" role="img" aria-label={job.photo.alt+' placeholder'}><svg viewBox="0 0 40 32" aria-hidden="true"><rect x="1" y="1" width="38" height="30"/><circle cx="28" cy="10" r="3"/><path d="m3 28 11-12 8 8 5-5 10 9"/></svg><span>{job.photo.label}</span><small>Photo to add</small></div>}</figure>;
}
export default function Experience() {
  return <article className="experience-page wrap"><SectionHeading id="experience-heading" index="02">Work Experience</SectionHeading>
    <div className="experience-sequence">{experiences.filter(job=>!['ldrs','unity-health'].includes(job.id)).map(job=><JobEntry job={job} key={job.id}/>)}<div className="experience-pair">{experiences.filter(job=>['ldrs','unity-health'].includes(job.id)).map(job=><JobEntry job={job} key={job.id}/>)}</div></div>
  </article>;
}

function JobEntry({job}) {
  return <article className={'experience-entry'+(job.photo?'':' experience-entry--text')} id={job.id} key={job.id} aria-labelledby={job.id+'-title'}>
      <div className="experience-margin"><InternshipPhoto job={job}/></div>
      <div className="experience-copy"><div className="job-overline"><span className="entry-date">{job.period}</span></div><div className="company-identity"><CompanyLogo company={job.company} src={job.logo}/><h3 id={job.id+'-title'}><span className="experience-company">{job.company}</span><span className="experience-role"> &mdash; {job.role}</span></h3></div><p className="experience-team">{job.team}</p><p className="entry-technologies">{job.tech.map(tech=><span className="technology-tag" key={tech}>{tech}</span>)}</p><ul className="entry-bullets">{job.bullets.map(bullet=><li key={bullet}>{bullet}</li>)}</ul>{job.photos?.slice(1).map(photo=><figure className="additional-work-photo" key={photo.src}><Photo src={photo.src} alt={photo.alt} caption={photo.caption} gallery={job.photos}/><figcaption>{photo.caption}</figcaption></figure>)}</div>
    </article>;
}
