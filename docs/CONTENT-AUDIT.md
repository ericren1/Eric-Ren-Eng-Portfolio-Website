# Portfolio content audit

Audited November 4, 2026. The updated user brief takes priority over the old portfolio. Source repositories were inspected read-only; their implementations were not modified. Personal photos are supplied originals, never generated images. Public contact email was supplied in chat: ericren1218@gmail.com. Subsequent user-directed presentation changes are documented in REDESIGN.md: Education is no longer displayed, Creative is now Off the Clock, and trip folder dates/names were supplied directly by Eric.

## Engineering evidence

| Item | Evidence inspected | Published treatment |
| --- | --- | --- |
| URL Shortener | Adjacent `url-shortener-api`: `UrlService`, cache and rate-limit services, controller and test files, README, architecture docs, `docs/performance/hit.json` and `miss.json` | Lead feature, “Built & benchmarked.” Code supports Base62 codes, unique-constraint retries, cache-aside reads, 24-hour TTL, synchronous click events, validation, rate limiting, and Flyway migrations. |
| URL benchmarks | Original k6 summary JSON, performance report | 3,109 vs. 2,608 req/s; p99 9.74 vs. 16.75 ms; zero failed requests. Approximately +19% throughput and −42% p99 latency. Local Docker Desktop, 10 virtual users, 50,000 measured iterations plus one setup HTTP request per scenario. Cache-hit run first. Explicitly not production capacity. Original JSON copied unchanged into `public/evidence/`. |
| AI Personal Scheduler | Adjacent `ai-scheduler-app/frontend`: `PlannerPage`, local mocks, calendar components, date utilities, placeholder pages, utility tests; product planning docs | “In development.” A read-only React / TypeScript calendar using sample data. Python backend, PostgreSQL, Google Calendar integration, persistence, LLM tools, automated scheduling, and rescheduling remain planned. |
| Scheduler visual | Actual application source copied into ignored `.qa/scheduler`, rendered with the portfolio’s existing Vite/React toolchain | Real 1440×1000 browser capture of the Sample week with the Tasks panel open. Labeled as actual frontend / local sample data, never a working AI scheduler. No source functionality was added for the screenshot. |
| AI Exercise Form Tracker | Adjacent `ai-exercise-form-tracker`: `main.py`, video reader, MediaPipe estimator and pose interface, geometry helpers, shoulder-press classifier, test files | “Prototype.” Video frames, landmarks, visibility filtering, elbow / arm angles, frame-level shoulder-press positions, and OpenCV overlays. No completed repetition segmentation, temporal technique scoring, history, React web app, React Native app, or PyTorch implementation claimed. |
| Other builds | Genuine pre-existing GitHub links and descriptions from the portfolio | Secondary index, without new benchmarks or completion claims. Removed the erroneous Tic Tac Toe entry that duplicated the Multimedia Center description. |

Repository test files were inspected as evidence, but those projects’ test suites were not rerun for this portfolio task. Portfolio verification does not certify the projects’ runtime behavior.

## Professional experience

- **TD reconciliation, September–December 2026:** updated full-stack scope. One week → one day and ~$200,000/year are explicitly **projected**, including next to the displayed numbers. No confidential matching logic, transaction examples, or internal architecture.
- **Romaeris, October–December 2026:** part-time / remote, proof-of-concept **scope**. No source or experiment results were available for this employer work; tracking, estimation, latency, and accuracy are not presented as completed results.
- **TD backend, May–August 2026:** supplied +237% Kafka throughput, 500+ findings remediated, zero outstanding findings within the stated scope, and MongoDB collaboration integrated. These are user-supplied professional experience results, not independently verified public benchmarks.
- **TD Bulk Payments, January–April 2026:** ~60% efficiency labeled **estimated**, 2.6× applies only to targeted workflows, and training covered eight engineers.
- **LDRS, January–April 2023:** updated brief overrides the old May–August 2023 dates. The reported 70% response-time improvement is attributed to the support feature; the application remains a four-person team effort.
- The older UHN entry has no dates or detailed supporting material and is omitted from the finalized chronology. It can be restored after those details are supplied.

## Education and skills

- TMU, Bachelor of Engineering (Honours), Computer Engineering, expected **May 2028**, plus the four supplied courses.
- No graduation date was present in the inspected current site, so there is no observed competing date. Confirm May 2028 when reviewing the content.
- Skills follow supplied experience, prior coursework descriptions, and inspected code. MediaPipe reflects the actual exercise implementation.
- **Omitted pending hands-on confirmation:** C++, C#, Linux administration, Google Cloud, PyTorch, LLM API integration, and React Native. Mentioning a future stack in a planning document is not evidence of implementation.

## Creative archive

- Shanghai, Tulum, Miami, and Sint Maarten retain the supplied destinations. The waterfront portrait has no invented location or trip date.
- Music images include the real studio photo and supplied MUSO.AI 2025 images for Renzo On Da Track. Captions describe them as user-supplied archive material; their platform statistics are not promoted as independently verified site metrics.
- The old Gold/Platinum collaborator claim and 100,000 website-hit figure are omitted pending credits / analytics evidence and permission to publish them. No releases, audio players, collaborators, coaching offerings, vlogs, or social links were invented.
- Fitness uses the supplied basketball and gym photos. Running and snowboarding are not documented without assets or personal notes.
- Ventures preserves the supplied independent-business background without unsupported performance figures or invented business links.

## Items for Eric’s review

1. Confirm the updated LDRS dates and May 2028 graduation date.
2. Confirm the employer metrics are approved for public use; estimates and projections are already labeled.
3. Provide completed Romaeris work details if it should go beyond the current exploratory-scope description.
4. Confirm omitted skills before adding them, and supply music credit / business analytics sources if those claims should return.
5. The résumé summary, print/PDF feature, route, and links were removed at Eric’s request in the single-page revision. The former URL redirects to the homepage.

## Link checks

HTTP HEAD requests returned **200** for the GitHub profile, LinkedIn profile, and all six project repository links on November 4, 2026. External service availability and signed-in LinkedIn behavior can change. No hosted project demos were found, so case studies link to source rather than inventing demo URLs.
