# MAKE — One creative. Many mediums.

**Project handover · Nikhil Munjampalli — portfolio website**
Prepared 26 September 2026. Read this first in any new session.

---

## 1. What this project is

A senior-level creative portfolio for Nikhil Munjampalli (Auckland, New Zealand) —
graphic design, photography, video and AI work. It exists as **two live sites**:

| Site | URL | Depends on |
|---|---|---|
| Platform build | https://nikhilmunjampalli.higgsfield.app | The Higgsfield account |
| Portable copy | https://nikhilmunjampalli.github.io/portfolio/ | GitHub only |

The portable copy is a complete, platform-free snapshot: 14 pages, 449 files,
536 MB, served straight from a GitHub repository. It needs no backend, no build
step and no account other than GitHub.

Brand line: **MAKE / ONE CREATIVE. MANY MEDIUMS.**
Palette: warm black `#0a0908`, blood red `#8e2428`, warm white `#f2ede3`,
muted warm grey `#b3ab9c`, silver `#cfc9bd`.
Type: Anton (display), Montserrat (labels), Inter (body).

---

## 2. Standing rules — do not break these

- **Never spend credits without explicit permission.** Confirm before any generation.
- **Never crop an image.** Scale down proportionally, always. (Trimmed PDF exports
  and removed printer marks are fine; cropping photographs is not.)
- **No year counts on the site** unless he asks. He asked for "17+ years of
  creative experience" in the hero, so that one stands.
- **Kiwi accents only, never Australian** — this is for marketing voiceovers. The
  tour narration uses **his own cloned voice** (Indian English) by his deliberate choice.
- **Never imitate or leave another video's watermark.** If editing a clip that
  carries one, remove it.
- **Studio photography** means pure-white background only.
- **One case study = one product, one design job, one visual identity.** Never mix
  sub-brands, never use generic brand assets to fill a layout.
- **Trimax ads:** use the real product photo as-is, never redesign it.
- **Tack Direct is a separate project.** Never mix its assets into this portfolio.
- **Include the live site link in every reply after a change.**

---

## 3. Where everything lives

| Thing | Where |
|---|---|
| Platform repo | website_id `1e55bd0a-4d76-45a6-8891-2bdcf016b276` (clone via website_repo_access) |
| GitHub repo | github.com/nikhilmunjampalli/portfolio |
| Portable export (local) | the `portable/` folder — 14 pages + 449 files |
| Portable ZIP | `portfolio-portable.zip`, 536 MB |
| CV | `assets/nikhil-munjampalli-cv.pdf` — its printed URL and QR point at the platform site |
| Tour narration | `assets/audio/tour-1.mp3` … `tour-6.mp3` |
| Project stories | `assets/audio/projects/` — five files |
| Fonts | `assets/fonts/` — self-hosted, no Google request |

In the repo: `README.txt` documents hosting and deploy, `HOW-TO-UPDATE.md`
documents how to edit the site without any assistant.

---

## 4. The narration scripts, as recorded

### The one-minute tour (6 segments, 72.5s of audio, tour runs 75.6s)

```
1 · TOP  (slot 15.4s)
Hey, I'm Nikhil, an Auckland-based creative specialising in design and video,
alongside photography. Most of my work is in retail, so whatever I'm creating, it
needs to look great, grab attention, and most importantly, sell.

2 · MAKE THE IDEA  (13.6s)
Design is a big part of what I do. I take ideas from concept to final execution,
creating campaigns, branding, packaging, catalogues, digital content and retail signage.

3 · MAKE IT MOVE  (13.3s)
Video is just as important. I create brand films, product videos and short-form
content, combining filming, editing and AI when it helps tell the story better.

4 · MAKE IT REAL  (9.8s)
I also shoot product and campaign photography for e-commerce, catalogues and social,
bringing the same visual approach into every format.

5 · THE LAB  (14.3s)
Then there's The Lab, where I experiment with AI, new tools and ideas, just to see
what's possible. One of those experiments, Titan, ended up reaching nearly two
million views on Instagram.

6 · CONTACT  (9.2s)
That's the quick version. Have a look around, and if you think we could make
something great together, get in touch.
```

### The five project stories ("Hear the story", 28–39s each)

Stops: `featured-ringers-denim` (0:33), `10-sport-med-boot` (0:39),
`08-boot-cleaner-box` (0:38), `offpage-01-retail-rollout` (0:28),
`frame-to-campaign` (0:33). All written in his own words and recorded verbatim.
The full texts are in the repository's `portable-data.js` and in the platform
repo's `nm-project-audio.tsx`.

---

## 5. Technical gotchas — these cost real time and credits

**Audio generation with a cloned voice.** Always pass `model: "seed_audio"`
explicitly. If `model` is omitted, the approval step injects `model: "elevenlabs"`,
the job runs on a different engine (`text2speech_v2`), and the cloned voice
renders as **a completely different speaker**. This wasted six generations before
it was caught. Verify by checking the returned `job_set_type` is `seed_audio`, and
by running the audio through `audio_analyze` to compare accent and timbre against
a known-good recording **before publishing**.

**Seed Audio reads slowly** — roughly 100–120 wpm, which sounds sluggish. Do not
fix this with `speech_rate`; small negatives overshoot badly. Time-compress the
finished file instead, which preserves pitch:

```
ffmpeg -y -i in.mp3 -filter:a "atempo=1.2" -b:a 96k out.mp3
```

110 wpm becomes ~138 wpm — conversational — with no artefacts.

**One audio element, never one per segment.** A fresh `new Audio()` per segment
needs its own autoplay unlock, so the visitor has to tap for sound at every stop.
Use a single persistent element and swap its `src`.

**Large GitHub pushes** fail with "RPC failed; curl 55". Set
`http.postBuffer 524288000` and `http.version HTTP/1.1`, then push from a
background process so it can outlast a foreground command.

**The GitHub connector cannot bulk-upload** (one file per API call) and has **no
Pages tool** — enable Pages via the REST API with a personal access token, and
push the bulk of the files with `git`.

**Image rules:** never crop; cap the long edge at 1600px; WebP at quality 82;
removing printer marks and white document margins is fine.

---

## 6. Verification — what is proven, not assumed

The portable copy was crawled end to end:

- **449 of 449 files** return 200 and are **byte-identical** to the export (536 MB)
- **367 asset references** crawled from all 14 pages: 0 failures, 0 mismatches
- **14 of 14 internal page links** resolve
- Media returns **206 Partial Content** (so seeking works), with correct MIME
  types: `audio/mp3`, `video/mp4`, `image/jpeg`, `image/webp`, `font/woff2`
- The tour runs on GitHub: 6 stops, correct caption, work strip, narration playing
  from the local file, unmuted, progress advancing
- The project players run: button switches to `❚❚ 0:01 / 0:33` with a live progress bar

Four deliberate differences from the platform build, all documented in the README:
no private stats page; the catalogue fan renders as a scrollable strip; audio
needs one tap before browsers allow it; fonts are self-hosted.

---

## 7. Site structure

- **Home** — hero with the value line, chapters MAKE THE IDEA / MAKE IT MOVE /
  MAKE IT REAL, The Lab, About, Earlier work, Contact. The 75-second tour and the
  intro curtain live here.
- **Design** — featured campaign (Ringers Western denim), selected campaigns, the
  rest of the shelf, Small Space Big Sell (5 magazine adverts), BUILT TO BE MADE
  (12 single-project studies), OFF THE PAGE (3 signage/vehicle studies), Layout at
  Scale, Creative direction & ownership — plus 10 campaign case-study pages.
- **Motion** — 41 reels in grouped rows.
- **Photography** — heroes, curated grid with filters, FROM FRAME TO CAMPAIGN,
  More from the shoots, CTA.
- **Stats** — a private page whose passphrase is stored in the site's own code
  (`src/routes/stats.tsx`), deliberately not printed here.

---

## 8. Open items

1. **Cooper Allan grouping** — five separate product studies currently; a
   side-by-side comparison page was built and he has not yet decided between five
   separate, one grouped system, or cutting to three.
2. **"Seven brands" wording** — the Built to Be Made tile now says MULTIPLE BRANDS,
   but two other places on the design page still say "seven brands". Either align
   them or leave them.
3. **The real horse photograph** — a genuine photo of the *Prima Equestrian* halter
   worn on a horse exists in the source PDFs. It was **not** used, because the case
   study is the different *Prima Sparkle* halter. If he wants a photography-led
   hero, that halter needs its own study.
4. **Tour delivery** — the engine renders his cloned voice flatly. Truly better
   would be recordings in his own voice; the scripts are ready for that.
5. **Private stats page** is platform-only and absent from the portable copy.
6. **Custom domain** for the GitHub site is optional and unset.

---

## 9. Working with him

He moves fast, edits copy himself and sends it back in his own words — use his
wording verbatim when he supplies it. He dislikes being asked the same question
twice, prefers decisions over options, and wants the live link in every reply
after a change. He reviews carefully and catches real errors; two review documents
from ChatGPT and Claude drove a six-phase accuracy and positioning pass, and his
own proofing caught the wrong-voice audio, a duplicated case study and a product
mix-up between two similar halters.

**Ask before spending. Show the scripts before recording. Verify before reporting.**
