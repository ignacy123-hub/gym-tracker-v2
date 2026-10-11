# Gym Tracker (PWA, działa offline)

Dziennik treningowy w jednym pliku `index.html` + service worker. Dane zapisują się lokalnie na telefonie (localStorage).

## Wrzucenie na GitHub i uruchomienie jako aplikacja

1. Utwórz nowe repozytorium na github.com (np. `gym-tracker`, publiczne).
2. Wgraj **zawartość** tego folderu (Add file → Upload files): `index.html`, `sw.js`, `manifest.webmanifest`, `.nojekyll`, folder `icons/`.
3. Settings → Pages → Source: **Deploy from a branch** → Branch: `main` / `(root)` → Save.
4. Po minucie aplikacja jest pod adresem `https://TWOJ-LOGIN.github.io/gym-tracker/`.
5. Otwórz ten adres na telefonie **raz z internetem**, żeby aplikacja i czcionki zapisały się w pamięci.
6. Instalacja:
   - Android (Chrome): przycisk „Zainstaluj" w nagłówku albo menu ⋮ → Zainstaluj aplikację.
   - iPhone (Safari): Udostępnij → Dodaj do ekranu początkowego.

Potem działa bez internetu.

## Aktualizacje
Po zmianie plików zwiększ `VERSION` w `sw.js` (np. `gt-v1.0.1`). Aplikacja pokaże komunikat „Dostępna jest nowa wersja".

## Ważne
- Dane są tylko w tej przeglądarce/telefonie. Rób kopię w Ustawieniach (Eksport), zwłaszcza przed zmianą telefonu.
- Adres `github.io` i zainstalowana aplikacja współdzielą dane; otwarcie z innego adresu = puste dane (można przywrócić z kopii).
