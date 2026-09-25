// Wspólny stan modelu 3D w tle:
// - sekcja About zmienia dragRotation (przeciąganie myszką), BackgroundModel czyta go w każdej klatce,
// - BackgroundModel zgłasza postęp wczytywania i gotowość, AppLoader na to czeka.
export const modelControls = {
  dragRotation: 0, // dodatkowy obrót wokół osi Y z przeciągania (radiany)
}

type ProgressListener = (progress: number) => void

const listeners = new Set<ProgressListener>()
let lastProgress = 0
let isReady = false
let resolveReady: () => void = () => {}

/** Spełnia się, gdy model jest wczytany i narysowany (albo wczytywanie się nie udało). */
export const modelReady = new Promise<void>((resolve) => {
  resolveReady = resolve
})

/** Postęp wczytywania pliku modelu, 0–1. */
export function reportModelProgress(progress: number) {
  lastProgress = Math.max(lastProgress, Math.min(1, progress))
  listeners.forEach((listener) => listener(lastProgress))
}

export function reportModelReady() {
  if (isReady) return
  isReady = true
  reportModelProgress(1)
  resolveReady()
}

/** Subskrypcja postępu; od razu dostaje aktualną wartość. Zwraca funkcję wypisania. */
export function onModelProgress(listener: ProgressListener) {
  listeners.add(listener)
  listener(lastProgress)
  return () => {
    listeners.delete(listener)
  }
}
