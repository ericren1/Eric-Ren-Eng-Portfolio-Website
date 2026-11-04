import SectionHeading from '../components/SectionHeading';
import Photo from '../components/Photo';
import { skills } from '../data/profile';

export default function About() {
  return <article className="about-summary wrap">
    <SectionHeading id="about-heading" index="01">About Me</SectionHeading>
    <div className="about-editorial"><figure className="about-print"><Photo src="/images/about me photo.jpg" alt="Portrait of Eric Ren" sizes="(max-width: 700px) 75vw, 30vw"/></figure><div className="about-biography"><p>I'm a Computer Engineering student at Toronto Metropolitan University with experience building software across fin-tech, robotics, and personal projects.</p><p>Through my internships at TD Securitie, Romaeris and more. I've gained experience in backend engineering, full-stack development, distributed systems, and computer vision. I've worked on everything from improving the performance of existing systems to developing new applications and exploring emerging technologies.</p><p>What I enjoy most about software engineering is being able to take an idea and turn it into something genuinely useful. I like building tools that solve everyday problems, automate repetitive tasks, and make my own life easier. Whether it's improving an existing system or creating something from scratch, I find it rewarding to build software that has a practical purpose and makes a real difference.</p><p>I'm particularly interested in AI, and machine learning, and I'm always looking for opportunities to challenge myself, learn from others, and become a better engineer.</p><p>Outside of engineering, I enjoy music production, fitness, basketball, and traveling.</p></div></div>
    <section className="about-technical" aria-labelledby="skills-heading"><div className="about-side-label"><h3 id="skills-heading">Tech Stack</h3></div><dl className="skill-groups">{skills.map(([group,items])=><div key={group}><dt>{group}</dt><dd>{items.split(', ').map(skill=><span className="skill-tag" key={skill}>{skill}</span>)}</dd></div>)}</dl></section>
  </article>;
}
