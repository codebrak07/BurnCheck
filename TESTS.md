# BurnCheck AI Spend Audit — Quality Assurance & Testing Plan

This document outlines the testing strategies, validation scripts, and manual check matrices implemented to guarantee accuracy and visual fidelity across BurnCheck.

---

## 1. Automated Verification Checks
*   **Compilation Build Checks**: Ensures the Vite compiler successfully tree-shakes assets and outputs code without linting or module resolution breaks.
    ```bash
    npm run build
    ```
*   **State Integrity Script** ([test_base64.js](file:///Users/brak/.gemini/antigravity-ide/brain/260a2d0e-9234-4f8f-a9f8-bde287eab23e/scratch/test_base64.js)): A Node.js regression script to verify that tool properties can serialize and deserialize into URL-safe strings with 100% data integrity.

---

## 2. Interactive QA Validation Matrix

### 1. Configure Form Wizard (`/audit`)
*   **Action**: Declare a team size of 4, use case "Coding", and add Cursor, Claude, and Copilot tools.
*   **Success Criteria**:
    *   The "declared monthly spend" ticker updates instantly with every keystroke.
    *   Adding or removing tools dynamically re-calculates the live total ticker.
    *   The system block correctly sets default plan tiers matching their index positions.

### 2. Parallax Spotlight Effects (All Cards)
*   **Action**: Float the mouse over steps cards, spend benchmarks cards, and detailed audit cards.
*   **Success Criteria**:
    *   Cards rotate on X and Y axes depending on mouse quadrant positions.
    *   A radial green spotlight follows the mouse coordinates from behind the card grid.
    *   Clicking causes cards to spring scale down and snap back up instantly.

### 3. Share URL stateless Loading (`/audit/:id`)
*   **Action**: Submit an audit, copy the unique share URL, clear localStorage, and paste the URL in a new private window.
*   **Success Criteria**:
    *   The page skips the loading error page and correctly decodes the Base64 state.
    *   Recomputes savings and displays the optimization advice instantly.
    *   Ensures that email, company, and role fields are completely removed and absent from the parsed client-side object for public visitors.

### 4. Lead Capture Honeypot Verification
*   **Action**: Focus the hidden input named "website" and input random text before submitting.
*   **Success Criteria**:
    *   The form transitions to a 800ms loading state.
    *   Bypasses external API fetch calls entirely.
    *   Transitions to "Report Sent!" silently, preventing automated spam scripts from loading servers with junk registrations.
