import { useCallback, useEffect, useRef, useState } from 'react'
import SectionHeader from '../components/SectionHeader'
import { reviewsData, type Review } from '../data/reviews'
import './Reviews.css'

const CLAMP_LINES = 7 // tyle linii opinii widać przed "Czytaj więcej"

function GoogleMark() {
  return <span className="reviews__google-mark" aria-hidden="true">G</span>
}

function Stars({ rating }: { rating: number }) {
  const full = Math.max(0, Math.min(5, Math.round(rating)))
  return (
    <span className="reviews__stars" aria-label={`${rating} na 5 gwiazdek`}>
      {'★'.repeat(full)}
      {'☆'.repeat(5 - full)}
    </span>
  )
}

// "**tekst**" w treści opinii → pogrubienie
function Emphasis({ text }: { text: string }) {
  return (
    <>
      {text.split('**').map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part))}
    </>
  )
}

function ReviewCard({ review, index, total }: { review: Review; index: number; total: number }) {
  const quoteRef = useRef<HTMLQuoteElement>(null)
  const [expanded, setExpanded] = useState(false)
  const [clamped, setClamped] = useState(false)

  // przycisk "Czytaj więcej" tylko wtedy, gdy tekst faktycznie się nie mieści
  useEffect(() => {
    const el = quoteRef.current
    if (!el) return
    const check = () => setClamped(el.scrollHeight > el.clientHeight + 1)
    check()
    const ro = new ResizeObserver(check)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <article
      className="review"
      role="group"
      aria-roledescription="opinia"
      aria-label={`${index + 1} z ${total}`}
    >
      <div className="review__topline">
        <GoogleMark />
        {review.rating !== undefined && <Stars rating={review.rating} />}
        <time>{review.date}</time>
      </div>
      <blockquote
        ref={quoteRef}
        className={`review__quote${expanded ? ' is-expanded' : ''}`}
        style={{ ['--clamp' as string]: CLAMP_LINES }}
      >
        „<Emphasis text={review.quote} />”
      </blockquote>
      {(clamped || expanded) && (
        <button type="button" className="review__more" onClick={() => setExpanded((v) => !v)}>
          {expanded ? 'Zwiń' : 'Czytaj więcej'}
        </button>
      )}
      <footer>{review.author}</footer>
    </article>
  )
}

// Opinie w stylu stopki (layout/Footer): grafitowe tło, siatka w .container, jasne linie 1px.
// Karuzela: przewijanie poziome z przyciąganiem do kart (scroll-snap) + przyciski ← →.
// Dane wpisuje się ręcznie w src/data/reviews.ts — puste pola się nie wyświetlają.
export default function Reviews() {
  const { rating, reviewCount, mapsUrl, reviews } = reviewsData
  const hasScore = rating !== null
  const hasReviews = reviews.length > 0

  const trackRef = useRef<HTMLDivElement>(null)
  const [first, setFirst] = useState(0) // indeks pierwszej widocznej karty
  const [perView, setPerView] = useState(1)

  const measure = useCallback(() => {
    const track = trackRef.current
    const card = track?.firstElementChild as HTMLElement | null
    if (!track || !card) return
    const w = card.getBoundingClientRect().width
    setPerView(Math.max(1, Math.round(track.clientWidth / w)))
    setFirst(Math.round(track.scrollLeft / w))
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    measure()
    track.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      track.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
    }
  }, [measure])

  const scrollBy = (dir: 1 | -1) => {
    const track = trackRef.current
    const card = track?.firstElementChild as HTMLElement | null
    if (!track || !card) return
    track.scrollBy({ left: dir * card.getBoundingClientRect().width, behavior: 'smooth' })
  }

  const last = Math.min(reviews.length, first + perView)
  const atStart = first <= 0
  const atEnd = last >= reviews.length

  return (
    <section id="reviews" className="reviews" aria-labelledby="reviews-title">
      <SectionHeader index="05" label="Opinie" id="reviews-title" />

      <div className="container">
        {(hasScore || hasReviews) && (
          <div className={`reviews__grid${hasScore && hasReviews ? '' : ' reviews__grid--single'}`}>
            {hasScore && (
              <div className="reviews__score" aria-label={`Ocena ${rating.toFixed(1)} na 5 w Google`}>
                <span className="reviews__caption">Opinie Google</span>
                <strong>{rating.toFixed(1)}</strong>
                <Stars rating={rating} />
                {reviewCount !== null && (
                  <span className="reviews__caption">na podstawie {reviewCount} opinii</span>
                )}
              </div>
            )}

            {hasReviews && (
              <div className="reviews__carousel" role="region" aria-roledescription="karuzela" aria-label="Opinie klientów">
                <div ref={trackRef} className="reviews__track" tabIndex={0}>
                  {reviews.map((review, i) => (
                    <ReviewCard key={review.author + review.date} review={review} index={i} total={reviews.length} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* dolny pasek: licznik · link do Google · strzałki */}
        <div className="reviews__bar">
          {hasReviews ? (
            <span className="reviews__count" aria-live="polite">
              {first + 1}
              {last > first + 1 ? `–${last}` : ''} / {reviews.length}
            </span>
          ) : (
            <span />
          )}

          <a className="reviews__link" href={mapsUrl} target="_blank" rel="noreferrer">
            {hasReviews ? 'Przeczytaj wszystkie opinie' : 'Zobacz opinie w Google'} <span aria-hidden="true">→</span>
          </a>

          {hasReviews && (
            <div className="reviews__arrows">
              <button type="button" className="reviews__arrow" onClick={() => scrollBy(-1)} disabled={atStart} aria-label="Poprzednia opinia">
                ←
              </button>
              <button type="button" className="reviews__arrow" onClick={() => scrollBy(1)} disabled={atEnd} aria-label="Następna opinia">
                →
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
