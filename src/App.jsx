import React from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import StepsRow from './components/StepsRow';
import SocialProof from './components/SocialProof';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-background text-primary selection:bg-accent selection:text-black">
      <Navbar />
      <main>
        <HeroSection />
        <StepsRow />
        <SocialProof />
      </main>
      <Footer />
    </div>
  );
}

export default App;
