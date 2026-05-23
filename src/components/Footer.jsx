import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-border py-12 bg-[#080808]">
      <div className="max-w-7xl mx-auto px-6 text-center text-sm text-secondary flex flex-wrap justify-center items-center gap-2 md:gap-3">
        <span className="font-semibold text-primary">BurnCheck</span>
        <span className="text-border hidden md:inline">•</span>
        <span>Free forever</span>
        <span className="text-border hidden md:inline">•</span>
        <span>Built by Aalekh</span>
        <span className="text-border hidden md:inline">•</span>
        <span className="italic">Not affiliated with any AI vendor</span>
      </div>
    </footer>
  );
}
