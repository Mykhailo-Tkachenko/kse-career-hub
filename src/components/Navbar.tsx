import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useRole } from '../context/RoleContext'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { role, setRole } = useRole()
  const { user, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  // Роль у навбарі відповідає розділу, в якому знаходиться користувач
  useEffect(() => {
    if (location.pathname.startsWith('/company')) setRole('company')
    else if (location.pathname.startsWith('/listings')) setRole('student')
  }, [location.pathname, setRole])

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
            onClick={() => navigate('/listings')}
            className={`px-3 py-1.5 rounded-full transition-colors ${
              role === 'student' ? 'bg-white shadow text-indigo-700 font-medium' : 'text-slate-500'
            }`}
          >
            Я студент
          </button>
          <button
            onClick={() => navigate('/company')}
            className={`px-3 py-1.5 rounded-full transition-colors ${
              role === 'company' ? 'bg-white shadow text-indigo-700 font-medium' : 'text-slate-500'
            }`}
          >
            Я компанія
          </button>
        </div>

        <div className="flex items-center gap-2 text-sm">
          {user ? (
            <>
              <span className="text-slate-500 hidden md:inline">{user.email}</span>
              <button
                onClick={signOut}
                className="px-3 py-2 rounded-md font-medium text-slate-600 hover:bg-slate-100"
              >
                Вийти
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={linkClass('/login')}>
                Увійти
              </Link>
              <Link to="/register" className={linkClass('/register')}>
                Реєстрація
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
