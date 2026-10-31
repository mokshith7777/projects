# JARVIS × TIMEJ website

A lightweight, responsive product showcase and browser-side timekeeping demo for TimeJ.

## Files
- `index.html` — semantic page structure and product content
- `styles.css` — responsive visual system and motion
- `app.js` — live clock, mobile navigation, scroll reveals and interactive demo

## Run locally
Open `index.html` in a browser, or serve the repository with any static HTTP server.

## GitHub Pages
This folder is designed to live inside the existing `mokshith7777/projects` repository. Once the repository's GitHub Pages deployment serves the root, the site path is:

`https://mokshith7777.github.io/projects/timej-site/`

If the repository's Pages configuration uses a different source or base path, adjust the deployment configuration accordingly.

## Performance choices
- No runtime framework or animation dependency.
- IntersectionObserver reveals elements once and then unobserves them.
- Live clock updates once per second.
- The demo timer updates at 200ms only while running.
- Respects `prefers-reduced-motion`.
- No image-heavy hero assets, autoplay video, or continuously running canvas.

## Product-data integrity
The APK link, package ID, version, size and stated Android compatibility come from the supplied TimeJ master brief. Performance and security claims are explicitly marked as unverified pending inspection of the actual APK/source. The browser demo is a local approximation and does not claim native Android background execution, wake locks, persistent alarms, or exact APK theme parity.

## Source inspiration incorporated
The supplied Skiper components informed the interaction direction:
- Skiper 31: scroll-progress character movement, adapted as a dependency-free one-time reveal treatment.
- Skiper 17: pinned stacked-card storytelling, reserved as a future enhancement because pinning every long section can hurt mobile scroll performance.
- Skiper 48: card carousel, deferred until real app screenshots/assets are supplied; the original image paths are not included in the uploaded component.

The uploaded components require external packages and assets in their original form. This static version intentionally avoids shipping unresolved imports or broken image paths.
