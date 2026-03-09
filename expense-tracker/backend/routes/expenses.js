const express = require('express');
const auth = require('../middleware/auth');
const Expense = require('../models/Expense');

const router = express.Router();

// Get all expenses for user
router.get('/', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.userId })
      .sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching expenses' });
  }
});

// Add new expense
router.post('/', auth, async (req, res) => {
  try {
    const { item, cost, date } = req.body;

    const expense = new Expense({
      item,
      cost,
      date: date || new Date(),
      userId: req.userId
    });

    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ error: 'Server error while adding expense' });
  }
});

// Delete expense
router.delete('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error while deleting expense' });
  }
});

module.exports = router;