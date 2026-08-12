const express = require('express');
const Transaction = require('../models/Transaction');
const protect = require('../middleware/authMiddleware');

const router = express.Router();
router.use(protect);

router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.userId }).lean();
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const totals = (items) => items.reduce((sum, item) => sum + (item.type === 'income' ? item.amount : -item.amount), 0);
    const thisMonth = transactions.filter((item) => new Date(item.date) >= startOfMonth);
    const lastMonth = transactions.filter((item) => new Date(item.date) >= startOfLastMonth && new Date(item.date) < startOfMonth);
    const currentExpenses = thisMonth.filter((item) => item.type === 'expense');
    const income = thisMonth.filter((item) => item.type === 'income').reduce((sum, item) => sum + item.amount, 0);
    const expenses = currentExpenses.reduce((sum, item) => sum + item.amount, 0);
    const lastExpenses = lastMonth.filter((item) => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0);
    const categories = Object.entries(currentExpenses.reduce((map, item) => ({ ...map, [item.category]: (map[item.category] || 0) + item.amount }), {})).map(([name, value]) => ({ name, value }));
    const biggestExpenseCategory = categories.sort((a, b) => b.value - a.value)[0] || null;
    const months = {};
    transactions.forEach((item) => {
      const key = new Date(item.date).toISOString().slice(0, 7);
      if (!months[key]) months[key] = { income: 0, expenses: 0 };
      months[key][item.type === 'income' ? 'income' : 'expenses'] += item.amount;
    });
    const monthlyTrends = Array.from({ length: 6 }, (_, index) => {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1);
      const key = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}`;
      const values = months[key] || { income: 0, expenses: 0 };
      return {
        month: monthDate.toLocaleString('en-US', { month: 'short' }),
        income: values.income,
        expenses: values.expenses,
        net: values.income - values.expenses,
      };
    });
    const nets = Object.values(months).map(({ income: monthlyIncome, expenses: monthlyExpenses }) => monthlyIncome - monthlyExpenses);
    res.json({ balance: totals(transactions), monthlyIncome: income, monthlyExpenses: expenses, monthlyNet: income - expenses, spendingByCategory: categories, biggestExpenseCategory, monthOverMonthExpenseChange: lastExpenses ? ((expenses - lastExpenses) / lastExpenses) * 100 : null, averageMonthlyNet: nets.length ? nets.reduce((sum, value) => sum + value, 0) / nets.length : 0, monthlyTrends });
  } catch (error) {
    res.status(500).json({ message: 'Unable to load insights.' });
  }
});

module.exports = router;
