# BurnCheck AI Spend Audit — Development Log

This development log tracks the milestones, feature cycles, and technical updates during the engineering phase of BurnCheck.

---

## [2026-05-21] - Day 1: Project Scaffolding & Theme Setups
*   Initialized project structure using React 18, Vite 8, and Vanilla CSS styles.
*   Concocted the **VoltAgent** design guidelines: dark base backgrounds (`#101010`), electric neon green highlights (`#00d992`), thin charcoal card borders (`#3d3a39`), and 1px dashed separators.
*   Wired index HTML layout, configured custom Google Fonts (Inter, Outfit, JetBrains Mono), and added custom title tags and meta descriptions.
*   Built base visual layouts: `Navbar`, `Footer`, `HeroSection`, and `SocialProof`.

## [2026-05-22] - Day 2: Dynamic Multi-Tool Form Builder
*   Created the primary configurator form wrapper in [AuditForm.jsx](file:///Users/brak/Desktop/BurnCheck/src/components/AuditForm.jsx).
*   Built dynamic tool input list rows permitting users to add multiple SaaS tool subscriptions, specify tier selections, edit seat ranges, and write down monthly costs.
*   Added auto-updating counters for current estimated stack costs and active seat tallies.
*   Integrated HTML5 validations and custom user warnings for invalid input configurations.

## [2026-05-23] - Day 3: Kinetic Mouse Trail & Parallax Visuals
*   Developed the custom particle rendering canvas mouse tracker inside [CustomCursor.jsx](file:///Users/brak/Desktop/BurnCheck/src/components/CustomCursor.jsx) displaying physics-simulated particle symbols (`🔥`, `$`, `💸`) with vector offsets, upward friction drift, decay, and random spin factors.
*   Created 3D tilt interaction handlers mapping card transformations directly to pointer quadrant coordinates in [StepsRow.jsx](file:///Users/brak/Desktop/BurnCheck/src/components/StepsRow.jsx) and [ToolsGrid.jsx](file:///Users/brak/Desktop/BurnCheck/src/components/ToolsGrid.jsx).
*   Mapped CSS custom properties (`--mouse-x`, `--mouse-y`) to trigger radial green spotlight animations behind dark cards.

## [2026-05-24] - Day 4: Spend Audit Benchmark Logic
*   Authored the cost auditing math engine `runAuditBenchmark` in [App.jsx](file:///Users/brak/Desktop/BurnCheck/src/App.jsx) mapping license prices, plan minimum thresholds, and volume rules for common tools (Cursor, Copilot, ChatGPT, Claude, Windsurf).
*   Constructed dynamic recommendations outlining exactly how to downgrade enterprise subscriptions or underutilized seat bundles safely.
*   Built the audit report UI dashboard to showcase monthly and annual savings, tool-by-tool breakdowns, and AI spend comparisons.

## [2026-05-25] - Day 5: Stateless URL Serialization & Routing
*   Integrated `react-router-dom` and set up routes `/`, `/audit`, and `/audit/:id`.
*   Developed Base64-safe state serialization methods (`encodeAuditId` and `decodeAuditId`) that compile all user form selections into single URL path parameters.
*   Coded route params state decoders inside `ResultsPage` allowing users to share unique links to their results instantly without requiring databases.
*   Ensured privacy by stripping email, company, and role identifiers from shared links.

## [2026-05-26] - Day 6: Firestore Storage & Transactional Email
*   Configured the Firebase client SDK in [firebase.js](file:///Users/brak/Desktop/BurnCheck/src/firebase.js) and enabled Google Analytics tracking.
*   Designed the **Lead Capture Modal** to prompt users for their work details (Work Email, Company Name, and Role) before saving.
*   Created standard email dispatcher endpoints leveraging client-side fetch modules to Resend and Postmark mail services.
*   Added a bot-deterrent honeypot spam-trap field to block automatic script submissions.

## [2026-05-27] - Day 7: Error Recovery, SPA Routing, and Testing
*   Added a `vercel.json` rewrite configuration ensuring client-side route paths map correctly to `index.html` without returning 404 errors on refreshes.
*   Wrapped the Firestore database calls in try/catch blocks to ensure that lead capture confirmations continue even if Firestore writes fail.
*   Updated the Lead Capture form to collect **Full Name** in addition to email/role, mapping it to the Firestore `leads` collection.
*   Wrote 5 unit tests verifying key calculation algorithms, serialization flows, and boundary handling in `src/tests/audit.test.js`.
*   Installed Vitest and added a standard GitHub Actions CI pipeline in `.github/workflows/ci.yml`.
*   **CI Failure (2026-05-27)**: Vercel build failed due to stray lines after the `useMemo` hook in `AuditResults.jsx` causing a syntax error (missing semicolon). Fixed by removing extraneous `totalMonthlySavings`, `totalAnnualSavings`, and `tools` declarations outside the data object (lines 192‑194). CI now passes.

The above content shows the entire, complete file contents of the requested file.
