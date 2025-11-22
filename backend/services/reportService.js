const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');

async function getWeeklyReport(startDate, endDate) {
  // Fetch all employees
  const employees = await Employee.find();

  // Fetch attendance between the range
  const attendanceRecords = await Attendance.find({
    date: { $gte: startDate, $lte: endDate },
  });

  // Build weekly report per employee
  const report = employees.map((emp) => {
    const empRecords = attendanceRecords.filter(
      (rec) => rec.employee.toString() === emp._id.toString()
    );

    const totalDays = empRecords.length;
    const lateDays = empRecords.filter((rec) => rec.minutesLate > 5).length;

    return {
      employeeId: emp._id,
      employeeName: emp.fullName,
      totalDays,
      lateDays,
      weeklyAdvance: emp.weeklyAdvance || 0,
    };
  });

  return report;
}

module.exports = { getWeeklyReport };
