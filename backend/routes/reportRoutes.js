const express = require('express');
const router = express.Router();
const auth = require('../config/authMiddleware');
const { getWeeklyReport } = require('../services/reportService');

router.get('/weekly', auth, async (req, res) => {
  try {
    const { start, end } = req.query;

    const startDate = start ? new Date(start) : getDefaultWeekStart();
    const endDate = end ? new Date(end) : getDefaultWeekEnd();

    const report = await getWeeklyReport(startDate, endDate);
    res.json({ startDate, endDate, report });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error generating report' });
  }
});

function getDefaultWeekStart() {
  const now = new Date();
  const day = now.getDay(); // 0 = Sun
  const diff = (day + 6) % 7; // Monday as start
  const monday = new Date(now);
  monday.setDate(now.getDate() - diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function getDefaultWeekEnd() {
  const start = getDefaultWeekStart();
  const sunday = new Date(start);
  sunday.setDate(start.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return sunday;
}

module.exports = router;
