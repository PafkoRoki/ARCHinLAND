// Hasło do katalogu projektów (/projekty).
// To tylko blokada dla zwykłych odwiedzających — dane projektów i tak trafiają do plików strony,
// więc osoba techniczna może ją obejść. W kodzie trzymamy skrót SHA-256 hasła, nie samo hasło.
//
// Zmiana hasła: wygeneruj skrót nowego hasła i wklej go poniżej:
//   node -e "console.log(require('crypto').createHash('sha256').update('NOWE_HASLO').digest('hex'))"
const PASSWORD_SHA256 = '263215f8a35a432ded8a0728f9e5229d0de1b42fecc405dabd2b7b6cd53d61b7'

// po poprawnym haśle przeglądarka pamięta odblokowanie; zmiana hasła unieważnia stare wpisy
const STORAGE_KEY = 'archinland-projects-access'

async function sha256(text: string): Promise<string> {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, '0')).join('')
}

export function hasProjectAccess(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === PASSWORD_SHA256
  } catch {
    return false
  }
}

export async function unlockProjects(password: string): Promise<boolean> {
  const ok = (await sha256(password.trim())) === PASSWORD_SHA256
  if (ok) {
    try {
      localStorage.setItem(STORAGE_KEY, PASSWORD_SHA256)
    } catch {
      // bez pamięci przeglądarki (tryb prywatny) odblokowanie trwa do przeładowania strony
    }
  }
  return ok
}
