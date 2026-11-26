import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

interface AuthFormProps {
  title: string
  subtitle: string
  submitLabel: string
  onSubmit: (email: string, password: string) => Promise<void>
  onGoogle: () => Promise<void>
  hint?: string
  initialError?: string | null
  footer: { text: string; linkLabel: string; to: string }
}

const inputClass =
  'w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400'

export default function AuthForm({
  title,
  subtitle,
  submitLabel,
  onSubmit,
  onGoogle,
  hint,
  initialError = null,
  footer,
}: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(initialError)
  const [submitting, setSubmitting] = useState(false)
  // Передаємо state далі, щоб після входу/реєстрації повернутись туди, звідки прийшли
  const location = useLocation()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await onSubmit(email, password)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleGoogle() {
    setError(null)
    try {
      await onGoogle()
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">{title}</h1>
      <p className="text-slate-500 mb-6">{subtitle}</p>

      <button
        type="button"
        onClick={handleGoogle}
        className="w-full flex items-center justify-center gap-2 border border-slate-300 bg-white py-3 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-colors"
      >
        <span className="font-bold text-indigo-600">G</span>
        Продовжити з Google
      </button>

      <div className="my-6 flex items-center gap-3 text-xs text-slate-400">
        <span className="h-px flex-1 bg-slate-200" />
        або
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@kse.org.ua"
            className={inputClass}
          />
          {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Пароль</label>
          <input
            type="password"
            required
            minLength={6}
            autoComplete={submitLabel === 'Увійти' ? 'current-password' : 'new-password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </div>

        {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-60"
        >
          {submitting ? 'Зачекайте...' : submitLabel}
        </button>
      </form>

      <p className="mt-6 text-sm text-slate-500 text-center">
        {footer.text}{' '}
        <Link to={footer.to} state={location.state} className="text-indigo-600 font-medium">
          {footer.linkLabel}
        </Link>
      </p>
    </div>
  )
}
