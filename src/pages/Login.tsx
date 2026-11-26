import { useEffect } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import AuthForm from '../components/AuthForm'
import { supabase } from '../lib/supabase'
import { isInternalPath, readOAuthError, signInWithGoogle } from '../lib/auth'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const { user } = useAuth()
  // next — після повернення з Google, state.from — після редиректу з RequireAuth
  const next = searchParams.get('next')
  const from =
    (next && isInternalPath(next) ? next : null) ??
    (location.state as { from?: string } | null)?.from ??
    '/'

  // Повернулись з Google із сесією — йдемо далі
  useEffect(() => {
    if (user) navigate(from, { replace: true })
  }, [user, from, navigate])

  async function handleLogin(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    navigate(from, { replace: true })
  }

  return (
    <AuthForm
      title="Вхід"
      subtitle={
        from === '/' ? 'Увійдіть у свій акаунт KSE Career Hub.' : 'Щоб продовжити, увійдіть у свій акаунт.'
      }
      submitLabel="Увійти"
      onSubmit={handleLogin}
      onGoogle={() => signInWithGoogle(from)}
      initialError={readOAuthError()}
      footer={{ text: 'Ще немає акаунта?', linkLabel: 'Зареєструватися', to: '/register' }}
    />
  )
}
