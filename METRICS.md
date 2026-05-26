# BurnCheck AI Spend Audit — Performance Metrics & KPIs

Our metric collection parameters designed to track product success, conversion rates, and growth loops.

---

## 1. Funnel Conversion KPIs

| Metric Parameter | Measurement Method | Target Goal |
| :--- | :--- | :---: |
| **Landing Engagement** | Scroll metrics to Benchmarks, tools grid | `> 65%` |
| **Audit Click-Through** | CTA click to wizard form view `/audit` | `> 22%` |
| **Configuration Submit** | Form completed to result dashboard `/audit/:id` | `> 80%` |
| **Report Lead Capture** | Email submission to PDF generation | `> 25%` |
| **Viral Referral Shares** | Share button clipboard copiers | `> 12%` |

---

## 2. Dynamic Performance Metrics
*   **Audit Engine Processing Latency**: Calculation run time should remain `< 5ms` for up to 30 custom tool parameters (enabled by direct React in-memory array reduction).
*   **Stateless Page Render Speed**: Initial loading time for shared Base64 URLs must remain `< 100ms`, achieved through serverless hosting configurations and the complete absence of blocking database reads.
*   **Email Dispatch Time**: Lead capture transactional delivery using Resend / Postmark API endpoints must resolve in under `1200ms` for seamless UX transitions.
