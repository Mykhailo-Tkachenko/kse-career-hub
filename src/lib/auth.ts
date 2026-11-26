import { supabase } from './supabase'

export const KSE_DOMAIN = 'kse.org.ua'

export function isKseEmail(email: string | undefined): boolean {
  return !!email && email.toLowerCase().endsWith(`@${KSE_DOMAIN}`)
}

// Після Google повертаємось на /login?next=..., звідти — туди, куди йшов користувач.
// Домен остаточно перевіряє хук hook_restrict_signup у Supabase (supabase/auth.sql).
export async function signInWithGoogle(next: string) {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/login?next=${encodeURIComponent(next)}`,
      // hd — підказка Google показати акаунти KSE
      queryParams: { hd: KSE_DOMAIN, prompt: 'select_account' },
    },
  })
  if (error) throw error
}

// Лише шляхи всередині сайту — щоб ?next= не можна було використати для редиректу на чужий сайт
export function isInternalPath(path: string): boolean {
  return path.startsWith('/') && !path.startsWith('//')
}

// Supabase повертає помилки OAuth у query або в hash, напр. коли хук відхилив не-KSE пошту
export function readOAuthError(): string | null {
  const params = new URLSearchParams(window.location.search)
  const hash = new URLSearchParams(window.location.hash.slice(1))
  return params.get('error_description') ?? hash.get('error_description')
}
