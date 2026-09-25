import { useEffect, useState } from 'react'
import SectionHeader from '../components/SectionHeader'
import './Reviews.css'

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

// Opinie w stylu stopki (layout/Footer): grafitowe tło na całą szerokość, siatka w .container, jasne linie 1px.
// Razem z Kontaktem i stopką tworzą jeden ciemny blok na dole strony.
export default function GoogleReviews() {
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
    <section id="reviews" className="reviews" aria-labelledby="reviews-title">
      <SectionHeader index="05" label="Opinie" id="reviews-title" />

      <div className="container">
      <div className="reviews__grid">
        <div
          className="reviews__score"
          aria-label={data ? `Ocena ${data.rating.toFixed(1)} na 5 w Google` : 'Ocena w Google'}
        >
          <span className="reviews__caption">Opinie Google</span>
          <strong>{data ? data.rating.toFixed(1) : '–'}</strong>
          <Stars rating={data?.rating} />
          <span className="reviews__caption">
            {data ? `na podstawie ${data.reviewCount} opinii` : 'ocena klientów'}
          </span>
        </div>

        <div className="reviews__list" aria-live="polite">
          {!data && !error && <p className="reviews__status">Pobieranie aktualnych opinii…</p>}
          {error && <p className="reviews__status">Opinie Google są chwilowo niedostępne.</p>}
          {reviews.map((review) => (
            <article className="review" key={review.author}>
              <div className="review__topline">
                <GoogleMark />
                <Stars rating={review.rating} />
                <time>{review.date}</time>
              </div>
              <blockquote>„{review.quote}”</blockquote>
              <footer>{review.author}</footer>
            </article>
          ))}
        </div>
      </div>

      <a className="reviews__link" href={mapsUrl} target="_blank" rel="noreferrer">
        Przeczytaj wszystkie opinie <span aria-hidden="true">→</span>
      </a>
      </div>
    </section>
  )
}
