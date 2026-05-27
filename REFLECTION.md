# BurnCheck AI Spend Audit — Engineering Reflection

An overview of architectural decisions, engineering trade-offs, and critical learnings compiled during the development of BurnCheck.

---

### Question 1: What was the core architectural trade-off of using a stateless client-side Base64-serialized URL state over a traditional relational database (SQL/NoSQL) storage model?

**Answer:**  
In constructing BurnCheck, the primary design challenge was offering frictionless, instant shareability of audit reports without the latency, financial overhead, and privacy liabilities associated with a traditional relational database. By choosing a stateless serialization pattern, we encode the entire configurator state (team size, use case, and selected tools, including plans, seats, and costs) into a compact, URL-safe Base64 string that appends as `/audit/:id`. 

The trade-offs of this approach are clear. On the positive side, it makes the application 100% serverless, private, and zero-cost to host. Because there is no database lookup, page loads are near-instantaneous, and it runs identically in local environments across different dev ports (e.g., `5173` or `5174`) without connection strings or configurations. However, the downside is URL length. Encoding extensive lists of tools produces longer URLs (though we optimized this by mapping tool objects into concise position-based arrays before Base64 serialization). Furthermore, it prevents central querying or cross-report aggregation for business intelligence, which is why we supplemented it with a lightweight Firebase Firestore write for lead captures. This hybrid approach keeps user reports private while still allowing the growth funnel to gather contacts.

---

### Question 2: How did the integration of React Router SPA routing interact with Vercel's static file serving, and how did the vercel.json rewrite resolve this conflict?

**Answer:**  
BurnCheck is built as a Single Page Application (SPA), relying on `react-router-dom` to manage client-side transitions between the landing page (`/`), the configurator page (`/audit`), and the report dashboard (`/audit/:id`). When running locally on Vite's dev server, Vite intercepts all incoming requests and routes them to `index.html`, allowing the React router script to read the browser path and mount the corresponding components. However, when deployed to static hosting platforms like Vercel, the platform acts as a standard file server.

When a user attempts to refresh the page at a URL like `burn-check.vercel.app/audit/eyJ0Ijo1...` or access it directly, Vercel looks for a physical directory or file named `/audit/eyJ0Ijo1...` in the static build output. Finding nothing, it returns a standard `404 Not Found` error. To resolve this structural conflict, we introduced a [vercel.json](file:///Users/brak/Desktop/BurnCheck/vercel.json) file at the project root. This configuration defines a catch-all rewrite rule that maps all incoming paths (`/(.*)`) back to `/index.html`. This ensures that Vercel always serves the base entry file, allowing React to load in the browser, parse the URL path parameters, and render the correct results page statelessly without broken assets.

---

### Question 3: What are the security, privacy, and architecture implications of executing direct client-side API requests to transactional mail APIs like Resend and Postmark?

**Answer:**  
Allowing users to receive HTML report summaries in their inbox required integrating transactional email providers (Resend and Postmark). In a typical multi-tier architecture, client apps send payloads to an API backend, which validates the inputs and uses secure server-side credentials to dispatch the emails. For a client-only serverless app like BurnCheck, attempting to run these fetch operations directly from the browser introduces significant security risks. If we embed production API keys (e.g., `VITE_RESEND_API_KEY`) directly into the client build, anyone inspecting the browser network tab or decompiling the bundle can steal the credentials and use them to send spam under our domain.

To mitigate this while maintaining local execution flexibility, we implemented a dual-mode integration. In the local development environment, the application detects `VITE_RESEND_API_KEY` or `VITE_POSTMARK_SERVER_TOKEN` from the `.env` file and executes direct client-side fetch requests, permitting fast debugging. If no keys are present, the system logs the event and falls back to a mock loader that simulates successful delivery. For a scaled production release, these environment endpoints will be routed through serverless edge functions to proxy API tokens securely, hiding them from the public client bundle.

---

### Question 4: How was the Inferno Canvas custom cursor trail designed, and what physics concepts were applied to create realistic particle motion?

**Answer:**  
Standard dashboards can feel static, so we added the Inferno Canvas cursor trail in [CustomCursor.jsx](file:///Users/brak/Desktop/BurnCheck/src/components/CustomCursor.jsx) to visually reinforce the theme of "burning cash" on underutilized AI subscriptions. The engine uses a full-screen HTML5 Canvas overlay positioned on top of the DOM with `pointer-events: none` to keep the layout interactive. The rendering is driven by a high-performance `requestAnimationFrame` loop that updates and draws particle instances.

To make the movement feel organic and fluid rather than artificial, we implemented basic 2D physics equations. Each particle (represented by emojis like `🔥`, `$`, and `💸`) is initialized at the mouse coordinates with a starting velocity matching the speed of the mouse movement. On every animation frame, we apply vertical gravity (a negative acceleration value that causes particles to float upwards like hot air), horizontal drag (friction slowing lateral movement), and a random angular spin velocity. We also apply an opacity decay factor linked to the particle's lifespan. Once a particle's opacity hits zero, it is garbage-collected to prevent memory leaks, maintaining a consistent 60 FPS refresh rate.

---

### Question 5: What is the testing strategy for the local spend auditing math engine, and how do unit tests ensure correctness against changing plan pricing structures?

**Answer:**  
Because BurnCheck calculates real savings recommendations based on active subscription tiers, maintaining the accuracy of our calculation engine is critical. Our testing strategy focuses on unit-testing the core mathematical models in `src/tests/audit.test.js` using Vitest. Because functions like `runAuditBenchmark`, `encodeAuditId`, and `decodeAuditId` are pure functions, we can test them reliably without mocking UI components or network calls.

The unit tests verify five distinct scenarios:
1. **Seat Threshold Downgrades**: Verifying that Cursor Business plans for small teams (under 5 seats) trigger a recommendation to downgrade to Pro, calculating the correct savings.
2. **Claude Minimum seat limits**: Ensuring that Claude Team plans with under 5 seats flag the underutilization and calculate the $30/seat minimum savings correctly.
3. **Optimal Stack Allocations**: Validating that optimized stack setups return zero potential savings and an optimal status flag.
4. **Base64 Round-Trip Integrity**: Ensuring that form states encode and decode back to their exact original JSON formats without losing fields.
5. **Boundary & Error Handling**: Verifying that invalid or corrupted Base64 strings are handled gracefully by returning `null` instead of crashing.

This automated suite runs in CI on every push, ensuring that if vendor pricings are updated in the future, developers can verify the math instantly.
