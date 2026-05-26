# BurnCheck AI Spend Audit — Engineering Reflection

An overview of architectural decisions, engineering trade-offs, and critical learnings compiled during the development of BurnCheck.

---

## 1. Architectural Trade-offs: Stateless URLs vs Database Stores

### Database Storage (The Traditional Path)
*   **Pros**: Small URL lengths (e.g. `/audit/x3mnv1j`), centralized tracking, queryable lead correlations.
*   **Cons**: Requires a backend server, database instances, schema migrations, network latency, and exposes the system to user data breach liabilities (emails, spends).

### Stateless Base64 URL States (The Chosen Path)
*   **Pros**: **100% serverless and private.** High-speed, instantaneous page transition mounts, robust cross-origin testing capacity (fully functional across separate ports like `5173` and `5174`), zero hosting cost, zero database configuration limits.
*   **Cons**: URL parameters are longer (though kept under 120 characters via compact mapping vectors).
*   **Decision Rationale**: For a free tool meant to build trust with privacy-conscious startups, removing the server entirely is a massive competitive advantage. Since the URL completely captures the stack parameters, reports are indefinitely shareable, loading instantly without database reads.

---

## 2. Kinetic UX Elements: Enhancing vs Distracting
*   **Tilt Interactions & Spotlights**: Standard flat dark dashboards often feel static or cheap. Adding 3D depth tilt coupled with spotlight gradients makes standard form inputs feel premium and highly responsive.
*   **Inferno Cursor**: Floating particle trails (`$`, `🔥`, `💸`) visually reinforce the theme of "burning cash" on AI tools. Applying physics vectors (decay, spin friction, random float speeds) keeps the animation elegant and organic rather than erratic.

---

## 3. Transactional Client Fetch Challenges
*   **Key Security**: While direct client-side fetch calls to Resend / Postmark facilitate serverless deploys, they expose API secrets if stored in a public production front-end code bundle.
*   **Mitigation Strategy**: The application uses environment configurations via `import.meta.env`. Users inputting keys locally can safely test live mails. For a scaled production release, these environment endpoints will be routed through serverless edge functions to proxy API tokens securely.
