# Eric Ren / Engineering & elsewhere

A React 18 + Vite portfolio with a compact editorial homepage, dedicated engineering pages, and a living photographic contact sheet. Default bone / charcoal light theme, with a persistent dark theme.

## Run

- npm install
- npm run dev
- npm run build
- npm test
- npm run preview -- --host 127.0.0.1
- npm run test:browser (requires an isolated Chrome DevTools endpoint on localhost:9222)

## Content and routes

- /: compact introduction, company/project links, social profiles, interactive collage.
- /experience: company index.
- /experience/td-securities: all three TD internships, original bullets, technologies, engineering notes, and supplied work photographs.
- /experience/romaeris, /experience/ldrs, /experience/unity-health: existing role content.
- /projects/url-shortener, /projects/ai-personal-scheduler, /projects/ai-exercise-form-tracker: featured detail pages using the existing project write-ups.
- /more-projects: planned AI agents and earlier projects, with concise scope and technologies. No individual links or demo buttons.
- /more-about-me: the existing Off the Clock photography/travel albums, music, and sports content. Business remains disabled.

Role data stays in src/data/experience.js, project data in src/data/projects.js, and personal galleries in src/data/creative.js and the generated src/data/photoLibrary.js. Original assets remain in public/images. Old single-page components and stylesheet are retained but no longer used by the application entry point.

## Living contact sheet

src/data/contactSheet.js controls count (default 18), pinned images, exclusions, and explicit ordering. The reorganized library includes 6 albums with 73 travel photographs, plus Music, Sports, TD, and portrait assets. The homepage selects 18 distinct photos without duplicates. Album/season dates are recorded explicitly. The fall team-lunch photo has EXIF DateTimeOriginal 2026:10:08 13:53:17. Undated photographs remain undated and use curated ordering; filesystem modification time is never used as capture time.

src/components/HomeCollage.jsx owns the stable canvas, explicit transform endpoints, diagonal-wave assembly, interruptions/reversal, and touch behavior. Desktop hover or keyboard focus assembles inward. The homepage is centered; six photographs roam behind the copy on desktop, and the remaining photographs use wider floating paths. They brighten on hover and support mouse dragging or arrow-key positioning. All return to the right-hand contact sheet. Mobile keeps the motion contained. On touch, the first tap assembles and the next opens More About Me. Reduced motion uses a static contact sheet. The separate pause control stops floating motion.

## Visual system

src/editorial.css is the active stylesheet. Instrument Sans and Caveat are hosted locally in public/fonts with their OFL licenses. Theme selection uses the portfolio-theme localStorage key.

## Verification

npm test checks content boundaries, benchmarks, and image assets. scripts/verify-editorial.mjs checks responsive layouts, routes, real photo preservation, animation choreography/reversal, keyboard focus, touch interaction, theme persistence, and the reused album viewer. Reports and screenshots are saved under ignored .qa/.

This checkout is the local implementation. No hosting registration, source push, or deployment was performed for this redesign.

To refresh organized photos after adding or moving files, run from the repository root:

    powershell -NoProfile -ExecutionPolicy Bypass -File scripts/optimize-images.ps1
    node scripts/sync-photo-library.mjs

Albums come from public/images/Photography; Music, Sports, and TD photos use their matching folders. Known display names and cover choices are configured in the sync script. Responsive copies correct EXIF orientation and preserve capture dates when available. Original images remain unchanged.
