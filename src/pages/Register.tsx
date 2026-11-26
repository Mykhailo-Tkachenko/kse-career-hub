import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthForm from '../components/AuthForm'
import { supabase } from '../lib/supabase'
import { KSE_DOMAIN, signInWithGoogle } from '../lib/auth'

export default function Register() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/'
  const [needsConfirmation, setNeedsConfirmation] = useState(false)

  async function handleRegister(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    // Якщо в проєкті ввімкнено підтвердження email, сесії ще немає
    if (data.session) navigate(from, { replace: true })
    else setNeedsConfirmation(true)
  }

  if (needsConfirmation) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="bg-emerald-50 text-emerald-700 rounded-lg px-4 py-6 font-medium">
          ✓ Майже готово! Перевірте пошту та підтвердіть email.
        </div>
        <Link to="/login" state={location.state} className="mt-6 inline-block text-indigo-600 font-medium">
          Перейти до входу →
        </Link>
      </div>
    )
  }

  return (
    <AuthForm
      title="Реєстрація"
      subtitle="Створіть акаунт, щоб відгукуватися на вакансії."
      submitLabel="Зареєструватися"
      onSubmit={handleRegister}
      onGoogle={() => signInWithGoogle(from)}
      hint={`Студенти реєструються з поштою @${KSE_DOMAIN}. Компанії — за запрошенням.`}
      footer={{ text: 'Вже маєте акаунт?', linkLabel: 'Увійти', to: '/login' }}
    />
  )
}
