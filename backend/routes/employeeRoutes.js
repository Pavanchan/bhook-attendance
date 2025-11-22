// backend/routes/employeeRoutes.js
const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const auth = require('../config/authMiddleware');

// CREATE employee
router.post('/', auth, async (req, res) => {
  try {
    const {
      fullName,
      dateOfBirth,
      faceDescriptor,
      expectedCheckIn,
      photo,
      baseSalary,
    } = req.body;

    if (!fullName || !dateOfBirth || !faceDescriptor || !Array.isArray(faceDescriptor)) {
      return res
        .status(400)
        .json({ message: 'Missing name, DOB or face descriptor' });
    }

    const employee = await Employee.create({
      fullName,
      dateOfBirth: new Date(dateOfBirth),
      faceDescriptor,
      expectedCheckIn: expectedCheckIn || '09:00',
      photo: photo || null,
      baseSalary: baseSalary || 0,
    });

    res.status(201).json({
      message: 'Employee created successfully',
      employee,
    });
  } catch (err) {
    console.error('Error creating employee:', err);
    res.status(500).json({ message: 'Error creating employee' });
  }
});

// READ all employees (dashboard, scan)
router.get('/', auth, async (req, res) => {
  try {
    const list = await Employee.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).json({ message: 'Error fetching employees' });
  }
});

// UPDATE employee (for future edit screen)
router.put('/:id', auth, async (req, res) => {
  try {
    const { fullName, dateOfBirth, expectedCheckIn, baseSalary, photo } = req.body;

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      {
        ...(fullName && { fullName }),
        ...(dateOfBirth && { dateOfBirth: new Date(dateOfBirth) }),
        ...(expectedCheckIn && { expectedCheckIn }),
        ...(typeof baseSalary === 'number' && { baseSalary }),
        ...(photo && { photo }),
      },
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json({ message: 'Employee updated', employee });
  } catch (err) {
    console.error('Error updating employee:', err);
    res.status(500).json({ message: 'Error updating employee' });
  }
});

// DELETE employee
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Employee.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted' });
  } catch (err) {
    console.error('Error deleting employee:', err);
    res.status(500).json({ message: 'Error deleting employee' });
  }
});

// ADD advance for this week
router.post('/:id/advance', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    const num = Number(amount) || 0;

    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    employee.weeklyAdvance = (employee.weeklyAdvance || 0) + num;
    await employee.save();

    res.json({
      message: 'Advance updated',
      weeklyAdvance: employee.weeklyAdvance,
      employee,
    });
  } catch (err) {
    console.error('Error updating advance:', err);
    res.status(500).json({ message: 'Error updating advance' });
  }
});

module.exports = router;
