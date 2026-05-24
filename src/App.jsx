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
import CustomCursor from './components/CustomCursor';

function App() {
  const [view, setView] = useState('landing');
  const goForm = () => { setView('form'); window.scrollTo({ top: 0 }); };
  const goHome = () => { setView('landing'); window.scrollTo({ top: 0 }); };

  return (
    <div className="min-h-screen bg-background text-primary relative" style={{ overflowX: 'hidden' }}>
      <CustomCursor />

      <div className="relative" style={{ zIndex: 2 }}>
        <Navbar onNavigate={v => v === 'landing' ? goHome() : goForm()} />
        <main>
          {view === 'landing' ? (
            <>
              <HeroSection onStartAudit={goForm} />
              <ToolsGrid />
              <StepsRow />
              <AuditPreview />
              <CTASection onStartAudit={goForm} />
              <SocialProof />
            </>
          ) : (
            <AuditForm onBack={goHome} />
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
