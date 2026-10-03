const jobs = [
  {
    company: "TD Securities",
    role: "Software Engineer Intern",
    period: "Jan 2026 — Dec 2026",
    location: "Toronto, ON",
    intro:
      "Worked across three teams during the year,full-stack development on new applications, backend systems, modernization initiatives, enterprise application support and maintenance, databases, and AI initiatives.",
    rotations: [
      {
        title: "Reconciliation Team, Shared Services",
        period: "Sep 2026 — Dec 2026",
        bullets: [
          "Developed a full-stack AI proof of concept using Java, Spring Boot, React, Python, SQL, and Oracle to improve internal reconciliation workflows.",
          "Designed and implemented role-specific user screens for multiple user types and integrated frontend functionality with Java and Spring Boot backend services.",
          "Developed backend functionality while supporting application testing and technical documentation.",
        ],
      },
      {
        title: "Resilience Support and Maintenance",
        period: "May 2026 — Aug 2026",
        bullets: [
          "Increased Kafka consumer concurrency from 1 to 5 using Spring Boot and Spring Profiles, tested throughput, and documented bottlenecks.",
          "Remediated hundreds of security vulnerabilities across enterprise Java applications and supported fixes through development, integration testing, and pre-production deployment.",
          "Executed MongoDB sharding jobs and validation testing and supported Kafka partition expansion deployments for higher-volume event processing.",
        ],
      },
      {
        title: "Bulk Payments",
        period: "Jan 2026 — Apr 2026",
        bullets: [
          "Developed and maintained COBOL and JCL applications for enterprise batch processing and built Python automation for mainframe and business-screen data extraction and validation.",
          "Led integration of mainframe development into VS Code to modernize the developer workflow.",
          "Led adoption of GitHub Copilot and enterprise GenAI tools and trained a team of eight engineers on effective usage.",
          "Wrote documentation for internal bus",
        ],
      },
    ],
  },
  {
    company: "LDRS Investments",
    role: "Software Engineer Intern",
    period: "May 2023 — Aug 2023",
    location: "Toronto, ON",
    intro:
      "Worked on full-stack web development in a four person team, contributing to application functionality across the frontend and backend.",
    bullets: [
      "Developed a full-stack web application using Django, React, Python, JavaScript, and MySQL with secure user authentication and account registration.",
      "Designed and implemented a real-time customer support chat feature using Django Channels and React.",
    ],
  },
  {
    company: "UHN",
    role: "Information Technology Intern",
    period: "",
    location: "Toronto, ON",
    intro:
      "Supported the Epic Systems rollout across workstations, assisting with deployment, troubleshooting, and resolving technical issues.",
    bullets: [
      "",
    ],
  },
];

export default function Experience() {
  return (
    <section className="page-section experience-page container">
      <div className="page-intro">
        <p className="eyebrow">EXPERIENCE</p>
        <h1>Where I’ve worked.</h1>
        <p>
          Experience across financial technology, healthcare IT, and full-stack
          software development.
        </p>
      </div>

      <div className="jobs-list">
        {jobs.map((job, index) => (
          <article className="experience-job" key={job.company}>
            <div className="job-number">
              {String(index + 1).padStart(2, "0")}
            </div>

            <div className="job-main">
              <div className="job-heading">
                <div>
                  <p className="company">{job.company}</p>
                  <h2>{job.role}</h2>
                </div>

                <div className="job-meta">
                  {job.period && <span>{job.period}</span>}
                  <span>{job.location}</span>
                </div>
              </div>

              <p className="job-intro">{job.intro}</p>

              {job.rotations ? (
                <div className="rotations">
                  {job.rotations.map((rotation) => (
                    <section className="rotation" key={rotation.title}>
                      <div className="rotation-heading">
                        <h3>{rotation.title}</h3>
                        <span>{rotation.period}</span>
                      </div>

                      <ul>
                        {rotation.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              ) : (
                <ul className="job-bullets">
                  {job.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
