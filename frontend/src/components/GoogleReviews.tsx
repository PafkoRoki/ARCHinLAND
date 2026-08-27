import { useEffect, useState } from 'react'
import { useReveal } from '../hooks/useReveal'
import './GoogleReviews.css'

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
