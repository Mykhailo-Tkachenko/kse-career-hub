import { Link, useLocation } from 'react-router-dom'
import { useRole } from '../context/RoleContext'

export default function Navbar() {
  const { role, setRole } = useRole()
  const location = useLocation()

  const linkClass = (path: string) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      location.pathname === path
        ? 'bg-indigo-600 text-white'
        : 'text-slate-600 hover:bg-slate-100'
    }`

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-semibold text-slate-900">
          <span className="text-xl">🎓</span>
          KSE Career Hub
        </Link>

        <nav className="flex items-center gap-1">
          <Link to="/" className={linkClass('/')}>
            Головна
          </Link>
          {role === 'student' ? (
            <Link to="/listings" className={linkClass('/listings')}>
              Вакансії
            </Link>
          ) : (
            <>
              <Link to="/company" className={linkClass('/company')}>
                Мої вакансії
              </Link>
              <Link to="/company/new" className={linkClass('/company/new')}>
                + Нова вакансія
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2 text-sm bg-slate-100 rounded-full p-1">
          <button
            onClick={() => setRole('student')}
            className={`px-3 py-1.5 rounded-full transition-colors ${
              role === 'student' ? 'bg-white shadow text-indigo-700 font-medium' : 'text-slate-500'
            }`}
          >
            Я студент
          </button>
          <button
            onClick={() => setRole('company')}
            className={`px-3 py-1.5 rounded-full transition-colors ${
              role === 'company' ? 'bg-white shadow text-indigo-700 font-medium' : 'text-slate-500'
            }`}
          >
            Я компанія
          </button>
        </div>
      </div>
    </header>
  )
}
