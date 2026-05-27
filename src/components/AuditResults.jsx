import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, Share2, Mail, Sparkles, TrendingDown, ExternalLink, X, Check, ArrowRight } from 'lucide-react';
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

// Ripple animation component for tactile hover feedback
function CardRipple({ x, y, onDone }) {
  return (
    <span
      className="step-ripple"
      style={{ left: x, top: y }}
      onAnimationEnd={onDone}
    />
  );
}

// Interactive result card component with 3D tilt & spotlight tracking
function ResultCard({ tool }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState([]);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: dy * -6, y: dx * 6 });
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const handleMouseEnter = useCallback(() => setHovered(true), []);
  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    setTilt({ x: 0, y: 0 });
  }, []);

  const handleClick = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples(prev => [...prev, { id, x, y }]);
    setClicked(true);
    setTimeout(() => setClicked(false), 200);
  }, []);

  const removeRipple = useCallback((id) => {
    setRipples(prev => prev.filter(r => r.id !== id));
  }, []);

  // Map status string to index.css badge classes
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'overspending':
        return <span className="tag-cut">Overspending</span>;
      case 'switch':
      case 'consider switch':
        return <span className="tag-switch">Consider Switch</span>;
      case 'optimal':
      default:
        return <span className="tag-ok">Optimal</span>;
    }
  };

  return (
    <div
      ref={cardRef}
      className="p-6 rounded-lg relative overflow-hidden flex flex-col justify-between"
      data-cursor-hover
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        background: 'var(--color-surface-2)',
        border: '1px solid var(--color-border)',
        minHeight: '180px',
        transform: hovered
          ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(${clicked ? '2px' : '-4px'}) scale(${clicked ? 0.99 : 1.01})`
          : 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)',
        transition: hovered
          ? 'transform .06s linear, border-color .3s ease'
          : 'transform .4s cubic-bezier(.22,1,.36,1), border-color .3s ease',
        '--mouse-x': `${mousePos.x}px`,
        '--mouse-y': `${mousePos.y}px`
      }}
    >
      {/* Background glow following cursor */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(280px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(0, 217, 146, 0.04), transparent 65%)`,
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.4s ease'
        }}
      />

      {/* Ripple particles */}
      {ripples.map(r => (
        <CardRipple key={r.id} x={r.x} y={r.y} onDone={() => removeRipple(r.id)} />
      ))}

      {/* Top Section: Tool Info & Status Badge */}
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <h4 className="text-lg font-black text-primary font-mono" style={{ letterSpacing: '-0.02em' }}>
            {tool.name}
          </h4>
          <p className="text-xs mt-1" style={{ color: 'var(--color-subtle)', fontFamily: 'JetBrains Mono, monospace' }}>
            {tool.currentPlan} plan · ${tool.currentSpend}/mo
          </p>
        </div>
        {getStatusBadge(tool.status)}
      </div>

      {/* Recommendation description */}
      <p className="text-sm leading-relaxed mb-5 relative z-10 flex-grow" style={{ color: 'var(--color-secondary)' }}>
        {tool.recommendation}
      </p>

      {/* Footer: Savings Badge */}
      <div className="flex justify-between items-center relative z-10 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.03)' }}>
        <span className="text-[10px] uppercase tracking-wider font-semibold font-mono" style={{ color: 'var(--color-subtle)' }}>
          POTENTIAL SAVING
        </span>
        {tool.potentialSaving > 0 ? (
          <span className="tag-save font-mono">
            Save ${tool.potentialSaving}/mo
          </span>
        ) : (
          <span className="tag-ok font-mono">$0/mo</span>
        )}
      </div>
    </div>
  );
}

export default function AuditResults({ auditData, onBack }) {
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [aiSummary, setAiSummary] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Fallback to sample data if no auditData is passed
  const data = useMemo(() => auditData || {
    totalMonthlySavings: 340,
    totalAnnualSavings: 4080,
    tools: [
      {
        name: "Cursor",
        currentPlan: "Business",
        currentSpend: 80,
        recommendation: "Downgrade to Pro — Business plan collaboration features unused for teams under 5.",
        potentialSaving: 40,
        status: "overspending"
      },
      {
        name: "Claude",
        currentPlan: "Team",
        currentSpend: 150,
        recommendation: "Downgrade to Pro — Claude Team has a 5-seat minimum which is currently underutilized.",
        potentialSaving: 50,
        status: "consider switch"
      },
      {
        name: "ChatGPT",
        currentPlan: "Enterprise",
        currentSpend: 250,
        recommendation: "Optimal structure. Check seats monthly for inactive developers to keep clean.",
        potentialSaving: 0,
        status: "optimal"
      }
    ],
    summary: "Your stack is spending $340/month more than necessary. The biggest leak is Cursor Business for a small team, combined with underutilized Claude Team seats. Switching these to developer Pro plans maintains performance while recapturing immediately."
  }, [auditData]);
    totalMonthlySavings: 340,
    totalAnnualSavings: 4080,
    tools: [
      {
        name: "Cursor",
        currentPlan: "Business",
        currentSpend: 80,
        recommendation: "Downgrade to Pro — Business plan collaboration features unused for teams under 5.",
        potentialSaving: 40,
        status: "overspending"
      },
      {
        name: "Claude",
        currentPlan: "Team",
        currentSpend: 150,
        recommendation: "Downgrade to Pro — Claude Team has a 5-seat minimum which is currently underutilized.",
        potentialSaving: 50,
        status: "consider switch"
      },
      {
        name: "ChatGPT",
        currentPlan: "Enterprise",
        currentSpend: 250,
        recommendation: "Optimal structure. Check seats monthly for inactive developers to keep clean.",
        potentialSaving: 0,
        status: "optimal"
      }
    ],
    summary: "Your stack is spending $340/month more than necessary. The biggest leak is Cursor Business for a small team, combined with underutilized Claude Team seats. Switching these to developer Pro plans maintains performance while recapturing immediately."
  };

  const { id } = useParams();

  const handleShare = useCallback(async () => {
    try {
      const shareUrl = id 
        ? `${window.location.origin}/audit/${id}`
        : `${window.location.origin}/audit`;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = shareUrl;
        textarea.style.position = "fixed"; // Keep outside view layout
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  }, [id]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // Fetch dynamic AI analysis from Groq
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey || !data || !data.tools) {
      setAiSummary(data?.summary || '');
      return;
    }

    const fetchAiSummary = async () => {
      setAiLoading(true);
      try {
        const toolsListStr = data.tools.map(t => 
          `- ${t.name} (${t.currentPlan} plan, $${t.currentSpend}/mo, potential saving: $${t.potentialSaving}/mo, Status: ${t.status}, Recommendation: ${t.recommendation})`
        ).join('\n');

        const userContent = `Team Size: ${data.teamSize || 'N/A'}
Primary Use Case: ${data.useCase || 'N/A'}
Tools in stack:
${toolsListStr}
Total Monthly Savings: $${data.totalMonthlySavings}/mo
Total Annual Savings: $${data.totalAnnualSavings}/yr`;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              {
                role: 'system',
                content: 'You are BurnCheck, a professional AI spend optimization assistant. Write a highly actionable, concise 2-3 sentence summary of the audit findings. Focus on the biggest savings opportunity and tell the user exactly how to restructure their subscription plans. Do not use any introductory phrases or greetings, just output the analysis itself. Keep it under 80 words.'
              },
              {
                role: 'user',
                content: userContent
              }
            ],
            temperature: 0.5,
            max_tokens: 150
          })
        });

        if (!response.ok) {
          throw new Error(`Groq API error: ${response.status}`);
        }

        const resData = await response.json();
        const content = resData?.choices?.[0]?.message?.content;
        if (content) {
          setAiSummary(content.trim().replace(/^"/, '').replace(/"$/, ''));
        } else {
          setAiSummary(data.summary);
        }
      } catch (err) {
        console.error('Failed to fetch Groq AI summary:', err);
        setAiSummary(data.summary);
      } finally {
        setAiLoading(false);
      }
    };

    fetchAiSummary();
  }, [data]);

  useEffect(() => {
    if (!data) return;

    const titleText = `BurnCheck Audit — Save $${data.totalMonthlySavings}/month on AI tools`;
    document.title = titleText;

    const setMetaTag = (property, content) => {
      let element = document.querySelector(`meta[property="${property}"]`) || 
                    document.querySelector(`meta[name="${property}"]`);
      if (!element) {
        element = document.createElement('meta');
        if (property.startsWith('og:')) {
          element.setAttribute('property', property);
        } else {
          element.setAttribute('name', property);
        }
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    setMetaTag('og:title', titleText);
    
    // First two sentences of the AI summary description
    const currentSummary = aiSummary || data.summary;
    const sentences = currentSummary.split('.').slice(0, 2).join('.') + '.';
    setMetaTag('og:description', sentences);
    setMetaTag('og:image', `${window.location.origin}/BurnCheck.png`);
    
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', titleText);
    setMetaTag('twitter:description', sentences);
    setMetaTag('twitter:image', `${window.location.origin}/BurnCheck.png`);

    return () => {
      document.title = "BurnCheck | Free AI Spend Auditor for Startups";
    };
  }, [data, aiSummary]);

  const submitLeadCapture = useCallback(async (leadData) => {
    // Store in Firebase Firestore (non-fatal — failure does not block email/mock flow)
    try {
      console.log("Saving lead to Firebase Firestore...");
      await addDoc(collection(db, "leads"), {
        name: leadData.name || '',
        email: leadData.email,
        company: leadData.company || '',
        role: leadData.role || '',
        savedAt: new Date()
      });
      console.log("Lead successfully stored in Firestore!");
    } catch (firestoreErr) {
      // Log but do NOT rethrow — Firestore security rules may block unauthenticated
      // writes in production. The confirmation email / mock flow should still succeed.
      console.warn("Firestore write skipped (non-fatal):", firestoreErr?.code || firestoreErr?.message);
    }

    const resendKey = import.meta.env.VITE_RESEND_API_KEY;
    const postmarkToken = import.meta.env.VITE_POSTMARK_SERVER_TOKEN;

    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; background-color: #101010; color: #f2f2f2; border: 1px solid #3d3a39; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #00d992; font-size: 24px; font-weight: 900; margin: 0; letter-spacing: -0.03em;">BurnCheck</h2>
          <p style="color: #8b949e; font-size: 12px; text-transform: uppercase; tracking-wider; margin: 4px 0 0 0;">AI Spend Audit Report</p>
        </div>

        <p style="font-size: 15px; line-height: 1.6; color: #bdbdbd;">Hello ${leadData.role ? `${leadData.role} at ` : ''}${leadData.company || 'there'},</p>
        <p style="font-size: 15px; line-height: 1.6; color: #bdbdbd;">Here is your completed AI Spend Audit report. We analyzed your active license quantities and plan tiers to outline immediate optimization vectors.</p>
        
        <div style="background: #1a1a1a; border: 1px solid #3d3a39; border-radius: 6px; padding: 20px; margin: 24px 0; text-align: center;">
          <p style="margin: 0; text-transform: uppercase; font-size: 10px; letter-spacing: 0.15em; color: #8b949e; font-weight: 600;">Monthly Savings Opportunity</p>
          <p style="margin: 6px 0 0 0; font-size: 36px; font-weight: 900; color: #00d992; font-family: monospace;">$${data.totalMonthlySavings.toLocaleString()}/mo</p>
          
          <div style="height: 1px; background: #3d3a39; margin: 16px 0;"></div>
          
          <p style="margin: 0; text-transform: uppercase; font-size: 10px; letter-spacing: 0.15em; color: #8b949e; font-weight: 600;">Annual Savings Acceleration</p>
          <p style="margin: 6px 0 0 0; font-size: 24px; font-weight: 700; color: #ffffff; font-family: monospace;">$${data.totalAnnualSavings.toLocaleString()}/yr</p>
        </div>

        <h3 style="color: #ffffff; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; margin: 24px 0 12px 0; border-bottom: 1px dashed #3d3a39; padding-bottom: 6px;">AI Optimization Summary</h3>
        <p style="font-size: 14px; line-height: 1.6; font-style: italic; color: #bdbdbd; border-left: 3px solid #00d992; padding-left: 14px; margin: 12px 0;">
          "${aiSummary || data.summary}"
        </p>

        <h3 style="color: #ffffff; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; margin: 28px 0 12px 0; border-bottom: 1px dashed #3d3a39; padding-bottom: 6px;">Stack Breakdown & Actions</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 12px;">
          <tbody>
            ${data.tools.map(t => `
              <tr style="border-bottom: 1px solid #1a1a1a;">
                <td style="padding: 12px 0; vertical-align: top;">
                  <strong style="color: #ffffff; font-size: 14px;">${t.name}</strong>
                  <div style="font-size: 11px; color: #8b949e; margin-top: 2px;">${t.currentPlan} plan &bull; $${t.currentSpend}/mo</div>
                  <p style="font-size: 13px; color: #bdbdbd; margin: 6px 0 0 0; line-height: 1.5;">${t.recommendation}</p>
                </td>
                <td style="padding: 12px 0; text-align: right; vertical-align: top; width: 110px;">
                  ${t.potentialSaving > 0 ? `
                    <span style="background: rgba(0, 217, 146, 0.1); border: 1px solid rgba(0, 217, 146, 0.2); color: #00d992; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; font-family: monospace; display: inline-block;">
                      Save $${t.potentialSaving}/mo
                    </span>
                  ` : `
                    <span style="background: #1a1a1a; border: 1px solid #3d3a39; color: #8b949e; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-family: monospace; display: inline-block;">
                      Optimal
                    </span>
                  `}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="margin-top: 36px; padding-top: 20px; border-top: 1px solid #3d3a39; text-align: center; font-size: 11px; color: #8b949e; line-height: 1.5;">
          This audit is powered by <strong>BurnCheck</strong>.<br />
          Maximize builder velocity. Minimize licensing bloat.
        </div>
      </div>
    `;

    if (resendKey) {
      console.log("Resend API Key found. Attempting to send confirmation email...");
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendKey}`
        },
        body: JSON.stringify({
          from: 'BurnCheck <onboarding@resend.dev>',
          to: [leadData.email],
          subject: `Your BurnCheck Audit: Save $${data.totalMonthlySavings}/mo`,
          html: emailHtml
        })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        const errMsg = errJson?.message || `HTTP ${response.status}`;
        throw new Error(`Resend API error: ${errMsg}`);
      }
      return await response.json();
    }

    if (postmarkToken) {
      console.log("Postmark Server Token found. Attempting to send confirmation email...");
      const response = await fetch('https://api.postmarkapp.com/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Postmark-Server-Token': postmarkToken
        },
        body: JSON.stringify({
          From: 'onboarding@resend.dev', // Default sender or verified sender
          To: leadData.email,
          Subject: `Your BurnCheck Audit: Save $${data.totalMonthlySavings}/mo`,
          HtmlBody: emailHtml,
          MessageStream: 'outbound'
        })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        const errMsg = errJson?.Message || `HTTP ${response.status}`;
        throw new Error(`Postmark API error: ${errMsg}`);
      }
      return await response.json();
    }

    // Default Fallback Mock resolve
    console.log("No email service credentials configured. Mocking success for lead capture:", leadData);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, mocked: true });
      }, 1000);
    });
  }, [data, aiSummary]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Honeypot check
    if (honeypot.trim() !== '') {
      // Silently reject: act as if it succeeded but do not call the service
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setLoading(false);
      setSuccess(true);
      handlePrint();
      setTimeout(() => {
        setShowModal(false);
        setSuccess(false);
        setEmail('');
        setName('');
        setCompany('');
        setRole('');
        setHoneypot('');
      }, 2000);
      return;
    }

    try {
      setLoading(true);
      await submitLeadCapture({ name, email, company, role });
      setLoading(false);
      setSuccess(true);
      
      // Auto-trigger print/download on success
      handlePrint();

      // Close modal after 2 seconds
      setTimeout(() => {
        setShowModal(false);
        setSuccess(false);
        setEmail('');
        setName('');
        setCompany('');
        setRole('');
      }, 2000);
    } catch (err) {
      setLoading(false);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <section className="min-h-screen pt-28 pb-24 px-6 md:px-8 max-w-4xl mx-auto anim-fade-in relative">
      {/* Back button */}
      <button
        onClick={onBack}
        data-cursor-hover
        className="btn-back text-sm mb-8"
        style={{ color: 'var(--color-secondary)' }}
      >
        <ArrowLeft className="w-4 h-4 btn-icon" />
        Back to Auditor
      </button>

      {/* Header Eyebrow */}
      <div className="mb-2">
        <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] accent-text">
          Audit Complete
        </span>
      </div>

      {/* Hero Numbers Block */}
      <div
        className="p-8 rounded-xl mb-10 flex flex-col md:flex-row items-center justify-between gap-6"
        style={{
          background: 'radial-gradient(110% 80% at 50% -10%, rgba(0, 217, 146, 0.05) 0%, transparent 80%)',
          border: '1px solid var(--color-border)'
        }}
      >
        <div>
          <h2 className="text-xs uppercase tracking-widest mb-2 font-semibold font-mono" style={{ color: 'var(--color-subtle)' }}>
            RECLAIMABLE MONTHLY SPEND
          </h2>
          <div className="flex items-baseline gap-2">
            <span
              className="text-4xl md:text-6xl font-black accent-text leading-none font-mono"
              style={{ letterSpacing: '-0.04em' }}
            >
              ${data.totalMonthlySavings.toLocaleString()}
            </span>
            <span className="text-lg" style={{ color: 'var(--color-secondary)' }}>/mo</span>
          </div>
        </div>

        <div className="h-px w-full md:h-12 md:w-px bg-border" style={{ background: 'var(--color-border)' }} />

        <div>
          <h2 className="text-xs uppercase tracking-widest mb-2 font-semibold font-mono" style={{ color: 'var(--color-subtle)' }}>
            ANNUAL SAVINGS ACCELERATION
          </h2>
          <div className="flex items-baseline gap-2">
            <span
              className="text-3xl md:text-5xl font-bold leading-none font-mono"
              style={{ color: 'var(--color-primary)', letterSpacing: '-0.03em' }}
            >
              ${data.totalAnnualSavings.toLocaleString()}
            </span>
            <span className="text-sm" style={{ color: 'var(--color-subtle)' }}>/yr</span>
          </div>
        </div>
      </div>

      {/* Per-Tool Breakdown */}
      <div className="mb-10">
        <h3 className="text-sm font-semibold uppercase tracking-[0.15em] mb-5 font-mono" style={{ color: 'var(--color-subtle)' }}>
          Tool Optimization Audit ({data.tools?.length || 0})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.tools?.map((tool, idx) => (
            <ResultCard key={idx} tool={tool} />
          ))}
        </div>
      </div>

      {/* Conditionally Render Callouts */}
      {data.totalMonthlySavings >= 500 && (
        <div
          className="callout-card p-6 md:p-8 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6"
          style={{ border: '1px solid rgba(0, 217, 146, 0.2)' }}
        >
          <div className="space-y-2">
            <span className="text-[10px] font-mono tracking-widest uppercase text-accent font-semibold">Credex Partner Program</span>
            <h4 className="text-lg font-black text-primary" style={{ letterSpacing: '-0.02em' }}>
              Want to capture even more savings?
            </h4>
            <p className="text-sm leading-relaxed max-w-lg" style={{ color: 'var(--color-secondary)' }}>
              Credex sells discounted, secure API & platform credits for OpenAI, Anthropic, and Google Cloud, helping startups slash direct API costs by up to 25%.
            </p>
          </div>
          <a
            href="https://credex.ai"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-hover
            className="btn-primary px-5 py-3 text-sm shrink-0 self-start md:self-center"
          >
            Book a consultation
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      )}

      {data.totalMonthlySavings < 100 && (
        <div
          className="p-6 rounded-lg mb-10"
          style={{
            background: 'var(--color-surface-2)',
            border: '1px solid var(--color-border)'
          }}
        >
          <h4 className="text-base font-bold text-primary mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            You're spending well!
          </h4>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-secondary)' }}>
            Your AI stack is highly optimized! We didn't find any major savings. Keep this page bookmarked and check back when your team size or AI subscription stack changes.
          </p>
        </div>
      )}

      {/* AI Summary Block */}
      <div
        className="p-6 rounded-lg mb-10 relative overflow-hidden"
        style={{
          background: 'var(--color-background)',
          border: '1px solid var(--color-border)'
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 accent-text animate-pulse" />
          <span className="text-[10px] font-mono tracking-widest uppercase font-semibold" style={{ color: 'var(--color-subtle)' }}>
            BurnCheck AI Generated Summary
          </span>
        </div>
        {aiLoading ? (
          <div className="flex flex-col gap-2 py-1">
            <div className="h-4 bg-white/5 rounded w-full animate-pulse" />
            <div className="h-4 bg-white/5 rounded w-5/6 animate-pulse" />
            <div className="h-4 bg-white/5 rounded w-2/3 animate-pulse" />
          </div>
        ) : (
          <p className="text-sm leading-relaxed italic animate-fade-in" style={{ color: 'var(--color-secondary)' }}>
            "{aiSummary || data.summary}"
          </p>
        )}
      </div>

      {/* Action Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6" style={{ borderTop: '1px dashed rgba(79, 93, 117, 0.4)' }}>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            onClick={handleShare}
            data-cursor-hover
            className="btn-ghost w-full sm:w-auto px-5 py-3 text-sm flex justify-center items-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-accent" />
                Link Copied!
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                Share Audit
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            data-cursor-hover
            className="btn-ghost w-full sm:w-auto px-5 py-3 text-sm flex justify-center items-center gap-2"
          >
            Download PDF
          </button>
        </div>

        <button
          onClick={() => setShowModal(true)}
          data-cursor-hover
          className="btn-primary w-full sm:w-auto px-6 py-3.5 text-sm flex justify-center items-center gap-2"
        >
          Get full report
          <ArrowRight className="w-4 h-4 btn-icon" />
        </button>
      </div>

      {/* Email Capture Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md anim-fade-in"
            onClick={() => { if (!loading && !success) setShowModal(false); }}
          />

          {/* Modal Container */}
          <div
            className="relative w-full max-w-md p-6 rounded-xl border z-10 anim-fade-in"
            style={{
              background: 'var(--color-background)',
              borderColor: 'var(--color-border)',
              boxShadow: '0 32px 64px rgba(0, 0, 0, 0.8)'
            }}
          >
            {/* Close Button */}
            {!loading && !success && (
              <button
                onClick={() => setShowModal(false)}
                data-cursor-hover
                className="absolute top-4 right-4 text-subtle hover:text-white p-1 rounded-md"
                style={{ transition: 'color 0.2s ease' }}
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {success ? (
              <div className="py-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6 accent-text" />
                </div>
                <h4 className="text-xl font-bold text-primary">Report Sent!</h4>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-secondary)' }}>
                  Report sent! Check your inbox.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 accent-text animate-pulse" />
                  <h4 className="text-lg font-bold text-primary">Get your full audit report</h4>
                </div>
                <p className="text-sm leading-relaxed font-medium" style={{ color: 'var(--color-secondary)' }}>
                  We'll email you the breakdown + savings plan.
                </p>

                {error && (
                  <p className="text-xs font-semibold text-red-500 font-mono" style={{ color: '#ef4444' }}>
                    {error}
                  </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                  {/* Honeypot field */}
                  <div style={{ display: 'none' }} aria-hidden="true">
                    <input
                      type="text"
                      name="website"
                      value={honeypot}
                      onChange={e => setHoneypot(e.target.value)}
                      tabIndex="-1"
                      autoComplete="off"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold mb-2 uppercase tracking-widest" style={{ color: 'var(--color-subtle)' }}>
                      Full Name (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="input-field"
                      disabled={loading}
                      data-cursor-hover
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold mb-2 uppercase tracking-widest" style={{ color: 'var(--color-subtle)' }}>
                      Work Email <span className="text-red-500" style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="developer@company.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="input-field"
                      disabled={loading}
                      data-cursor-hover
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold mb-2 uppercase tracking-widest" style={{ color: 'var(--color-subtle)' }}>
                      Company Name (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Acme Inc."
                      value={company}
                      onChange={e => setCompany(e.target.value)}
                      className="input-field"
                      disabled={loading}
                      data-cursor-hover
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold mb-2 uppercase tracking-widest" style={{ color: 'var(--color-subtle)' }}>
                      Your Role (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Engineering Lead"
                      value={role}
                      onChange={e => setRole(e.target.value)}
                      className="input-field"
                      disabled={loading}
                      data-cursor-hover
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    data-cursor-hover
                    className="btn-primary w-full py-3.5 text-sm flex justify-center items-center gap-2"
                  >
                    {loading ? 'Sending...' : 'Send my report →'}
                  </button>
                </form>

                <p className="text-[10px] leading-relaxed text-center" style={{ color: 'var(--color-subtle)' }}>
                  No spam. Credex may reach out if your savings opportunity is significant.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
