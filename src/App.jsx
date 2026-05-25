import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ToolsGrid from './components/ToolsGrid';
import StepsRow from './components/StepsRow';
import AuditPreview from './components/AuditPreview';
import CTASection from './components/CTASection';
import SocialProof from './components/SocialProof';
import Footer from './components/Footer';
import AuditForm from './components/AuditForm';
import AuditResults from './components/AuditResults';
import SpendBenchmarks from './components/SpendBenchmarks';
import CustomCursor from './components/CustomCursor';

// Benchmarks configured tools to calculate potential savings and write advice
function runAuditBenchmark({ teamSize, useCase, tools }) {
  let totalMonthlySavings = 0;
  const processedTools = tools.map(t => {
    const seats = parseInt(t.seats) || 1;
    const spend = parseFloat(t.spend) || 0;
    const name = t.toolName;
    const plan = t.plan;
    let recommendation = "";
    let potentialSaving = 0;
    let status = "optimal";

    if (name === 'Cursor') {
      if ((plan === 'Business' || plan === 'Enterprise') && seats <= 5) {
        recommendation = `Downgrade to Pro — Business plan collaboration features (like admin policies) are unused for small teams under 5.`;
        potentialSaving = Math.max(0, spend - (20 * seats));
        status = "overspending";
      } else if (plan === 'Enterprise') {
        recommendation = `Assess developer active usage. Consider downgrading inactive licenses to Pro to cut license overhead.`;
        potentialSaving = Math.round(spend * 0.25);
        status = "consider switch";
      } else {
        recommendation = `Optimal seat allocation. Review inactive developer workspace accesses quarterly to prevent drift.`;
        potentialSaving = 0;
        status = "optimal";
      }
    } else if (name === 'GitHub Copilot') {
      if ((plan === 'Business' || plan === 'Enterprise') && seats <= 5) {
        recommendation = `Downgrade to Individual — Business plan administration features are redundant for micro-teams.`;
        potentialSaving = Math.max(0, spend - (10 * seats));
        status = "overspending";
      } else if (plan === 'Enterprise') {
        recommendation = `Review seat assignment logs. Standardize on Copilot Business or switch inactive engineers to Copilot Individual.`;
        potentialSaving = Math.round(spend * 0.2);
        status = "consider switch";
      } else {
        recommendation = `Highly optimized setup. Audit developer logs monthly to de-allocate seats for departed contractors.`;
        potentialSaving = 0;
        status = "optimal";
      }
    } else if (name === 'Claude') {
      if (plan === 'Team' && seats < 5) {
        recommendation = `Downgrade to Pro — Claude Team has a 5-seat minimum ($30/seat) which is currently underutilized here.`;
        potentialSaving = Math.max(0, spend - (20 * seats));
        status = "overspending";
      } else if (plan === 'Max' || plan === 'Enterprise') {
        recommendation = `Review Claude usage patterns. Downsize high-tier plans to Pro for developers who do not hit daily limit quotas.`;
        potentialSaving = Math.round(spend * 0.2);
        status = "consider switch";
      } else {
        recommendation = `Optimal seat allocation. Monitor API limits to check if high-volume developers should move to API Direct.`;
        potentialSaving = 0;
        status = "optimal";
      }
    } else if (name === 'ChatGPT') {
      if (plan === 'Team' && seats < 3) {
        recommendation = `Downgrade to Plus — Team workspace plans require seat minimums. Plus ($20/seat) is more cost-efficient for micro-teams.`;
        potentialSaving = Math.max(0, spend - (20 * seats));
        status = "overspending";
      } else if (plan === 'Enterprise') {
        recommendation = `Audit enterprise contract utilization. Consolidate seat groups or swap underutilized accounts to Team tier.`;
        potentialSaving = Math.round(spend * 0.25);
        status = "consider switch";
      } else {
        recommendation = `Optimal structure. Monitor seat usage monthly to prevent paying for unused builder profiles.`;
        potentialSaving = 0;
        status = "optimal";
      }
    } else if (name === 'OpenAI API Direct' || name === 'Anthropic API Direct') {
      recommendation = `Configure budget thresholds, monthly spending limits, and automated warning notifications in the developer dashboard to avoid runaways.`;
      potentialSaving = Math.round(spend * 0.15);
      status = "consider switch";
    } else if (name === 'Windsurf') {
      if (plan === 'Teams' && seats < 3) {
        recommendation = `Downgrade to Pro — Team collaboration features are redundant for micro-teams. Pro is $15/mo.`;
        potentialSaving = Math.max(0, spend - (15 * seats));
        status = "overspending";
      } else {
        recommendation = `Optimal setup. Monitor developer editor adoption rates to reclaim licenses for inactive staff.`;
        potentialSaving = 0;
        status = "optimal";
      }
    } else {
      if (spend > 50) {
        recommendation = `Review plan usage metrics. Downgrade inactive accounts or consolidate users under single group plans.`;
        potentialSaving = Math.round(spend * 0.2);
        status = "consider switch";
      } else {
        recommendation = `Optimal setup. Your current subscription plan matches the team usage profile perfectly.`;
        potentialSaving = 0;
        status = "optimal";
      }
    }

    totalMonthlySavings += potentialSaving;
    return {
      name,
      currentPlan: plan,
      currentSpend: spend,
      recommendation,
      potentialSaving,
      status
    };
  });

  const totalAnnualSavings = totalMonthlySavings * 12;

  let summary = "";
  if (totalMonthlySavings > 0) {
    const highestSavingTool = [...processedTools].sort((a, b) => b.potentialSaving - a.potentialSaving)[0];
    summary = `Your stack is spending $${totalMonthlySavings.toLocaleString()}/month more than necessary. The biggest optimization comes from refactoring your ${highestSavingTool.name} setup (saving $${highestSavingTool.potentialSaving.toLocaleString()}/mo). Downgrading underutilized enterprise tiers to team or individual developer licenses maintains developer output while recapturing spend.`;
  } else {
    summary = "Congratulations! Your AI stack is fully optimized. Every active tool matches your team scale and usage patterns, and you are not paying for unused premium features or inactive seats.";
  }

  return {
    totalMonthlySavings,
    totalAnnualSavings,
    tools: processedTools,
    summary
  };
}

function App() {
  const [view, setView] = useState('landing');
  const [auditData, setAuditData] = useState(null);

  const goForm = () => { setView('form'); window.scrollTo({ top: 0 }); };
  const goHome = () => { setView('landing'); window.scrollTo({ top: 0 }); };

  const handleFormSubmit = (formData) => {
    const results = runAuditBenchmark(formData);
    setAuditData(results);
    setView('results');
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="min-h-screen bg-background text-primary relative" style={{ overflowX: 'hidden' }}>
      <CustomCursor />

      <div className="relative" style={{ zIndex: 2 }}>
        <Navbar onNavigate={v => v === 'landing' ? goHome() : goForm()} />
        <main>
          {view === 'landing' && (
            <>
              <HeroSection onStartAudit={goForm} />
              <ToolsGrid />
              <SpendBenchmarks />
              <StepsRow />
              <AuditPreview />
              <CTASection onStartAudit={goForm} />
              <SocialProof />
            </>
          )}
          {view === 'form' && (
            <AuditForm onBack={goHome} onSubmit={handleFormSubmit} />
          )}
          {view === 'results' && (
            <AuditResults auditData={auditData} onBack={goForm} />
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
