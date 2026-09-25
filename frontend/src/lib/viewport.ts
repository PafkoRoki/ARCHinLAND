// Stała wysokość ekranu do obliczeń przewijania.
// window.innerHeight na telefonie zmienia się, gdy chowa się/pojawia pasek adresu przeglądarki —
// obliczenia oparte na nim "skaczą". Warstwy sceny Hero mają wysokość 100svh (najmniejszy ekran,
// nie zmienia się przy chowaniu paska), więc bierzemy ich wysokość.
export function screenHeight(): number {
  const layer = document.querySelector<HTMLElement>('.hero__layer')
  return layer?.offsetHeight || window.innerHeight
}
