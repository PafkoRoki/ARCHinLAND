import { useEffect, useState } from 'react'
import { useReveal } from '../hooks/useReveal'
import ScrollStack, { ScrollStackItem } from './ScrollStack'
import './5_Reviews.css'

const STEPS = [
  {
    number: '01',
    title: 'POZNANIE POTRZEB',
    text: 'Pierwsze spotkanie z klientem, dokładna analiza potrzeb, stylu życia, oczekiwań oraz możliwości, jakie daje dana przestrzeń.',
    image: '/images/1.png',
  },
  {
    number: '02',
    title: 'FAZA KONCEPCYJA',
    text: 'Na podstawie zebranych informacji tworzymy kierunek projektu, układ funkcjonalny i pierwsze decyzje dotyczące charakteru przyszłej architektury.',
    image: '/images/2.png',
  },
  {
    number: '03',
    title: 'MODELOWANIE\n3D',
    text: 'Przekształcamy pomysł w przestrzeń, strukturę i materiał, sprawdzając proporcje, światło oraz relacje budynku z otoczeniem.',
    embed: 'https://sketchfab.com/models/7665cc6803674d0b897008057b3b0e0c/embed?autostart=1&transparent=1&ui_theme=dark',
  },
  {
    number: '04',
    title: 'PROJEKT BUDOWLANY',
    text: 'Dopracowujemy rozwiązania techniczne i planistyczne, koordynujemy branże oraz przygotowujemy projekt zgodny z wymaganiami formalnymi.',
    image: '/images/3.png',
  },
  {
    number: '05',
    title: 'DOKUMENTACJA WYKONAWCZA',
    text: 'Finalizujemy wszystkie rysunki, zestawienia i detale potrzebne do sprawnego przeprowadzenia realizacji projektu w formie fizycznej.',
    image: '/images/4.png',
  },
]

type Review = {
  author: string
  location: string
  date: string
  rating: number
  quote: string
}

type ReviewsResponse = {
  rating: number
  reviewCount: number
  googleMapsUri?: string
  reviews: Review[]
}

function GoogleMark() {
  return <span className="reviews__google-mark" aria-hidden="true">G</span>
}

function Stars({ rating = 5 }: { rating?: number }) {
  return <span className="reviews__stars" aria-label={`${rating} na 5 gwiazdek`}>★★★★★</span>
}

export default function GoogleReviews() {
  const headingRef = useReveal<HTMLDivElement>()
  const listRef = useReveal<HTMLDivElement>(0.1)
  const [data, setData] = useState<ReviewsResponse | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('/api/reviews')
      .then((response) => {
        if (!response.ok) throw new Error('Reviews unavailable')
        return response.json() as Promise<ReviewsResponse>
      })
      .then(setData)
      .catch(() => setError(true))
  }, [])

  const reviews = data?.reviews ?? []
  const mapsUrl = data?.googleMapsUri ?? 'https://www.google.com/maps/search/?api=1&query=Eranpro+Developer+sp.+z+o.o.'

  return (
    <section className="section section-border reviews" aria-labelledby="reviews-title">
      <div className="container">
        <div ref={headingRef} className="reviews__heading reveal">

          <div className="reviews__intro">
            <div>

              <h2 id="reviews-title" className="display reviews__title">
                Trust Factor<br />
              </h2>
            </div>
            <div className="reviews__score" aria-label="Ocena 5,0 na 5 w Google">
              <strong>{data ? data.rating.toFixed(1) : '--'}</strong>
              <Stars rating={data?.rating} />
              <span>{data ? `na podstawie ${data.reviewCount} opinii Google` : 'opinie Google'}</span>
            </div>
          </div>
        </div>

        

        <div ref={listRef} className="reviews__list reveal reveal-delay-1" aria-live="polite">
          {!data && !error && <p className="reviews__status">Pobieranie aktualnych opinii...</p>}
          {error && <p className="reviews__status">Opinie Google są chwilowo niedostępne.</p>}
          {reviews.map((review) => (
            <article className="review" key={review.author}>
              <div className="review__topline">
                <GoogleMark />
                <Stars rating={review.rating} />
                <time>{review.date}</time>
              </div>
              <blockquote>“{review.quote}”</blockquote>
              <footer>
                <strong>{review.author}</strong>
              </footer>
            </article>
          ))}
        </div>

        <ScrollStack useWindowScroll className="process__stack">
          {STEPS.map((step) => (
            <ScrollStackItem key={step.number} itemClassName="process__stack-card">
              <div className="process__content">
                <span className="process__number display">{step.number}</span>
                <h3 className="process__title-sm display">{step.title}</h3>
                <p className="process__text">{step.text}</p>
              </div>
              {step.embed ? (
                <div className="process__image-slot process__embed-slot">
                  <iframe
                    title="Bliźniak"
                    src={step.embed}
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay; fullscreen; xr-spatial-tracking"
                  />
                </div>
              ) : step.image ? (
                <div className="process__image-slot">
                  <img src={step.image} alt="" />
                </div>
              ) : null}
            </ScrollStackItem>
          ))}
        </ScrollStack>

        <a
          className="reviews__link"
          href={mapsUrl}
          target="_blank"
          rel="noreferrer"
        >
          <span>PRZECZYTAJ WSZYSTKIE OPINIE</span>
          <span aria-hidden="true">-&gt;</span>
        </a>
      </div>
    </section>
  )
}
