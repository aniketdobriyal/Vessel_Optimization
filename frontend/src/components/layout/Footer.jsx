import React from 'react';

export default function Footer() {
  return (
    <footer className="py-3 mt-auto border-top border-maritime text-center" style={{ background: 'var(--bg-maritime-sidebar)', fontSize: '11px', color: 'var(--text-muted)' }}>
      <div className="container">
        <span>© 2026 Vessel Optimization Platform. Powered by Oceanic AI Engines. All Maritime operations secured.</span>
      </div>
    </footer>
  );
}
