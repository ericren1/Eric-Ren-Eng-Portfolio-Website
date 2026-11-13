import { workPhotos } from './workPhotos.js';

// Content supplied by Eric; projected outcomes remain labeled.
export const experiences = [
  {
    "id": "td-reconciliation",
    "company": "TD Securities",
    "short": "TD",
    "role": "Software Engineer Intern",
    "team": "Reconciliation, Shared Services",
    "period": "September — December 2026",
    "current": true,
    "summary": "Modernizing the way operations teams reconcile financial transactions.",
    "bullets": [
      "Developed a financial reconciliation engine supporting transaction matching and exception resolution.",
      "Redesigned the React frontend to support reconciliation workflows, transaction statuses, comments, and reporting.",
      "Built Java Spring Boot REST APIs and Oracle database schemas to persist reconciliation data and connect backend services with frontend workflows.",
      "Worked on reconciliation status management and user interactions, with audit logging and traceability requirements informing the system design.",
      "Contributed to a proof of concept projected to reduce reconciliation turnaround from approximately one week to one day and save $200,000 annually."
    ],
    "context": "A proof of concept exploring an internally developed alternative to a legacy vendor reconciliation process. The goal is to bring transaction review, exceptions, and outcomes into one interface.",
    "contribution": "Full-stack development across React workflows and Java / Spring Boot APIs. My work supports transaction statuses, unmatched-item investigation, exception management, comments, and reporting.",
    "challenge": "Keeping reconciliation state understandable and traceable across frontend workflows and backend persistence, while supporting investigation and reporting.",
    "outcomes": [
      {
        "value": "1 week → 1 day",
        "label": "Projected reconciliation turnaround"
      },
      {
        "value": "$200k / year",
        "label": "Projected annual savings"
      }
    ],
    "result": "These are projected business outcomes for the proof of concept, not measured production results.",
    "tech": [
      "Java",
      "Spring Boot",
      "React",
      "JavaScript",
      "Oracle SQL",
      "REST APIs",
      "Maven",
      "Docker",
      "Git"
    ]
  },
  {
    "id": "romaeris",
    "company": "Romaeris Corporation",
    "short": "R",
    "role": "Robotics Software Engineering Intern",
    "team": "UAV Collision Avoidance Team",
    "period": "October — December 2026",
    "current": true,
    "summary": "Exploring visual tracking for UAV collision avoidance.",
    "bullets": [
      "Contributing to a computer vision pipeline focused on object tracking and state estimation for UAV collision avoidance.",
      "Setting up a resource-constrained Docker environment for reproducible development and testing.",
      "Investigating Python and YOLO-based tracking approaches to evaluate accuracy, processing latency, and reliability.",
      "Exploring tracking failure cases and performance tradeoffs relevant to resource-constrained systems."
    ],
    "context": "A proof-of-concept scope investigating how visual tracking and state estimation can help a UAV understand nearby object movement.",
    "contribution": "The intended technical scope covers Python, YOLO-based detection, object tracking, state estimation, and Docker. Specific implementations and experiments are not documented in the available portfolio evidence.",
    "challenge": "Balancing tracking reliability, computational cost, and latency within a resource-constrained system.",
    "result": "Exploratory scope. No completed experiments, tracking accuracy, or latency results are claimed here.",
    "tech": [
      "Python",
      "OpenCV",
      "YOLO",
      "Docker",
      "Computer Vision",
      "Object Tracking",
      "State Estimation"
    ],
    "scope": true
  },
  {
    "id": "td-backend",
    "company": "TD Securities",
    "short": "TD",
    "role": "Software Engineer Intern",
    "team": "Backend engineering & infrastructure",
    "period": "May — August 2026",
    "summary": "Improving throughput, application security, and database scalability.",
    "bullets": [
      "Increased Kafka consumer concurrency from one to five and expanded partitions to improve parallel message processing.",
      "Conducted performance testing and measured a 237% improvement in message throughput.",
      "Investigated and remediated more than 500 Veracode security findings across enterprise applications, reducing outstanding findings in the relevant scans to zero.",
      "Collaborated with MongoDB engineers to evaluate database sharding, including shard-key validation, server configuration, and test workload execution.",
      "Gained practical experience with distributed message processing, database scalability, and enterprise application security."
    ],
    "context": "Enterprise financial applications needed better parallel message processing, security remediation, and evaluations of database scaling options.",
    "contribution": "Increased Kafka consumer concurrency from one to five and expanded partitions. Investigated and remediated 500+ Veracode findings within the relevant application scope. Collaborated with MongoDB engineers on shard-key evaluation, infrastructure configuration, and workload testing.",
    "challenge": "Evaluating parallel processing changes through performance testing and validating security fixes without treating infrastructure changes as isolated configuration edits.",
    "outcomes": [
      {
        "value": "+237%",
        "label": "Message throughput in performance testing"
      },
      {
        "value": "500+",
        "label": "Veracode findings remediated"
      }
    ],
    "result": "Subsequent scans reported zero outstanding findings within the remediation scope. Throughput and security results are supplied professional experience figures.",
    "tech": [
      "Java",
      "Spring Boot",
      "Apache Kafka",
      "MongoDB",
      "Veracode",
      "Git",
      "Performance Testing"
    ]
  },
  {
    "id": "td-payments",
    "company": "TD Securities",
    "short": "TD",
    "role": "Software Engineer Intern",
    "team": "Bulk Payments",
    "period": "January — April 2026",
    "summary": "Bringing modern developer workflows to enterprise mainframe systems.",
    "bullets": [
      "Led an initiative to integrate VS Code and GitHub into existing mainframe development workflows.",
      "Improved developer productivity by approximately 60% through development workflow modernization; this figure is an estimate associated with the initiative.",
      "Built Python automation for mainframe login, data extraction, and validation, making targeted workflows approximately 2.6 times faster.",
      "Reduced repetitive manual tasks and improved the accessibility of legacy development workflows.",
      "Introduced and trained eight engineers on practical uses of generative AI tools for prompting, debugging, system design, and development."
    ],
    "context": "Mainframe development and repetitive operational tasks offered opportunities for more accessible tooling and automation.",
    "contribution": "Helped introduce VS Code and GitHub into mainframe workflows. Developed Python automation for login, data extraction, and validation. Trained eight engineers in practical generative AI workflows, including debugging and prompting.",
    "challenge": "Connecting modern development tools with established COBOL / JCL workflows, and making automation useful for repetitive extraction and validation tasks.",
    "outcomes": [
      {
        "value": "~60%",
        "label": "Estimated developer efficiency improvement"
      },
      {
        "value": "2.6×",
        "label": "Faster targeted automated workflows"
      }
    ],
    "result": "The developer efficiency figure is an estimate associated with the initiative. The automation result applies to the targeted workflows, not all mainframe work.",
    "tech": [
      "Python",
      "COBOL",
      "JCL",
      "Mainframe Systems",
      "VS Code",
      "GitHub",
      "SQL",
      "Generative AI Tools"
    ]
  },
  {
    "id": "ldrs",
    "company": "LDRS Investments",
    "short": "L",
    "role": "Software Engineer Intern",
    "team": "Full-stack development · Four-person team",
    "period": "January — April 2023",
    "summary": "Building a web application and a more responsive support experience.",
    "bullets": [
      "Developed a full-stack web application using Django, React, Python, and MySQL as part of a four-person development team.",
      "Built frontend components and backend functionality supporting application workflows and database integration.",
      "Developed a real-time customer support chat feature using Django Channels and React.",
      "Improved customer response time by approximately 70% through the live chat functionality; this was a reported result for the chat feature."
    ],
    "context": "Worked in a four-person team on a full-stack web application using React, Django, Python, and MySQL.",
    "contribution": "Implemented frontend and backend functionality and developed a live customer-support chat feature with Django Channels and React.",
    "challenge": "Connecting a real-time support interface with the application backend and contributing across both sides of a shared codebase.",
    "outcomes": [
      {
        "value": "70%",
        "label": "Reported customer response-time improvement"
      }
    ],
    "result": "The response-time improvement was reported for the chat feature. The wider application was a team effort.",
    "tech": [
      "Python",
      "Django",
      "React",
      "JavaScript",
      "MySQL",
      "Django Channels",
      "Git"
    ]
  }
];

Object.assign(experiences.find(job => job.id === 'td-reconciliation'), { photo: workPhotos.fallLunch, photos: [workPhotos.fallLunch, workPhotos.fallSpeedMentoring] });
Object.assign(experiences.find(job => job.id === 'td-backend'), { photo: workPhotos.summerConference, photos: [workPhotos.summerConference] });

experiences.push({
  id: 'unity-health', company: 'Unity Health Toronto', role: 'Information Technology Intern',
  period: 'September - December 2024', team: 'Internship / Toronto / Hybrid',
  tech: ['ServiceNow', 'Epic Systems'],
  bullets: ['Supported the Epic Systems rollout across workstations, assisting with deployment, troubleshooting, and resolving technical issues.']
});
