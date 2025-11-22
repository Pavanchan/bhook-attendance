import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  const tiles = [
    {
      title: 'Scan Attendance',
      desc: 'Mark staff attendance using face recognition.',
      onClick: () => navigate('/scan'),
      accent: 'from-emerald-500/10 to-emerald-500/0',
    },
    {
      title: 'Add Employee',
      desc: 'Register new staff with photo, shift and salary.',
      onClick: () => navigate('/add-employee'),
      accent: 'from-cyan-500/10 to-cyan-500/0',
    },
    {
      title: 'Weekly Report',
      desc: 'See late days and performance for the week.',
      onClick: () => navigate('/weekly-report'),
      accent: 'from-orange-500/10 to-orange-500/0',
    },
    {
      title: 'Employee Dashboard',
      desc: 'View employees, advances and overview.',
      onClick: () => navigate('/employees'),
      accent: 'from-violet-500/10 to-violet-500/0',
    },
  ];

  return (
    <div className="min-h-screen bg-app-pattern flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-4xl animate-fade-in-up">
        <div className="mb-6 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-300 mb-2">
            Bhook Attendance Panel
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-50 tracking-tight">
            What would you like to do today?
          </h1>
          <p className="text-sm text-slate-300 mt-2 max-w-xl mx-auto">
            Use this panel to quickly manage staff attendance, employee details,
            and weekly advances without any confusion.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {tiles.map((tile, idx) => (
            <button
              key={tile.title}
              onClick={tile.onClick}
              className={`
                group relative rounded-2xl px-5 py-5 text-left
                flex flex-col justify-between overflow-hidden
                 transition-shadow duration-300
                hover:-translate-y-1 hover:shadow-2xl
                card-light
                animate-fade-in-up
              `}
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              {/* subtle gradient accent */}
              <div
                className={`pointer-events-none absolute inset-0 bg-linear-to-br ${tile.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />

              <div className="relative">
                <h2 className="text-lg font-semibold text-slate-900 mb-1">
                  {tile.title}
                </h2>
                <p className="text-sm text-slate-600">{tile.desc}</p>
              </div>

              <div className="relative mt-3 flex items-center justify-between text-xs text-slate-500">
                <span className="group-hover:text-emerald-600 transition">
                  Open panel
                </span>
                <span className="transform translate-x-0 group-hover:translate-x-1 transition">
                  →
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
