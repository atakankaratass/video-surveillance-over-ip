# SDK And Open-Source Disclosure Draft

## Libraries And Tools Used

- `dash.js`
- Playwright
- Vitest
- Vite
- TypeScript
- ESLint
- Prettier
- Husky
- `lint-staged`
- FFmpeg
- NGINX

## Where Each One Was Used

- `dash.js`: browser-side DASH playback engine for the custom HTML5 player
- Playwright: end-to-end browser verification of the player shell and controls
- Vitest: unit and integration tests for server and player helpers
- Vite: frontend development and production build pipeline
- TypeScript: typed implementation across player and server scripts
- ESLint: repository lint enforcement with zero-warning policy
- Prettier: formatting for code and documentation
- Husky: local git hook enforcement for repository quality gates
- `lint-staged`: staged-file formatting and lint autofix integration
- FFmpeg: live capture, encoding, and DASH output generation
- NGINX: HTTP serving of the built player and generated DASH artifacts

## Notes For Final Report Transfer

- The final report should include a short disclosure section derived from this file.
- The report should describe both what was used and where it was used.
- If additional libraries or SDKs are introduced before submission, add them here before writing the final report.
