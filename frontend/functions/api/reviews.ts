type Environment = {
  GOOGLE_PLACES_API_KEY: string
}

type RequestContext = {
  env: Environment
}

type GoogleReview = {
  rating?: number
  relativePublishTimeDescription?: string
  text?: { text?: string }
  originalText?: { text?: string }
  authorAttribution?: { displayName?: string }
}

type GooglePlace = {
  rating?: number
  userRatingCount?: number
  googleMapsUri?: string
  reviews?: GoogleReview[]
}

type GoogleResponse = {
  places?: GooglePlace[]
}

export const onRequestGet = async ({ env }: RequestContext): Promise<Response> => {
  if (!env.GOOGLE_PLACES_API_KEY) {
    return Response.json({ error: 'Opinie Google nie są jeszcze skonfigurowane.' }, { status: 503 })
  }

  const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': env.GOOGLE_PLACES_API_KEY,
      'X-Goog-FieldMask': 'places.rating,places.userRatingCount,places.googleMapsUri,places.reviews',
    },
    body: JSON.stringify({
      textQuery: 'Eranpro Developer sp. z o.o., Kamień Pomorski, Poland',
      languageCode: 'pl',
      pageSize: 1,
    }),
  })

  if (!response.ok) {
    return Response.json({ error: 'Nie udało się pobrać opinii Google.' }, { status: 502 })
  }

  const data = (await response.json()) as GoogleResponse
  const place = data.places?.[0]

  if (!place) {
    return Response.json({ error: 'Nie znaleziono wizytówki Google.' }, { status: 404 })
  }

  return Response.json(
    {
      rating: place.rating ?? 0,
      reviewCount: place.userRatingCount ?? 0,
      googleMapsUri: place.googleMapsUri,
      reviews: (place.reviews ?? []).slice(0, 3).map((review) => ({
        author: review.authorAttribution?.displayName ?? 'Opinia Google',
        date: review.relativePublishTimeDescription ?? '',
        rating: review.rating ?? 5,
        quote: review.text?.text ?? review.originalText?.text ?? '',
      })),
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=300',
      },
    },
  )
}
