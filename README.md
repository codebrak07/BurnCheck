# BurnCheck | Free AI Spend Auditor for Startups

**BurnCheck** is a high-fidelity, premium client-side web application designed to help startups, engineering leads, and founders audit their developer AI tools and licensing costs.

In under 2 minutes, BurnCheck highlights waste leaks across subscription models (like paying for unused Enterprise plans in micro-teams), analyzes API context usage, estimates monthly/annual savings, and generates actionable restructuring advice.

---

## 🚀 Key Product Features

*   **Tactile Parallax Interactions**: Modern components featuring X- and Y-axis 3D perspective rotation, click spring snapping, and radial spotlight cursor tracing.
*   **Inferno Cursor Trail**: Canvas physics rendering upward-accelerating particle trails (`$`, `🔥`, `💸`) following cursor movement.
*   **Stateless URL Sharing**: Inputs serialize directly into a compact URL-safe Base64 path identifier (`/audit/:id`). Reports can be shared statelessly, loading instantly in any browser or on any port without server databases.
*   **Transactional Email Delivery**: Wired to send HTML confirmation reports to users on submit using **Resend** or **Postmark** endpoints.
*   **Direct PDF Generation**: Print-specific `@media print` rules hide interactive dashboard components to produce clean, layout-inversion-free reports.
*   **Honeypot Spam Blocker**: A hidden bot-trap input to filter out automated registration scripts.

---

## 🛠️ Tech Stack & Architecture

*   **Core Scaffold**: React 18, Vite 8, Vanilla CSS.
*   **Routing**: `react-router-dom` client-side routes.
*   **Iconography**: `lucide-react`.
*   **Styling System**: Custom VoltAgent design system tokens (electric green `#00d992`, dark canvas `#101010`, gray cards `#3d3a39`).

---

## ⚙️ Environment Variables Setup

Create a `.env` file in the repository root to configure external integrations:

```env
# Groq LLM API Key (For dynamic AI analysis summaries)
VITE_GROQ_API_KEY=gsk_your_groq_api_key_here

# Transactional Email Mails (For report confirmation dispatches)
# Configure either Resend OR Postmark to enable active mail generation
VITE_RESEND_API_KEY=re_your_resend_api_key_here
VITE_POSTMARK_SERVER_TOKEN=your_postmark_server_token_here
```

---

## 📘 Repository Document Reference Index

For in-depth explanations of specific business or technical layers, see the root reference documents:

*   [PRICING_DATA.md](file:///Users/brak/Desktop/BurnCheck/PRICING_DATA.md) - Verified vendor licensing rates and rules engine calculations.
*   [ARCHITECTURE.md](file:///Users/brak/Desktop/BurnCheck/ARCHITECTURE.md) - Deep dive into routing, stateless serialization, and physics loops.
*   [DEVLOG.md](file:///Users/brak/Desktop/BurnCheck/DEVLOG.md) - Detailed engineering milestone cycles and progression timelines.
*   [REFLECTION.md](file:///Users/brak/Desktop/BurnCheck/REFLECTION.md) - Architectural reviews and software trade-offs.
*   [TESTS.md](file:///Users/brak/Desktop/BurnCheck/TESTS.md) - Regression checks, form evaluations, and QA plans.
*   [PROMPTS.md](file:///Users/brak/Desktop/BurnCheck/PROMPTS.md) - Prompt layouts and system prompts used for AI generation.
*   [GTM.md](file:///Users/brak/Desktop/BurnCheck/GTM.md) - Go-To-Market strategies, personas, and loops.
*   [ECONOMICS.md](file:///Users/brak/Desktop/BurnCheck/ECONOMICS.md) - SaaS infrastructure margins and funnel conversion targets.
*   [USER_INTERVIEWS.md](file:///Users/brak/Desktop/BurnCheck/USER_INTERVIEWS.md) - Startup critique summaries and usability takeaways.
*   [LANDING_COPY.md](file:///Users/brak/Desktop/BurnCheck/LANDING_COPY.md) - Content copy guidelines and typography structures.
*   [METRICS.md](file:///Users/brak/Desktop/BurnCheck/METRICS.md) - Performance indicators and funnel targets.

---

## 💻 Local Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the hot-reload dev server:
   ```bash
   npm run dev
   ```
3. Compile production assets:
   ```bash
   npm run build
   ```
