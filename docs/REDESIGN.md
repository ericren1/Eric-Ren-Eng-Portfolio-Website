# Current portfolio revision

Implemented locally in the existing React / Vite repository; no deployment, commit, or push.

## Navigation and hierarchy

- Persistent black top bar with er. at the left, acting as Home, beside About, Experience, Projects, and Off the Clock. The current section is indicated while scrolling.
- Section jumps account for the sticky header and respect reduced motion. Clicking the same section again returns to its beginning.
- Smaller Eric Ren title, readable asymmetric Computer Engineering student / Software engineer subtitle, larger GitHub and LinkedIn links, and the public email directly on Home. The formerly empty side now contains seven authentic archive photos in an overlapping, gently drifting collage.
- Hover or keyboard focus raises a photo above its neighbors and pauses drift for stable interaction. Clicking enlarges it in the shared viewer, with next/previous navigation. Pause/play is provided, reduced motion disables animation, and offscreen collages stop animating.
- Clear underlined editorial section titles. Smaller metadata and body text are increased for readability.
- About retains the personal photograph without a caption. Education is removed. Tech Stack has three compact categories: Languages, Frameworks, Tools.

## Professional content

Work and projects stay open on the black canvas, without surrounding cards or expansion controls. The fall TD team lunch and speed-mentoring photos and the summer mentoring-conference photo replace the work-photo placeholders. Fall photos can be browsed together in the viewer; one summer photo and the fall photo also appear in the homepage collage. Filename labels identify the matching seasons. Responsive variants preserve the originals.

Supplied logos replace logo placeholders: TD’s logo is used for all three TD roles, Romaeris has its matching logo, and LDRS uses the supplied no logo.jpg. The supplied Unity Health Toronto logo is not assigned to an unrelated company. Optional job.logo still permits an explicit override; logo images remain non-interactive.

Project images, the About photograph, and personal galleries use the same ImageViewer. The photograph occupies most of the available view while leaving an outer margin and a translucent, dimmed view of the current page. The close × is at the upper right; Escape and outside clicks also dismiss it. Focus and page scrolling are restored.

## Off the Clock

- Photography opens a tighter scattered grid of stacked-photo album covers, without the former Travel Photographs heading or introduction. Hover/focus darkens a cover and reveals Open album. Covers have no Enlarge option.
- User-specified trip labels: China — Aug ’26; F1 Miami — ’25; Eastern Caribbean — ’25; Mexico, Cancun — ’23.
- Clicking a stack reveals the album’s scattered gallery in the same section. Its header uses the trip name/date. All albums returns to the covers and restores keyboard focus. Stacks use the first three available photos, repeating existing images as decorative prints when fewer are present; photo counts are not inflated.
- China and F1 Miami currently have one supplied photograph each; Eastern Caribbean includes the museum and waterfront photos; Mexico uses the supplied Tulum image within the user’s Cancun trip grouping. No extra photos or dates are fabricated.
- Music and Fitness & Sports display all their supplied photos in scrollable, irregular arrangements. Basketball and Gym each have their own editable blurb beside their corresponding photo in fitnessStories.
- Business is visible but disabled and greyed out. Keyboard navigation skips it, and direct/legacy Business links fall back to Photography.
- Old Creative URLs redirect to Off the Clock and their matching collections.

## Validation

The footer is now a compact header-scale bar. Eric Ren and Toronto sit together; GitHub, email, and LinkedIn sit together. The large Have something in mind / Let’s connect invitation is removed.

Production build and seven content/asset tests pass. Chrome checks four viewport layouts at 1440, 834, 390, and 320 CSS pixels. The suite includes work-photo assignment and responsiveness, moving-collage animation, hover stacking, pause/resume, reduced-motion changes, photo enlargement/browsing/focus, logo matching/fallback, album-stack interactions, compact footer, disabled Business, and all prior navigation/image/content checks. Latest results are in .qa/single-page-report.json. No browser exceptions or console warnings.

Oxlint checks the 27 source/script/config files with 96 rules and no diagnostics. Test report and visual captures are in ignored .qa/. Browser checks use an isolated Chrome profile, not a personal profile; physical iOS, Safari, and Firefox are not claimed.

Factual project/employer evidence remains recorded in CONTENT-AUDIT.md. Education details remain historical source information there, although no Education section is rendered.
