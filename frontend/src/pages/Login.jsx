import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { username, password });
      const token = res.data.token;

      localStorage.setItem('token', token);
      if (typeof onLogin === 'function') {
        onLogin(token);
      }

      navigate('/', { replace: true });
    } catch (err) {
      console.error(err);
      setMsg(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-liner-to-br from-slate-950 via-slate-900 to-slate-950 px-4">
      {/* floating blurred circle for depth */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl absolute -top-10 -left-16 animate-subtle-float" />
        <div className="w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl absolute bottom-0 right-0 animate-subtle-float" />
      </div>

      <div className="w-full max-w-md bg-slate-900/80 border border-slate-700 rounded-3xl shadow-2xl p-8 backdrop-blur animate-fade-in-up">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/60 flex items-center justify-center mb-3">
            <span className="text-2xl">🍽️</span>
          </div>
          <h1 className="text-3xl font-bold text-center text-white tracking-tight">
            Bhook Attendance
          </h1>
          <p className="text-center text-slate-300 mt-1 text-xs">
            Secure panel for manager & supervisor attendance control
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-slate-200 text-sm mb-1">
              Username
            </label>
            <input
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
              placeholder="Enter username"
              value={username}
              autoComplete="username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-slate-200 text-sm mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
              placeholder="Enter password"
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {msg && (
            <p className="text-sm text-red-400 bg-red-900/40 border border-red-700 rounded-xl px-3 py-2">
              {msg}
            </p>
          )}

          <button
            type="submit"
            className="mt-2 w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold shadow-lg shadow-emerald-500/30 transition transform hover:-translate-y-ypx disabled:opacity-60 disabled:hover:translate-y-0"
            disabled={loading || !username || !password}
          >
            {loading ? 'Signing in…' : 'Login'}
          </button>

          <p className="text-[11px] text-center text-slate-400 mt-2">
            Use the admin username & password from your backend <code>.env</code>
          </p>
        </form>
      </div>
    </div>
  );
}
