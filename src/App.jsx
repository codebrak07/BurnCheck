import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import StepsRow from './components/StepsRow';
import SocialProof from './components/SocialProof';
import Footer from './components/Footer';
import AuditForm from './components/AuditForm';
import CustomCursor from './components/CustomCursor';
import CursorWidget from './components/CursorWidget';

function App() {
  const [view, setView] = useState('landing');
  const [cursorColor, setCursorColor] = useState(
    () => localStorage.getItem('bc_cursorColor') || 'green'
  );
  const [cursorStyle, setCursorStyle] = useState(
    () => localStorage.getItem('bc_cursorStyle') || 'dual'
  );

  useEffect(() => { localStorage.setItem('bc_cursorColor', cursorColor); }, [cursorColor]);
  useEffect(() => { localStorage.setItem('bc_cursorStyle', cursorStyle); }, [cursorStyle]);

  return (
    <div className="min-h-screen bg-background text-primary" style={{ overflowX: 'hidden' }}>
      {/* Custom cursor (global) */}
      <CustomCursor color={cursorColor} style={cursorStyle} />

      {/* Persistent chrome */}
      <Navbar onNavigate={setView} />

      {/* Views */}
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

      {/* Floating cursor widget (global) */}
      <CursorWidget
        cursorColor={cursorColor}
        setCursorColor={setCursorColor}
        cursorStyle={cursorStyle}
        setCursorStyle={setCursorStyle}
      />
    </div>
  );
}

export default App;
