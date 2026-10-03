import ProjectCard from "../components/ProjectCard";

const projects = [
  {
    title: "Traffic Intersection Detection",
    type: "COMPUTER VISION",
    description:
      "Built a Python computer vision pipeline using YOLOv5 and YOLOv8 for traffic intersection detection, then benchmarked accuracy, inference speed, and detection performance across multiple datasets. Wrote a research paper on the results.",
    tech: ["Python", "YOLOv5", "YOLOv8", "Computer Vision"],
    github: "https://github.com/ericren1/Traffic-Intersection-Detection",
  },
  {
    title: "Movie Website Database",
    type: "DATABASE AND UI",
    description:
      "Built a movie database application with a user interface backed by an Oracle SQL database.",
    tech: ["SQL", "Python", "Oracle"],
    github: "https://github.com/ericren1/Database-Project-and-UI",
  },
  {
    title: "TIC TAC TOE",
    type: "SOFTWARE",
    description:
      "Built an embedded multimedia center on an ARM Cortex-M3 microcontroller with an MP3 player, photo gallery, game, and interrupt-driven peripheral interfaces.",
    tech: ["C", "Python"],
  },
  {
  title: "Simple GPU",
  type: "DIGITAL LOGIC / FPGA",
  description:
    "Designed a simple GPU architecture in VHDL, including arithmetic and logic components, and implemented the design using Intel Quartus.",
  tech: ["VHDL", "FPGA", "Quartus", "Digital Logic"],
  github: "https://github.com/ericren1/Simple-GPU",
},
  {
    title: "Multimedia Center",
    type: "EMBEDDED SYSTEMS",
    description:
      "Built an embedded multimedia center on an ARM Cortex-M3 microcontroller with an MP3 player, photo gallery, game, and interrupt-driven peripheral interfaces.",
    tech: ["C", "ARM Cortex-M3", "Keil uVision", "FPGA"],
  },
  
];

export default function Projects() {
  return (
    <section className="page-section container">
      <div className="page-intro">
        <p className="eyebrow">PROJECTS</p>
        <h1>Things I’ve built.</h1>
        <p>Personal and academic engineering projects.</p>
      </div>

      <div className="projects-list">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.title}
            project={project}
            number={String(index + 1).padStart(2, "0")}
          />
        ))}
      </div>
    </section>
  );
}