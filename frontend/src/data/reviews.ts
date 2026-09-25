// Opinie klientów — edytowane ręcznie (bez Google API).
// Źródło: wizytówka Google https://maps.app.goo.gl/q1e8d4pXW5jm4TST9
//
// Puste pola się nie wyświetlają:
// - rating: null → brak bloku z oceną,
// - brak "rating" przy opinii → brak gwiazdek przy tej opinii,
// - reviews: [] → brak listy opinii (zostaje tylko link do Google).

export type Review = {
  author: string // np. "Jan Kowalski"
  date: string // np. "3 miesiące temu" albo "marzec 2026"
  rating?: number // 1–5 (opcjonalnie)
  quote: string // treść opinii; **tekst** = pogrubienie (superlatywy)
}

export const reviewsData: {
  rating: number | null // średnia ocena z Google, np. 4.9
  reviewCount: number | null // liczba opinii w Google, np. 23
  mapsUrl: string // link "Przeczytaj wszystkie opinie"
  reviews: Review[]
} = {
  rating: null,
  reviewCount: null,
  mapsUrl: 'https://maps.app.goo.gl/q1e8d4pXW5jm4TST9',
  reviews: [
    {
      author: 'Marta',
      date: 'miesiąc temu',
      quote:
        '**Z pełnym przekonaniem polecamy** Pana Andrzeja Kurkę. Po wielu miesiącach starań o uzyskanie warunków zabudowy dla naszego domku rekreacyjnego otrzymaliśmy decyzję, która była dla nas bardzo niekorzystna. Wydawało się, że realizacja naszego wymarzonego miejsca może stanąć pod znakiem zapytania. Wtedy trafiliśmy do Pana Andrzeja, który z **ogromnym zaangażowaniem** zajął się naszą sprawą. Dzięki jego **wiedzy, doświadczeniu, profesjonalizmowi i skuteczności** udało się doprowadzić ją do pomyślnego zakończenia i uzyskać warunki zabudowy, które pozwalają nam zrealizować nasze plany. Pan Andrzej jest osobą **niezwykle rzetelną, kompetentną i godną zaufania**. Jesteśmy mu ogromnie wdzięczni za pomoc, ponieważ dzięki niemu nasz wymarzony domek wreszcie będzie mógł powstać.',
    },
    {
      author: 'Rudolf',
      date: 'miesiąc temu',
      quote:
        'U Pana Andrzeja **długoletnie doświadczenie** łączy się ze **świeżymi, nowoczesnymi pomysłami**. **Gustowne i profesjonalne wykonanie projektu**. Polecam.',
    },
    {
      author: 'Karsten Key',
      date: 'miesiąc temu',
      quote: '**Zrealizowali naszą wizję!**', // tłumaczenie Google z angielskiego
    },
    {
      author: 'Arkadiusz Czuba-Kosior',
      date: '3 lata temu',
      quote:
        '**Szybka i sprawna obsługa**. Panowie doradzili i zrealizowali nasz skomplikowany projekt :-) **Oby więcej takich firm z takim podejściem**. Polecamy…',
    },
    {
      author: 'Iga Maciejewska',
      date: '3 lata temu',
      quote:
        '**Zawsze do usług**. Wszelkie wątpliwości rozwiewane o każdej porze dnia i nocy. **Dyspozycyjna i konkretna firma**. Polecam.',
    },
  ],
}
