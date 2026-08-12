import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import SummaryCards from './components/SummaryCards';
import TransactionForm from './components/TransactionForm';
import Insights from './components/Insights';
import Charts from './components/Charts';
import TransactionTable from './components/TransactionTable';
import HomePage from './components/HomePage';
import { api } from './services/api';
import { CURRENCIES } from './utils/currency';
import './App.css';

const EXPENSE_CATS = ['Rent', 'Supplies', 'Payroll', 'Marketing', 'Utilities', 'Software', 'Other'];
const initialForm = () => ({ date: new Date().toISOString().slice(0, 10), description: '', type: 'expense', category: EXPENSE_CATS[0], amount: '' });

function AuthPage({ mode, onSuccess, switchMode }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', currency: 'INR' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const isRegister = mode === 'register';

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      onSuccess(await api(`/auth/${isRegister ? 'register' : 'login'}`, { method: 'POST', body: JSON.stringify(form) }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return <main className="auth-shell"><form className="auth-card" onSubmit={submit}>
    <button type="button" className="back-home" onClick={() => switchMode('home')}>← Back to home</button><p className="eyebrow">CASH FLOW LEDGER</p><h1>FinTrack</h1><p className="subtitle">{isRegister ? 'Create your private financial workspace.' : 'Welcome back to your financial workspace.'}</p>
    {isRegister && <label className="field">Name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>}
    <label className="field">Email<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
    <label className="field">Password<input required minLength="6" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></label>
    {isRegister && <label className="field">Preferred currency<select value={form.currency} onChange={(event) => setForm({ ...form, currency: event.target.value })}>{CURRENCIES.map((currency) => <option key={currency.code} value={currency.code}>{currency.label}</option>)}</select></label>}
    {error && <p className="form-error">{error}</p>}<button className="primary-button" disabled={loading}>{loading ? 'Please wait…' : isRegister ? 'Create account' : 'Log in'}</button>
    <p className="auth-switch">{isRegister ? 'Already have an account?' : 'New to FinTrack?'} <button type="button" className="text-button" onClick={() => switchMode(isRegister ? 'login' : 'register')}>{isRegister ? 'Log in' : 'Create one'}</button></p>
  </form></main>;
}

function Dashboard({ session, onLogout }) {
  const [transactions, setTransactions] = useState([]);
  const [insights, setInsights] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const request = (path, options = {}) => api(path, { ...options, token: session.token });

  const load = async () => {
    setLoading(true);
    try {
      const [items, data] = await Promise.all([request('/transactions'), request('/insights')]);
      setTransactions(items);
      setInsights(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [items, data] = await Promise.all([api('/transactions', { token: session.token }), api('/insights', { token: session.token })]);
        if (active) { setTransactions(items); setInsights(data); }
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [session.token]);

  const withBalances = useMemo(() => [...transactions]
    .sort((a, b) => new Date(a.date) - new Date(b.date) || new Date(a.createdAt) - new Date(b.createdAt))
    .reduce((entries, item) => {
      const previousBalance = entries.at(-1)?.balance || 0;
      entries.push({ ...item, balance: previousBalance + (item.type === 'income' ? item.amount : -item.amount) });
      return entries;
    }, []), [transactions]);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    const amount = Number(form.amount);
    if (!form.description.trim() || amount <= 0) return setError('Enter a description and an amount greater than zero.');
    setSaving(true);
    try {
      const body = JSON.stringify({ ...form, amount });
      if (editingId) await request(`/transactions/${editingId}`, { method: 'PUT', body });
      else await request('/transactions', { method: 'POST', body });
      setForm(initialForm());
      setEditingId(null);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    try { await request(`/transactions/${id}`, { method: 'DELETE' }); await load(); }
    catch (err) { setError(err.message); }
  };

  const edit = (item) => {
    setEditingId(item._id);
    setForm({ date: item.date.slice(0, 10), description: item.description, type: item.type, category: item.category, amount: item.amount });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <main className="app"><p className="loading">Loading your ledger…</p></main>;
  return <main className="app">
    <Header name={session.user.name} balance={insights?.balance} currency={session.user.currency || 'USD'} onLogout={onLogout} />
    {error && <p className="form-error page-error">{error}</p>}
    <SummaryCards insights={insights} currency={session.user.currency || 'USD'} />
    <section className="top-grid"><TransactionForm form={form} editing={Boolean(editingId)} saving={saving} onChange={(field, value) => setForm({ ...form, [field]: value })} onTypeChange={(type) => setForm({ ...form, type, category: type === 'income' ? 'Sales' : EXPENSE_CATS[0] })} onSubmit={submit} onCancel={() => { setEditingId(null); setForm(initialForm()); }} /><Insights insights={insights} currency={session.user.currency || 'USD'} /></section>
    <Charts insights={insights} currency={session.user.currency || 'USD'} />
    <TransactionTable transactions={withBalances} currency={session.user.currency || 'USD'} onEdit={edit} onDelete={remove} />
  </main>;
}

export default function App() {
  const [session, setSession] = useState(() => { try { return JSON.parse(localStorage.getItem('fintrack-session')); } catch { return null; } });
  const [mode, setMode] = useState(() => {
    const path = window.location.pathname;
    return path === '/register' ? 'register' : path === '/login' ? 'login' : 'home';
  });
  const navigate = (nextMode) => { window.history.pushState({}, '', `/${nextMode}`); setMode(nextMode); };
  const login = (data) => { localStorage.setItem('fintrack-session', JSON.stringify(data)); window.history.pushState({}, '', '/dashboard'); setSession(data); };
  const logout = () => { localStorage.removeItem('fintrack-session'); window.history.pushState({}, '', '/login'); setSession(null); setMode('login'); };
  if (session) return <Dashboard session={session} onLogout={logout} />;
  if (mode === 'home') return <HomePage onGetStarted={() => navigate('register')} onLogin={() => navigate('login')} />;
  return <AuthPage mode={mode} onSuccess={login} switchMode={navigate} />;
}
