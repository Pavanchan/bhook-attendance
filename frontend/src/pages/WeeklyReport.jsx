import { useEffect, useState } from 'react';
import api from '../api';

export default function WeeklyReport() {
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await api.get('/reports/weekly');
      setReportData(res.data.report);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Weekly Attendance Report</h2>
        <button
          onClick={() => window.print()}
          className="bg-slate-800 text-white px-4 py-2 rounded-lg"
        >
          Print
        </button>
      </div>
      <table className="w-full border-collapse text-sm md:text-base">
        <thead>
          <tr className="bg-slate-200">
            <th className="border p-2">#</th>
            <th className="border p-2">Employee</th>
            <th className="border p-2">Days Present</th>
            <th className="border p-2">Days Late</th>
            <th className="border p-2">Warning</th>
            <th className="border p-2">Penalty</th>
          </tr>
        </thead>
        <tbody>
          {reportData.map((row, idx) => (
            <tr key={row.employeeId} className="text-center">
              <td className="border p-2">{idx + 1}</td>
              <td className="border p-2">{row.employeeName}</td>
              <td className="border p-2">{row.totalPresent}</td>
              <td className="border p-2">{row.totalLate}</td>
              <td className="border p-2">
                {row.warning ? '⚠️ Warning' : '-'}
              </td>
              <td className="border p-2">
                {row.penalty ? '❌ Penalty' : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
