const express = require('express');
const Transaction = require('../models/Transaction');
const protect = require('../middleware/authMiddleware');

const router = express.Router();
router.use(protect);

const fields = ['type', 'amount', 'category', 'description', 'date'];

const validateTransaction = ({ type, amount, category, date }) => {
  if (!['income', 'expense'].includes(type)) return 'Choose income or expense.';
  if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) return 'Amount must be greater than zero.';
  if (!category?.trim()) return 'Category is required.';
  if (!date || Number.isNaN(new Date(date).getTime())) return 'A valid date is required.';
  return null;
};

router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.userId }).sort({ date: 1, createdAt: 1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Unable to load transactions.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const validationError = validateTransaction(req.body);
    if (validationError) return res.status(400).json({ message: validationError });
    const transaction = await Transaction.create({ ...req.body, user: req.userId, description: req.body.description?.trim() || '' });
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Unable to save transaction.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, user: req.userId });
    if (!transaction) return res.status(404).json({ message: 'Transaction not found.' });
    res.json(transaction);
  } catch (error) {
    res.status(404).json({ message: 'Transaction not found.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const update = Object.fromEntries(fields.filter((field) => field in req.body).map((field) => [field, req.body[field]]));
    const existing = await Transaction.findOne({ _id: req.params.id, user: req.userId });
    if (!existing) return res.status(404).json({ message: 'Transaction not found.' });
    const validationError = validateTransaction({ ...existing.toObject(), ...update });
    if (validationError) return res.status(400).json({ message: validationError });
    if ('description' in update) update.description = update.description?.trim() || '';
    const transaction = await Transaction.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    res.json(transaction);
  } catch (error) {
    res.status(400).json({ message: 'Unable to update transaction.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!transaction) return res.status(404).json({ message: 'Transaction not found.' });
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ message: 'Transaction not found.' });
  }
});

module.exports = router;
