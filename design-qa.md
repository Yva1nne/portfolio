# Design QA

## Comparison target

- Source visual truth: `/tmp/portfolio-source-ticket-639x582.png`, rendered from Git commit `34fe022` at the original ticket-cover state.
- Implementation screenshot: `/tmp/portfolio-current-ticket-final-639x582.jpg`, rendered from `http://127.0.0.1:4173/`.
- Combined comparison input: `/tmp/ticket-comparison-final.jpg` (source left, implementation right).
- Viewport: `639 × 582` CSS px.
- Pixels and density: source `639 × 582`, implementation `639 × 582`; both saved at the same pixel dimensions with no density resampling.
- State: cover idle, ticket stub attached, callout visible, no hover or drag.

## Full-view comparison evidence

- The current cover intentionally retains the redesigned, larger ticket and identity header. The scoped restoration target is the original callout treatment.
- The original dotted enclosure, curved hand-drawn arrow, and handwritten instruction are restored with the original raster assets and preserve their relationship to the ticket stub.
- The callout remains inside the `639 × 582` viewport: dotted box `x 466.28 / y 144.02 / 175.72 × 258.55` CSS px; the arrow and handwritten text sit below the stub without covering the main ticket copy.

## Focused region comparison evidence

- Focused region: ticket stub and instruction callout.
- Source assets: `public/cover/Rectangle 7.png`, `public/cover/Vector 1.png`, and the sanitized copy `public/cover/stub-callout-text.png`.
- No CSS drawing, text glyph, inline SVG, or approximate replacement is used for the restored artwork.
- Fonts and typography: the callout typography is the original raster artwork; the surrounding cover typography remains unchanged.
- Spacing and layout: the dotted enclosure follows the larger current stub, while the arrow and lettering keep the original visual sequence.
- Colors and tokens: original gray callout artwork and existing neutral cover palette are preserved.
- Image quality: original transparent PNG assets are used at intrinsic aspect ratios with no stretching.
- Copy: the restored handwritten copy matches the original asset; the button retains an accessible Enter instruction through its `aria-label`.

## Additional annotated-screen verification

- `1062 × 582`: timeline title computed at `60.003px`; education and project lanes render side by side at `361.40px` and `520.07px` with no overlap.
- `1062 × 582`: desktop navigation collapses to the MENU control, preventing the annotated heading collision.
- MacBook window: Finder-style open and close transitions interpolate `clip-path`, opacity, and scale from the selected folder origin. Project-to-project transitions use directional slide classes.
- MacBook window scroll: `.project-scroll` measured `498px` client height and `773px` scroll height; a wheel gesture changed `scrollTop` from `0` to `275`.
- Window chrome: all three traffic-light controls use equal `24px` tracks; titles are left-aligned in the safe area and do not sit under the MacBook notch.
- Defect project: `/tmp/portfolio-defect-top-1062x582.jpg` shows the video above the fold; `/tmp/portfolio-defect-award-1062x582.jpg` shows the restored certificate at the content end.
- Ganttodo project: `/tmp/portfolio-ganttodo-top-1062x582.jpg` shows the core preview above the fold after the compact header revision.
- Zhipu project: `/tmp/portfolio-zhipu-window-1062x582.jpg` shows the compact introduction and notch-safe title.
- Primary interactions tested: global Enter entry, folder open, window close, project switch, nested project scroll, project navigation, and video-stage buttons remaining reachable.
- Browser console: final clean run returned no errors or warnings.

## Comparison history

### Iteration 1 findings

- [P1] The original callout artwork had been replaced with generic HTML arrow and text.
- [P1] Enter only worked after the ticket button had focus, despite the page-level instruction.
- [P1] The MacBook project screen did not consume wheel scrolling reliably.
- [P2] Timeline education and project content shared one lane, producing overlap and oversized entry titles at the annotated viewport.
- [P2] Fixed desktop navigation, MacBook notch, and oversized project headers collided with or displaced primary content at `1062 × 582`.

### Fixes and post-fix evidence

- Restored the three original callout assets and compared them side by side in `/tmp/ticket-comparison-final.jpg`.
- Added a cover-level Enter handler; a body-level Enter completed the transition and focused the About heading.
- Consolidated scrolling in `.project-scroll`, stopped wheel propagation, and verified the `0 → 275px` scroll change.
- Split the timeline into education and project/competition/internship lanes, reduced entry typography, and verified both columns at `1062 × 582`.
- Moved medium-width navigation to MENU, restored Finder transitions, equalized traffic lights, made window titles notch-safe, and compacted the Defect, Zhipu, and Ganttodo headers.

## Findings

- No actionable P0, P1, or P2 visual or interaction findings remain in the annotated states.

## Follow-up polish

- No P3 item is required for this annotation round.

final result: passed
