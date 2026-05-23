import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import StepsRow from './components/StepsRow';
import SocialProof from './components/SocialProof';
import Footer from './components/Footer';
import AuditForm from './components/AuditForm';

function App() {
  const [view, setView] = useState('landing');

  return (
    <div className="min-h-screen bg-background text-primary selection:bg-accent selection:text-black">
      <Navbar onNavigate={setView} />
      <main>
        {view === 'landing' ? (
          <>
            <HeroSection onStartAudit={() => setView('form')} />
            <StepsRow />
            <SocialProof />
          </>
        ) : (
          <AuditForm onBack={() => setView('landing')} />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
