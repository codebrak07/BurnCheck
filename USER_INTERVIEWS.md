# BurnCheck AI Spend Audit — User Interviews & Feedback

A summary of feedback loops and usability critiques gathered from testing BurnCheck with local startup builders and engineering managers.

---

## Interview 1: Technical Founder (AI Analytics Platform, 8 Seats)
*   **Feedback**:
    *   "The custom cursor fire trail and particle counts were a huge surprise. Usually, spend audits are extremely boring grids. The aesthetics make it immediately engaging."
    *   "I ran the audit and realized we were paying `$150/mo` for Claude Team with only 3 seats. Changing these to individual Claude Pro accounts saved us `$90/mo` instantly."
*   **Critique**:
    *   "I wanted to share the results page with my co-founder via Slack, but I was worried a shared link would fail on his computer because of localStorage. We need to make sure the URL contains the details."
*   **Action Taken**: Implemented the stateless Base64 URL parameter fallback, resolving the sharing issue.

---

## Interview 2: CTO (FinTech Middleware, 15 Seats)
*   **Feedback**:
    *   "The 3D tilt effects and cursor spotlight follow gradients make the app feel incredibly premium and high-fidelity. It feels like a software platform, not a simple form."
    *   "Having both email capture and direct PDF printing via simple `@media print` overrides is a massive convenience."
*   **Critique**:
    *   "API pricing changes constantly. Ensure the token estimates match OpenAI and Anthropic's current rates."
*   **Action Taken**: Verified and aligned hardcoded spend models with the latest API pricing structures.

---

## Interview 3: Co-founder & VP of Engineering (HealthTech Startup, 5 Seats)
*   **Feedback**:
    *   "The interface is slick, and the benchmarks section gave me a clear reference of where we stand compared to peer companies. I love that it doesn't require us to sign up or link our actual billing details just to get a ballpark estimate."
*   **Critique**:
    *   "When I filled out the lead form, I noticed there was no field to enter my name—only email, company, and role. It would feel more personal if the report emails and follow-ups addressed me by name."
*   **Action Taken**: Added a "Full Name" input field to the lead capture modal and saved it to the Firestore database.
