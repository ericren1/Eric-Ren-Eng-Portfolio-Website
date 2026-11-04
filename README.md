# Eric Ren — Engineering & Off the Clock

A black, single-page engineering portfolio with persistent section navigation, open editorial layouts, and personal photo collections.

## Development

```sh
npm install
npm run dev
npm run build
npm run preview
npm test
```

Deploy `dist/` to Cloudflare Pages. These changes have not been deployed.

## Content and assets

- `src/components/Navbar.jsx`: sticky navigation and the er. home link.
- `src/pages/Home.jsx`: smaller name, asymmetric role subtitle, social links, visible email, and an interactive moving photo collage.
- `src/components/HomeCollage.jsx` and `src/data/homeCollage.js`: curated archive photos, varied placements, slow drift, hover/focus stacking, pause/play, and reduced-motion handling. Images open the shared viewer.
- `src/pages/About.jsx`: biography and compact Tech Stack. Education and the portrait caption are removed.
- `src/data/profile.js`: public contact details and the Languages / Frameworks / Tools groups.
- `src/data/experience.js` and `src/data/workPhotos.js`: roles, bullets, and real work photos. Fall TD uses the team lunch and speed-mentoring photographs; summer TD includes the mentoring conference. A summer and a fall photo also appear in the moving homepage collage.
- `src/data/companyLogos.js`: matches supplied TD and Romaeris logos to their company names. LDRS and unknown companies use the supplied `public/images/Logos/no logo.jpg`. Unity Health Toronto’s supplied logo is reserved for an exact company match. Logos remain non-interactive.
- `src/data/projects.js`: factual project content and optional imagery.
- `src/data/creative.js`: trip folders and their photo arrays, music/fitness images, editable music `offClockBlurbs`, separate Basketball/Gym `fitnessStories`, and the disabled Business collection.
- `src/components/ImageViewer.jsx`: shared enlarged-photo overlay with a translucent backdrop, close button, Escape, outside-click dismissal, and gallery arrow controls.
- `src/components/Photo.jsx`: responsive images with enlargement by default. Album covers open their album directly and have no Enlarge action.
- `src/styles.css`: responsive typography, black surfaces, underlined section headings, and scattered layouts.

Trip folders: **China — Aug ’26**, **F1 Miami — ’25**, **Eastern Caribbean — ’25**, and **Mexico, Cancun — ’23**. Add real trip images to the corresponding `travelTrips[].photos` arrays. Existing individual photo captions are retained; the Mexico folder’s supplied image is captioned Tulum.

Album covers layer the first available photographs with slight rotations. Albums with fewer than three photos repeat their existing cover as decorative background prints; displayed photo counts remain accurate. Hover or keyboard focus darkens the stack and reveals Open album. The removed Travel Photographs heading and introduction are not shown. Opening an album displays its own name and an All albums return link.

The music and fitness panels show all photos in scrollable, irregular compositions. Music copy is editable in `offClockBlurbs`; Basketball and Gym each have their own entry in `fitnessStories`. Business is a greyed-out, disabled tab and cannot be opened by clicking, keyboard navigation, or direct links. No visitor-facing editor or CMS is added.

The footer is a compact identity/link bar, with Toronto next to Eric Ren and email next to GitHub. The large contact invitation has been removed.

Original images stay in `public/images/`. The optimizer includes root-level personal images and the `Work photos` folder, preserving originals. Company logos stay in their supplied format. Regenerate responsive variants on Windows:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/optimize-images.ps1
```

## Verification

`npm run test:browser` expects a preview at `http://127.0.0.1:4173` (override with `QA_URL`) and an isolated Chrome profile exposing CDP on port 9222. It checks four viewport sizes, sticky navigation, headings, photo overlays, gallery controls, trip folders, typography/content changes, and legacy URL recovery. Results and screenshots are in ignored `.qa/`.

`npm test` validates benchmark evidence and content/asset boundaries. Oxlint is reused from the adjacent scheduler checkout; no new dependencies were added.

See [content audit](docs/CONTENT-AUDIT.md) for factual provenance and [revision notes](docs/REDESIGN.md) for current behavior.
