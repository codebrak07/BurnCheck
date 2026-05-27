import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
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
export function runAuditBenchmark({ teamSize, useCase, tools }) {
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

function LandingPage() {
  const navigate = useNavigate();
  return (
    <>
      <HeroSection onStartAudit={() => { navigate('/audit'); window.scrollTo({ top: 0 }); }} />
      <ToolsGrid />
      <SpendBenchmarks />
      <StepsRow />
      <AuditPreview />
      <CTASection onStartAudit={() => { navigate('/audit'); window.scrollTo({ top: 0 }); }} />
      <SocialProof />
    </>
  );
}

function FormPage({ onAuditSubmit }) {
  const navigate = useNavigate();
  return (
    <AuditForm onBack={() => { navigate('/'); window.scrollTo({ top: 0 }); }} onSubmit={onAuditSubmit} />
  );
}

// Encode audit inputs into a URL-safe Base64 string
export function encodeAuditId(formData) {
  try {
    const compact = {
      t: formData.teamSize,
      u: formData.useCase,
      s: formData.tools.map(t => [t.toolName, t.plan, t.spend, t.seats])
    };
    const jsonStr = JSON.stringify(compact);
    const b64 = btoa(unescape(encodeURIComponent(jsonStr)));
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch (e) {
    console.error("Failed to encode audit ID:", e);
    // Fallback to random ID if encoding fails
    return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  }
}

// Decode URL-safe Base64 string back into audit inputs
export function decodeAuditId(id) {
  try {
    let b64 = id.replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    const jsonStr = decodeURIComponent(escape(atob(b64)));
    const compact = JSON.parse(jsonStr);
    
    // Check if the format is correct
    if (typeof compact.t !== 'number' || !Array.isArray(compact.s)) {
      return null;
    }
    
    return {
      teamSize: compact.t,
      useCase: compact.u || 'Mixed',
      tools: compact.s.map(t => ({
        toolName: t[0],
        plan: t[1],
        spend: parseFloat(t[2]) || 0,
        seats: parseInt(t[3]) || 1
      }))
    };
  } catch (e) {
    // Return null silently for invalid Base64 string (like legacy IDs)
    return null;
  }
}

function ResultsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [auditData, setAuditData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`audit_${id}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        
        // Strip email and company name details for the public shared URL version
        const stripped = {
          ...parsed,
          email: undefined,
          company: undefined,
          role: undefined
        };
        setAuditData(stripped);
        setError(false);
      } else {
        // Fallback: try decoding the ID as a Base64-encoded audit input
        const decoded = decodeAuditId(id);
        if (decoded) {
          const results = runAuditBenchmark(decoded);
          setAuditData(results);
          setError(false);
        } else {
          setError(true);
        }
      }
    } catch (e) {
      console.error("Failed to load audit:", e);
      setError(true);
    }
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 anim-fade-in">
        <h2 className="text-2xl font-black mb-4">Audit Report Not Found</h2>
        <p className="text-sm mb-6 max-w-sm" style={{ color: 'var(--color-secondary)' }}>
          We couldn't locate the requested AI spend audit report. It might have expired or been deleted.
        </p>
        <button
          onClick={() => { navigate('/'); window.scrollTo({ top: 0 }); }}
          className="btn-primary px-6 py-3 text-sm"
          data-cursor-hover
        >
          Go to Landing Page
        </button>
      </div>
    );
  }

  return (
    <AuditResults
      auditData={auditData}
      onBack={() => { navigate('/audit'); window.scrollTo({ top: 0 }); }}
    />
  );
}

function AppContent() {
  const navigate = useNavigate();

  const handleAuditSubmit = (formData) => {
    const results = runAuditBenchmark(formData);
    
    // Generate a unique ID (Base64 encoded audit inputs)
    const id = encodeAuditId(formData);
    
    // Store in localStorage
    localStorage.setItem(`audit_${id}`, JSON.stringify(results));
    
    // Navigate to the unique results page
    navigate(`/audit/${id}`);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="min-h-screen bg-background text-primary relative" style={{ overflowX: 'hidden' }}>
      <CustomCursor />

      <div className="relative" style={{ zIndex: 2 }}>
        <Navbar onNavigate={v => v === 'landing' ? navigate('/') : navigate('/audit')} />
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/audit" element={<FormPage onAuditSubmit={handleAuditSubmit} />} />
            <Route path="/audit/:id" element={<ResultsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
