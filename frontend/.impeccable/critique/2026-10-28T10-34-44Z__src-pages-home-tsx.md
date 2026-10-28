---
target: strona główna ARCHinLAND
total_score: 18
max_score: 36
na_heuristics: 10
p0_count: 1
p1_count: 3
target_identity: "file:E:\\RDB.page\\1.00 WEB PAFKO\\ARCHinLAND\\frontend\\src\\pages\\Home.tsx"
target_fingerprint: "sha256:1bc9e7323c362e4aa28b5013b0df1127beb11796f4ab34c72cec94ad0f31756e"
target_path: "E:\\RDB.page\\1.00 WEB PAFKO\\ARCHinLAND\\frontend\\src\\pages\\Home.tsx"
timestamp: 2026-10-28T10-34-44Z
slug: src-pages-home-tsx
---
# Krytyka: strona główna ARCHinLAND (src/pages/Home.tsx)
Metoda: dual-agent (A: design review · B: detektor). Overlay przeglądarki pominięty — brak narzędzi przeglądarkowych.

## Heurystyki (18/36, #10 n/a — Acceptable, 50%)
1 Status 3 · 2 Real world 3 · 3 Kontrola 2 · 4 Spójność 2 · 5 Zapobieganie błędom 2 · 6 Rozpoznawanie 1 · 7 Elastyczność 2 · 8 Estetyka 2 · 9 Odzyskiwanie 1 · 10 n/a

## Priority issues
- [P0] Martwe punkty: Process pusty (Process.tsx), Projekty zablokowane hasłem bez ścieżki dostępu (ProjectGate.tsx). → clarify + distill
- [P1] Brak momentu konwersji: Contact = klon stopki, brak telefonu/CTA. → bolder + layout
- [P1] Loader do 20 s (8.6 MB GLB) + inert ustawiany na samym .app-loader zamiast na stronie (AppLoader.tsx:73). → optimize + harden
- [P1] Niewidoczna architektura informacji: nagłówki sekcji visually-hidden, H1 = sam wordmark, hero pin 360svh. → layout + typeset
- [P2] 5 krojów (Inter, Inter Tight, Space Grotesk, Space Mono, Barlow) + martwy --font-hand. → typeset

## Detektor
1× overused-font (Hero.css:179, Inter Tight w logotypie — borderline TP). globals.css nie skanowany: Inter + Space Grotesk jako tokeny bazowe = prawdopodobnie kolejne TP.

## Minor
Placeholder instagram.com; skip link niewidoczny na focus; angielskie "Menu/Close/All rights reserved"; menu zamknięte tabowalne (brak inert); kontrast --faint ~3:1; daty opinii "3 lata temu" na sztywno; DecryptText miesza numer telefonu; "use client", @ts-nocheck, martwe CSS (.hero__list, .app-loader__progress); dwa oranże (#FF6B2C/#FE5000); 8vh w AppLoader.css.
