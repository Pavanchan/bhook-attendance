const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');
const auth = require('../config/authMiddleware');

// POST /api/attendance/mark
router.post('/mark', auth, async (req, res) => {
  try {
    const { employeeId } = req.body;
    if (!employeeId) {
      return res.status(400).json({ message: 'employeeId is required' });
    }

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const now = new Date();

    // ⏰ 1) Check if attendance already marked today
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const existing = await Attendance.findOne({
      employee: employee._id,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (existing) {
      return res.status(400).json({
        message: 'Attendance already marked for today for this employee.',
      });
    }

    // ⏰ 2) Determine expected check-in time for this employee
    const checkInStr = employee.expectedCheckIn || '09:00'; // "HH:MM"
    const [h, m] = checkInStr.split(':').map((n) => parseInt(n, 10) || 0);

    const workStart = new Date(now);
    workStart.setHours(h, m, 0, 0);

    const diffMs = now - workStart;
    const diffMinutes = Math.max(0, Math.round(diffMs / 60000));
    const isLate = diffMinutes > 5; // more than 5 min = late

    const record = await Attendance.create({
      employee: employee._id,
      date: now,
      status: isLate ? 'LATE' : 'ON_TIME',
      minutesLate: isLate ? diffMinutes : 0,
    });

    res.json({
      message: `Attendance marked as ${record.status}`,
      employeeName: employee.fullName,
      minutesLate: record.minutesLate,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error marking attendance' });
  }
});

module.exports = router;
