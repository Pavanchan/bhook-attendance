import { useEffect, useState } from 'react';
import api from '../api';

export default function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/employees');
        setEmployees(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this employee?')) return;
    try {
      await api.delete(`/employees/${id}`);
      setEmployees((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      console.error(err);
      alert('Error deleting');
    }
  };

  const handleAddAdvance = async (id) => {
    const amountStr = prompt('Advance amount (Rs):');
    if (!amountStr) return;
    const amount = Number(amountStr);
    if (Number.isNaN(amount)) return alert('Invalid amount');

    try {
      const res = await api.post(`/employees/${id}/advance`, { amount });
      setEmployees((prev) =>
        prev.map((e) => (e._id === id ? res.data.employee : e))
      );
    } catch (err) {
      console.error(err);
      alert('Error updating advance');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-app-pattern flex items-center justify-center">
        <p className="text-slate-200 text-sm">Loading employees…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app-pattern p-4">
      <div className="max-w-5xl mx-auto animate-fade-in-up">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-50">
            Employee Dashboard
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Quick view of staff, their shifts and weekly advances.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {employees.map((emp, idx) => (
            <div
              key={emp._id}
              className="rounded-2xl p-4 flex flex-col hover:-translate-y-1 transition-transform duration-300 animate-fade-in-up card-light"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <div className="flex items-center gap-3">
                {emp.photo ? (
                  <img
                    src={emp.photo}
                    alt={emp.fullName}
                    className="w-14 h-14 rounded-full object-cover border border-slate-200"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-xs">
                    No photo
                  </div>
                )}
                <div>
                  <p className="font-semibold text-slate-900">
                    {emp.fullName}
                  </p>
                  <p className="text-xs text-gray-500">
                    DOB:{' '}
                    {emp.dateOfBirth
                      ? new Date(emp.dateOfBirth).toLocaleDateString()
                      : '-'}
                  </p>
                  <p className="text-xs text-gray-500">
                    Shift: {emp.expectedCheckIn || '09:00'}
                  </p>
                </div>
              </div>

              <div className="mt-3 text-sm">
                <p>
                  Base salary:{' '}
                  <span className="font-semibold">
                    {emp.baseSalary ? `₹${emp.baseSalary}` : 'N/A'}
                  </span>
                </p>
                <p>
                  Weekly advance:{' '}
                  <span className="font-semibold text-orange-600">
                    ₹{emp.weeklyAdvance || 0}
                  </span>
                </p>
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleAddAdvance(emp._id)}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white text-xs py-1.5 rounded-lg transition"
                >
                  Add Advance
                </button>
                <button
                  onClick={() => handleDelete(emp._id)}
                  className="flex-1 bg-red-500 hover:bg-red-400 text-white text-xs py-1.5 rounded-lg transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {employees.length === 0 && (
            <p className="text-sm text-slate-200">
              No employees found. Add a staff member from the home screen.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
