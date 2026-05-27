# BurnCheck AI Spend Audit — Pricing Reference Data

This document acts as the source of truth for the subscription plan pricing and API token costs built into the **BurnCheck** audit rules engine. All data has been verified against the respective vendor pages.

---

## 1. Subscription Plan Licensing Rates

### Cursor (Anysphere)
*Source: [Cursor Pricing](https://www.cursor.com/pricing)*
*   **Pro Plan**: `$20 / user / month` (includes unlimited slow completions, 500 fast requests).
*   **Business Plan**: `$40 / user / month` (adds centralized billing, admin policies).
*   **Audit Vector**: Micro-teams (5 or fewer developers) do not require administrative policies or centralized access controls. The rules engine recommends downgrading from Cursor Business to Pro for teams of size $\le 5$, saving **$20/seat/month**.

### Claude (Anthropic)
*Source: [Anthropic Claude Plans](https://www.anthropic.com/claude)*
*   **Pro Plan**: `$20 / user / month` (unlocked limits).
*   **Team Plan**: `$30 / user / month` (minimum 5-seat billing required, meaning a baseline cost of `$150 / month` minimum).
*   **Audit Vector**: Startups with fewer than 5 members paying for the Team tier pay for unused phantom seats due to the 5-seat minimum. The engine flags this under-allocation and recommends downgrading to individual Pro plans, saving up to **$90/month**.

### ChatGPT (OpenAI)
*Source: [OpenAI ChatGPT Pricing](https://openai.com/chatgpt/pricing)*
*   **Plus Plan**: `$20 / user / month` (individual limits).
*   **Team Plan**: `$25 / user / month` (billed annually) or `$30 / user / month` (billed monthly). Minimum 2 seats.
*   **Audit Vector**: Solo builders or tiny pairs underutilized on ChatGPT Team workspace restrictions pay `$30 / seat / month`. We flag ChatGPT Team accounts with $< 3$ seats for consolidation or downgrade to Plus ($20/mo), saving **$10/seat/month**.

### GitHub Copilot
*Source: [GitHub Copilot Plans](https://github.com/features/copilot/plans)*
*   **Individual Plan**: `$10 / user / month` (or `$100 / year`).
*   **Business Plan**: `$19 / user / month` (adds license management, policy controls).
*   **Enterprise Plan**: `$39 / user / month` (adds fine-tuned models, PR summaries).
*   **Audit Vector**: Redundant administrative oversight controls for micro-teams. The engine recommends downgrading to Copilot Individual for teams $\le 5$ (saving **$9/seat/month**), and flags Enterprise seats for consolidation review.

### Windsurf (Codeium)
*Source: [Codeium Windsurf Pricing](https://codeium.com/pricing)*
*   **Pro Plan**: `$15 / user / month` (individual limits).
*   **Teams Plan**: `$30 / user / month` (workspace settings, shared keys).
*   **Audit Vector**: Recommends downgrading teams under 3 members from Teams to Pro, saving **$15/seat/month**.

---

## 2. API Token Cost Baselines
These references populate the spend tables and are audited under direct developer integrations.

*   **OpenAI API Pricing**: [OpenAI API Pricing](https://openai.com/api/pricing/)
*   **Anthropic API Pricing**: [Anthropic API Pricing](https://www.anthropic.com/pricing)
*   **Google Gemini API Pricing**: [Google AI Studio Pricing](https://ai.google.dev/pricing)

| Model Engine | Input Cost (per 1M tokens) | Output Cost (per 1M tokens) | Primary Leak Risk | Source URL |
| :--- | :---: | :---: | :--- | :--- |
| **GPT-4o (OpenAI)** | `$2.50` | `$10.00` | Large chat histories, verbose system instructions | [OpenAI Pricing](https://openai.com/api/pricing/) |
| **Claude 3.5 Sonnet (Anthropic)** | `$3.00` | `$15.00` | Complex multi-turn developer agent loops | [Anthropic Pricing](https://www.anthropic.com/pricing) |
| **Gemini 1.5 Pro (Google)** | `$1.25` / `$2.50` | `$5.00` / `$10.00` | Massive 2M token context window lookups | [Google AI Studio Pricing](https://ai.google.dev/pricing) |

---

## 3. Rules Engine Translation in Code
Our benchmark analyzer `runAuditBenchmark` in [App.jsx](file:///Users/brak/Desktop/BurnCheck/src/App.jsx) maps these constants directly to compute savings:

```javascript
if (name === 'Cursor') {
  if ((plan === 'Business' || plan === 'Enterprise') && seats <= 5) {
    recommendation = `Downgrade to Pro — Business plan collaboration features (like admin policies) are unused for small teams under 5.`;
    potentialSaving = Math.max(0, spend - (20 * seats));
  }
} else if (name === 'Claude') {
  if (plan === 'Team' && seats < 5) {
    recommendation = `Downgrade to Pro — Claude Team has a 5-seat minimum ($30/seat) which is currently underutilized here.`;
    potentialSaving = Math.max(0, spend - (20 * seats));
  }
}
```
All formulas subtract the optimized individual license cost from the declared monthly spend to extract the clean, actual leak amount.
