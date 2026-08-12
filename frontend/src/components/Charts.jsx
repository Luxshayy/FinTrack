import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatMoney } from '../utils/currency';

function ChartPanel({ title, children, className = '' }) { return <section className={`panel chart-panel ${className}`}><h2>{title}</h2><ResponsiveContainer width="100%" height={260}>{children}</ResponsiveContainer></section>; }

export default function Charts({ insights, currency }) {
  const money = (value) => formatMoney(value, currency);
  return <><section className="chart-grid"><ChartPanel title="Spending by category"><PieChart><Pie data={insights?.spendingByCategory || []} dataKey="value" nameKey="name" outerRadius={75} fill="#2f6b4f" label /><Tooltip formatter={money} /></PieChart></ChartPanel><ChartPanel title="Income vs expense"><BarChart data={[{ name: 'This month', Income: insights?.monthlyIncome || 0, Expenses: insights?.monthlyExpenses || 0 }]}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip formatter={money} /><Legend /><Bar dataKey="Income" fill="#2f6b4f" /><Bar dataKey="Expenses" fill="#a6432f" /></BarChart></ChartPanel></section><ChartPanel title="Monthly financial trends" className="trend-chart"><LineChart data={insights?.monthlyTrends || []}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip formatter={money} /><Legend /><Line type="monotone" dataKey="income" name="Income" stroke="#2f6b4f" strokeWidth={2} /><Line type="monotone" dataKey="expenses" name="Expenses" stroke="#a6432f" strokeWidth={2} /><Line type="monotone" dataKey="net" name="Net cash flow" stroke="#1e2a22" strokeWidth={2} /></LineChart></ChartPanel></>;
}
