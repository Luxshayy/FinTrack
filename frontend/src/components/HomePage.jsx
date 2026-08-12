const features = [
  ['Clear cash flow', 'See your balance, monthly income, expenses, and net position at a glance.'],
  ['Private by default', 'Your account and ledger are protected, so every financial view is yours alone.'],
  ['Useful trends', 'Turn everyday entries into category breakdowns and six-month cash-flow trends.'],
];

export default function HomePage({ onGetStarted, onLogin }) {
  return <main className="home-page">
    <nav className="home-nav" aria-label="Main navigation">
      <button className="wordmark" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Fin<span>Track</span></button>
      <div className="nav-actions"><button className="text-button" onClick={onLogin}>Log in</button><button className="nav-cta" onClick={onGetStarted}>Get started</button></div>
    </nav>

    <section className="hero">
      <div className="hero-copy"><p className="eyebrow">PERSONAL FINANCE, MADE CLEAR</p><h1>Know where your money is going.</h1><p className="hero-text">FinTrack gives you one calm, private place to record cash flow, understand spending, and make confident financial decisions.</p><div className="hero-actions"><button className="hero-button" onClick={onGetStarted}>Create your free account <span>→</span></button><button className="secondary-button" onClick={onLogin}>I already have an account</button></div><p className="hero-note">No credit card required · Your data stays private</p></div>
      <div className="hero-visual" aria-label="FinTrack dashboard preview"><div className="preview-top"><span className="preview-brand">FinTrack</span><span className="preview-period">AUG 2026</span></div><div className="preview-balance"><span>AVAILABLE BALANCE</span><strong>$8,420.00</strong><small>↑ 12.4% from last month</small></div><div className="preview-stat-grid"><div><span>INCOME</span><strong>$5,940</strong></div><div><span>EXPENSES</span><strong>$2,710</strong></div></div><div className="preview-chart"><div className="chart-labels"><span>Monthly cash flow</span><span>+$3,230</span></div><div className="bars"><i /><i /><i /><i /><i /><i /></div><div className="bar-labels"><span>MAR</span><span>APR</span><span>MAY</span><span>JUN</span><span>JUL</span><span>AUG</span></div></div></div>
    </section>

    <section className="home-features"><div className="feature-intro"><p className="eyebrow">A BETTER DAILY MONEY HABIT</p><h2>Small entries. A much clearer picture.</h2></div><div className="feature-grid">{features.map(([title, description], index) => <article className="feature-card" key={title}><span className="feature-number">0{index + 1}</span><h3>{title}</h3><p>{description}</p></article>)}</div></section>

    <section className="home-cta"><div><p className="eyebrow">START TODAY</p><h2>Make every rupee easier to understand.</h2></div><button className="hero-button" onClick={onGetStarted}>Start tracking <span>→</span></button></section>
    <footer className="home-footer"><span>© 2026 FinTrack</span><span>Simple, private cash-flow tracking.</span></footer>
  </main>;
}
