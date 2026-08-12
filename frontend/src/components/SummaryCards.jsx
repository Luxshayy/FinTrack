import { formatMoney } from '../utils/currency';

function Summary({ label, value, kind, currency }) { return <div className="summary-card"><span>{label}</span><strong className={kind}>{formatMoney(value, currency)}</strong></div>; }

export default function SummaryCards({ insights, currency }) {
  return <section className="summary-grid"><Summary label="Income, month to date" value={insights?.monthlyIncome} kind="income-text" currency={currency} /><Summary label="Expenses, month to date" value={insights?.monthlyExpenses} kind="expense-text" currency={currency} /><Summary label="Net this month" value={insights?.monthlyNet} kind={insights?.monthlyNet >= 0 ? 'income-text' : 'expense-text'} currency={currency} /></section>;
}
