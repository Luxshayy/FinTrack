import { formatMoney } from '../utils/currency';

export default function Insights({ insights, currency }) {
  return <section className="panel"><h2>Automated insights</h2><div className="insights"><p>Current monthly net: <strong>{formatMoney(insights?.monthlyNet, currency)}</strong>.</p>{insights?.biggestExpenseCategory ? <p>Largest expense category: <strong>{insights.biggestExpenseCategory.name} ({formatMoney(insights.biggestExpenseCategory.value, currency)})</strong>.</p> : <p>No expenses logged this month.</p>}<p>{insights?.monthOverMonthExpenseChange === null ? 'Add spending from a previous month to compare trends.' : `Spending is ${Math.abs(insights.monthOverMonthExpenseChange).toFixed(1)}% ${insights.monthOverMonthExpenseChange >= 0 ? 'higher' : 'lower'} than last month.`}</p><p>Average monthly net: <strong>{formatMoney(insights?.averageMonthlyNet, currency)}</strong>.</p></div></section>;
}
