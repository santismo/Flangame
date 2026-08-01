# Flangame

Make money. Don't work. Don't feed the green.

Flangame is a playable top-down pixel-art Baltimore game starring Flanguage: Santi on guitar, Nick on drums, and Jake on bass.

[Play the current build](https://flangame.ojertrejo.chatgpt.site)

## What's in the first slice

- Switch between Santi, Nick, and Jake, each with an instrument skill
- Busk for people, collect tips, and bank money in the band fund
- Fight green slime that steals pocket cash—and recover it by fighting back
- Drive a car, motorcycle, boat, and unlockable band van
- Travel between present-day Baltimore and 1923
- Play three song missions: **Beats Having a Real Job**, **Underwear Underwater**, and **23 Skidoo**
- Stream the matching Flanguage songs from the live Terminal/Bandcamp catalog
- Play with keyboard or touch controls; save progress locally

## Controls

- Move: `WASD` or arrow keys
- Jam: `Space`
- Use / enter / exit / time jump: `E`
- Instrument skill: `Shift`
- Switch member: `Q` or `1`–`3`
- Pause: `Esc`

Touch controls appear automatically on phones and tablets. Landscape mode is recommended.

## Run locally

Flangame is a static browser game with no build step:

```bash
python3 -m http.server 8000 --directory public/game
```

Open `http://localhost:8000`.

## Music

Tracks are resolved by stable Bandcamp track ID from the deployed [Flanguage Terminal catalog](https://flanguage.github.io/Flanguage/data/catalog.js). Stream URLs are never committed because Bandcamp rotates them. Flangame refreshes expired streams and uses an official Bandcamp embed when direct playback is unavailable.

The `8` control enables low-bit processing when browser stream permissions allow it and a degraded-stream fallback otherwise.

## Deployment

Merging this branch into `main` publishes `public/game` through GitHub Pages.
