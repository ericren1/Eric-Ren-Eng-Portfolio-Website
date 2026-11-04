// Implemented and planned scope are kept distinct. Existing repository URLs preserved.
export const projects = [
  {
    "slug": "url-shortener",
    "title": "URL Shortener & Analytics API",
    "shortTitle": "A shorter path.",
    "bullets": [
      "Built a REST API that generates compact Base62 short links, stores original URLs, and redirects users to their destinations.",
      "Used PostgreSQL for persistent URL mappings and Redis caching to accelerate frequently accessed redirects.",
      "Implemented synchronous click tracking and analytics to monitor shortened URL activity.",
      "Containerized the application using Docker for reproducible development and deployment.",
      "Local k6 benchmarks reached 3,109 requests per second with zero errors, improving cached throughput by 19% and reducing p99 latency by 42% against the tested cache-miss baseline. Each scenario used 10 virtual users and 50,000 measured iterations; these are not production capacity figures."
    ],
    "type": "BACKEND / PERFORMANCE ENGINEERING",
    "status": "Built & benchmarked",
    "stage": "built",
    "description": "A backend URL shortening service built to explore API design, database persistence, caching, and performance optimization.",
    "tech": [
      "Java",
      "Spring Boot",
      "PostgreSQL",
      "Redis",
      "Docker",
      "REST APIs",
      "Maven"
    ],
    "github": "https://github.com/ericren1/url-shortener-api",
    "problem": "A short link hides a useful systems problem: how do you resolve a destination quickly while keeping identifiers unique and click history durable?",
    "implementation": "The API creates random eight-character Base62 identifiers, stores URL mappings in PostgreSQL, returns HTTP 302 redirects, and exposes per-link click counts and timestamps. Redis caches URL IDs and destinations for frequently accessed mappings.",
    "architecture": "One Spring Boot service, PostgreSQL as the source of truth, and Redis for URL caching and creation rate limits. Redirects use cache-aside reads, with a database fallback on misses or cache errors. Every successful redirect writes a click event synchronously—even on a cache hit.",
    "decisions": [
      [
        "Database-enforced uniqueness",
        "A unique constraint is the final authority on short codes. Collisions trigger a retry, up to five attempts, instead of relying on a pre-insert existence check that could race."
      ],
      [
        "Disposable cache, durable history",
        "Cached mappings have a 24-hour TTL and can be rebuilt from PostgreSQL. Click events remain append-only records in the database."
      ],
      [
        "A deliberate synchronous write",
        "Recording each click before the redirect keeps analytics simple and durable. The tradeoff: the redirect still depends on PostgreSQL latency and availability."
      ],
      [
        "A single service",
        "The current scope fits a monolith. Adding services or a queue would introduce coordination without a demonstrated requirement."
      ]
    ],
    "challenges": "A cache hit must avoid loading the URL entity without skipping the click write. Other concerns include concurrent short-code collisions, atomic Redis rate-limit expiry, validation, and predictable error handling.",
    "results": "Raw k6 summaries support 3,109 requests/second on cache hits and 2,608 on cache misses, with zero failed requests in both recorded scenarios. Those samples show approximately 19% higher throughput and 42% lower p99 latency with cache hits.",
    "future": "Potential next steps include analytics retention, broader repeated performance trials, tracing, and a deployment-specific trusted-proxy policy. An asynchronous analytics queue would need evidence that its added complexity is worthwhile.",
    "evidence": "Source, unit and integration test files, architecture documentation, and raw k6 summaries inspected. The project test suite was not rerun as part of this portfolio redesign.",
    "flow": [
      "HTTP request",
      "Spring Boot",
      "Redis / PostgreSQL",
      "Click event + 302"
    ]
  },
  {
    "slug": "ai-personal-scheduler",
    "title": "AI Personal Scheduler",
    "shortTitle": "Room for a better day.",
    "visual": {
      "src": "/images/projects/scheduler.png",
      "alt": "Actual read-only scheduler frontend with local sample calendar data",
      "caption": "ACTUAL INTERFACE / LOCAL SAMPLE DATA"
    },
    "bullets": [
      "Implemented a read-only React / TypeScript weekly planner with events, task sessions, an unscheduled-task panel, week navigation, and visible-hour controls using local sample data.",
      "Planned: generate daily schedules from priorities, deadlines, estimated durations, and available time, and dynamically reschedule when those constraints change.",
      "Planned: integrate Google Calendar to retrieve events, detect conflicts, and coordinate scheduled activities.",
      "Planned: use LLM tool calling to interpret natural-language requests and perform structured scheduling operations.",
      "Planned: persist tasks, schedules, and user preferences in PostgreSQL. Backend persistence, calendar synchronization, and automated scheduling are not implemented in the inspected build."
    ],
    "type": "PRODUCT / CALENDAR INTERFACE",
    "status": "In development",
    "stage": "development",
    "description": "A scheduling product in development. The implemented slice is a read-only React week planner using local sample data.",
    "tech": [
      "React",
      "TypeScript",
      "Vite",
      "CSS"
    ],
    "github": "https://github.com/ericren1/ai-scheduler-app",
    "problem": "Tasks and calendars often live apart. The product goal is to turn priorities, deadlines, and available time into a realistic daily plan.",
    "implementation": "The current frontend renders a weekly time grid with events, task sessions, and an unscheduled-task panel. Week navigation and visible-hour controls are implemented. Records come from local mock collections; task, goal, and settings pages are placeholders.",
    "architecture": "A React / TypeScript frontend separates task records, scheduled sessions, calendar events, and categories. Date and calendar-view utilities derive the week display. Python, PostgreSQL, Google Calendar, and an LLM tool-using agent appear in planning documents, not in an implemented backend.",
    "decisions": [
      [
        "Separate tasks from scheduled sessions",
        "A task can exist without occupying a calendar slot. The frontend model keeps the work itself separate from a planned time block."
      ],
      [
        "Build a legible planner first",
        "The read-only interface makes the week, existing events, and unscheduled work visible before adding scheduling automation."
      ],
      [
        "Distinguish model from integration",
        "Local calendar records exercise the view. They do not imply a connected calendar account, persistent storage, or AI-generated plans."
      ]
    ],
    "challenges": "The current UI work concerns date handling, event placement, and identifying unscheduled tasks. Future scheduling work will need conflict detection, constraint handling, invalid-tool-call recovery, and predictable rescheduling.",
    "results": "A read-only planner interface and calendar utility test files are present. Automated scheduling, task persistence, LLM tools, Google Calendar synchronization, and a Python backend are not implemented in the inspected checkout.",
    "future": "Implement task persistence and backend APIs, then scheduling constraints and calendar integration. Natural-language planning should follow reliable structured operations and validation.",
    "evidence": "Inspected PlannerPage, calendar components, mock records, date utilities, placeholder routes, tests, and product / architecture planning documents.",
    "flow": [
      "Local sample records",
      "Calendar utilities",
      "React week planner",
      "Read-only view"
    ],
    "plannedTech": [
      "Python",
      "PostgreSQL",
      "LLM APIs",
      "Google Calendar API"
    ]
  },
  {
    "slug": "ai-exercise-form-tracker",
    "title": "AI Exercise Form Tracker",
    "shortTitle": "Making movement legible.",
    "bullets": [
      "Implemented a local Python video pipeline with MediaPipe pose landmarks, visibility filtering, joint-angle calculations, and OpenCV overlays.",
      "Added frame-level shoulder-press position classification for bottom, top, transitioning, and unknown states, with geometry and classifier test files.",
      "Planned: detect and segment exercise repetitions using temporal movement analysis.",
      "Planned: identify potential form deviations and generate structured feedback; no validated accuracy or injury-risk prediction is claimed.",
      "Planned: provide a desktop web application and companion iOS application using a shared backend."
    ],
    "type": "COMPUTER VISION / MOVEMENT",
    "status": "Prototype",
    "stage": "prototype",
    "description": "A local Python prototype that turns shoulder-press video into pose landmarks, joint angles, and position feedback.",
    "tech": [
      "Python",
      "OpenCV",
      "MediaPipe",
      "Pose estimation"
    ],
    "github": "https://github.com/ericren1/ai-exercise-form-tracker",
    "problem": "Exercise footage contains movement, but understanding it requires a useful representation of the body. This prototype starts with a narrow question: can visible pose landmarks describe the positions of a shoulder press?",
    "implementation": "The local program reads video frames, runs MediaPipe pose estimation, filters low-visibility landmarks, calculates elbow angles and upper-arm elevation, and classifies bottom, top, transitioning, or unknown positions. OpenCV draws landmarks, angles, and textual position feedback.",
    "architecture": "VideoReader supplies timestamped frames to a MediaPipePoseEstimator behind a pose-estimator interface. Geometry helpers calculate measurements; a threshold-based ShoulderPressAnalyzer classifies positions. The OpenCV loop displays the overlays.",
    "decisions": [
      [
        "Start with one exercise",
        "Shoulder-press positions provide a focused starting point for the geometry and feedback loop. General exercise evaluation remains future work."
      ],
      [
        "Make uncertainty explicit",
        "Landmarks below the visibility threshold are excluded, and missing measurements return an unknown position rather than forcing a classification."
      ],
      [
        "Keep pose estimation replaceable",
        "An estimator interface separates pose extraction from geometry and exercise-specific analysis."
      ]
    ],
    "challenges": "Camera position, unstable landmarks, and threshold selection affect the interpretation of movement. Current position classification is frame-based; it does not establish completed repetitions or a validated technique score.",
    "results": "The inspected source implements landmark extraction, geometry calculations, position classification, and overlays. Geometry and shoulder-press test files exist. No accuracy or inference-latency benchmark is published.",
    "future": "Temporal movement analysis, repetition segmentation, more exercises, persistent analysis history, and web / iOS interfaces are planned possibilities. PyTorch, React, and React Native are not part of the inspected implementation.",
    "evidence": "Inspected main.py, MediaPipe estimator, geometry helpers, shoulder-press analyzer, and test files. This is an experimental movement-analysis prototype, without a validated medical or injury-risk assessment.",
    "flow": [
      "Video frames",
      "MediaPipe landmarks",
      "Joint-angle geometry",
      "Position feedback"
    ],
    "plannedTech": [
      "PyTorch",
      "React",
      "React Native",
      "Expo"
    ]
  },
  {
    "slug": "ai-video-editor-agent",
    "title": "AI Video Editor Agent",
    "type": "AI / VIDEO EDITING",
    "status": "Planned",
    "stage": "planned",
    "description": "A planned AI-assisted video editing application to automate repetitive editing tasks and help creators turn raw footage into structured videos.",
    "tech": [],
    "plannedTech": [
      "Python",
      "FFmpeg",
      "React",
      "LLM APIs",
      "Speech-to-Text",
      "Docker"
    ],
    "bullets": [
      "Planned: import footage and extract audio, metadata, and timestamps.",
      "Planned: generate transcripts with timestamped speech-to-text processing.",
      "Planned: identify candidate highlights, pauses, and sections for removal.",
      "Planned: interpret editing instructions with an AI agent and generate a structured edit plan.",
      "Planned: apply supported edits through FFmpeg and export edited video files."
    ]
  },
  {
    "slug": "ai-job-application-agent",
    "title": "AI Job Application Agent",
    "type": "AI / APPLICATION WORKFLOWS",
    "status": "Planned",
    "stage": "planned",
    "description": "A planned job discovery and application assistant to identify relevant software engineering opportunities and streamline application preparation.",
    "tech": [],
    "plannedTech": [
      "Python",
      "React",
      "PostgreSQL",
      "LLM APIs",
      "GitHub API",
      "Browser Automation"
    ],
    "bullets": [
      "Planned: monitor selected GitHub job repositories and job sources for internship and new-graduate postings.",
      "Planned: extract job requirements, eligibility criteria, locations, and deadlines, then compare opportunities with a structured candidate profile, skills, and preferences.",
      "Planned: generate personalized application responses using verified candidate information.",
      "Planned: track application status, deadlines, and previously reviewed opportunities.",
      "Planned: support browser-assisted application workflows with user review and approval before submission."
    ]
  }
];
export const otherProjects = [
  {
    "title": "Traffic Intersection Detection",
    "field": "COMPUTER VISION",
    "tech": "Python · YOLOv5 · YOLOv8",
    "description": "Traffic-intersection object detection and comparison work.",
    "github": "https://github.com/ericren1/Traffic-Intersection-Detection"
  },
  {
    "title": "Simple GPU",
    "field": "DIGITAL LOGIC",
    "tech": "VHDL · FPGA · Quartus",
    "description": "A hardware design project exploring a simple GPU architecture.",
    "github": "https://github.com/ericren1/Simple-GPU"
  },
  {
    "title": "Multimedia Center",
    "field": "EMBEDDED SYSTEMS",
    "tech": "C · ARM Cortex-M3 · Keil",
    "description": "An embedded multimedia project with audio, images, and a game."
  }
];
