import { formatMoney } from '../utils/currency';

export default function Header({ name, balance, currency, onLogout }) {
  return <header className="page-header"><div><p className="eyebrow">CASH FLOW LEDGER</p><h1>FinTrack</h1><p className="subtitle">Welcome, {name}. Your figures are private and saved.</p></div><div className="header-actions"><span className="currency-badge">{currency}</span><button className="text-button" onClick={onLogout} aria-label="Log out of FinTrack">Log out</button><strong className={`balance-value ${balance < 0 ? 'negative' : ''}`}>{formatMoney(balance, currency)}</strong></div></header>;
}
