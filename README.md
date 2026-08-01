# Flangame

The official Flanguage browser game: roam a stylized Baltimore, play music for
ghost-colored crowds, collect green bills and friendly slime, find vegan food
boosts, and learn all 271 songs in the Flangadex. Every new game begins with
**Adugari**.

[Play the current production build](https://flangame.ojertrejo.chatgpt.site/)

## Game

- Choose Santi on guitar, Nick on drums, or Jake on bass
- Move through a detailed black-and-white Baltimore street map
- Play music for fleeing crowds, collect their green bills, and level up
- Use instant directional RIFFs, JAM performances, road jumps, and random teleporting
- Collect friendly green slime for ability and payout multipliers
- Find fruit, vegetables, tofu, bean burgers, cauliflower pizza, and vegan junk food boosts
- Search trash cans and dumpsters for food and gold records containing songs
- Permanently color the city wherever RIFFs and JAMs reach
- Unlock the full correctly ordered 271-song Flangadex, starting with Adugari
- Save and resume progress locally

There are no side missions and no violent slime combat. The main loop is simply
trying to play music for people while they run away, slowing them with music,
jamming until they pay, and leaving them alone after they drop bills.

## Controls

- Move: joystick, arrow keys, or `WASD`
- Jam / use nearby object: JAM, `Z`, or `Space`
- Directional music riff: RIFF, `X`, or `Shift`
- Jump to the next road: JUMP or `C`
- Teleport: TP or `V`
- Songs / Flangadex: SONG, `Enter`, or `F`
- Switch member: BAND, `Q`, or `1`–`3`
- Pause: the center pause button or `Esc`

Touch controls appear automatically on phones and tablets. Pinch the map to
zoom; portrait orientation is the intended layout.

## Run locally

The large Baltimore map is stored as compressed source chunks so it stays
within GitHub's per-file upload limit. Reconstruct it once, then use any static
file server:

```sh
cat .github/pages-assets/baltimore-streets.json.gz.b64.* \
  | base64 --decode \
  | gzip --decompress \
  > public/game/baltimore-streets.json

python3 -m http.server 8000 --directory public/game
```

Open `http://localhost:8000/`.

## Music

Tracks are resolved by stable Bandcamp track ID from the deployed
[Flanguage Terminal catalog](https://flanguage.github.io/Flanguage/data/catalog.js).
Stream URLs are never committed because Bandcamp rotates them. Flangame
refreshes expired streams and uses an official Bandcamp embed when direct
playback is unavailable.

## Deployment

Merging this branch into `main` assembles the Baltimore map and publishes the
game through GitHub Pages. Set the repository's Pages source to **GitHub
Actions** once in Settings → Pages.
