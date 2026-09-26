PORTFOLIO — PORTABLE COPY
Nikhil Munjampalli · MAKE / One creative. Many mediums.

A complete, self-contained copy of the portfolio. No backend, no platform
account, no build step, and no external dependency for rendering. Everything it
uses — pages, images, video, audio, fonts — is in this folder.


WHAT'S IN HERE
--------------
  index.html            Home — hero, chapters, the Lab, About, contact
  design.html           Design — campaigns, magazine ads, BUILT TO BE MADE, OFF THE PAGE
  motion.html           Motion — every reel and film, grouped
  photography.html      Photography — heroes, curated grid, campaign example, archive
  design/*.html         10 individual case studies (one per campaign)

  assets/               every file the pages use
    audio/tour-1..6.mp3     the one-minute tour narration (6 segments)
    audio/projects/*.mp3    the five "Hear the story" project narrations
    reels/*.mp4             47 reel and film files
    hero/skills.mp4         the hero film
    lab/*.mp4               Titan and Buster, with posters
    fonts/                  Anton, Inter, Montserrat — self-hosted, no Google request
    photos/, design/, …     all imagery
    nikhil-munjampalli-cv.pdf

  styles.css            the site's full stylesheet
  portable.css          a thin extra layer (intro guard, fan fallback)
  portable.js           all the behaviour — tour, players, lightbox, fan
  portable-data.js      tour + story data, extracted from the live site
  .nojekyll             tells GitHub Pages not to run Jekyll over the folder

  Total: ~536 MB, of which ~510 MB is video.
  Largest single file: 24.5 MB — inside GitHub's 100 MB per-file limit.


DEPLOY TO GITHUB PAGES
----------------------
Use Git, not the browser uploader. GitHub's web upload takes 100 files at a time
and caps each file at 25 MB, so it cannot take this folder.

  In the folder above this one (the folder containing these files):

    git init
    git add .
    git commit -m "Portfolio site"
    git branch -M main
    git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
    git push -u origin main

  Then, in the repository on github.com:

    Settings  ->  Pages  ->  Source: "Deploy from a branch"
              ->  Branch: main,  Folder: / (root)  ->  Save

  Your site appears a minute or two later at:

    https://YOUR-USERNAME.github.io/YOUR-REPO/

  GitHub Desktop works too if you would rather not touch a terminal: point it at
  this folder, publish the repository, then turn on Pages as above.

Notes:
  * No configuration is needed for the subpath — every path in these pages is
    relative, so the site works at /YOUR-REPO/ exactly as it does at a domain root.
  * Limits to be aware of: GitHub Pages allows a 1 GB published site and 100 MB per
    file, and asks for under 100 GB/month of bandwidth. This export sits at 536 MB
    with a 24.5 MB largest file, so it is inside all three.
  * The first push moves ~536 MB and will take a few minutes.


HOST IT ANYWHERE ELSE
---------------------
Drop the folder on Netlify, Cloudflare Pages, Vercel, S3, or any plain web server.

To preview it locally, serve it rather than opening the file directly — browsers
restrict audio and video on file:// URLs:

    python3 -m http.server 8080
    # then visit http://localhost:8080


WHAT WORKS
----------
  * Every page, every link between them, every image and video.
  * The one-minute tour: press ▶ 75-SECOND TOUR. It plays the narration, the
    captions, and a work strip that changes with each segment, and it auto-starts
    once per browsing session.
  * The five "Hear the story" project players on the design and photography pages:
    the project stays visible while the voice explains the brief, the thinking and
    the result.
  * Image lightbox, the catalogue strip, the hero sound toggle.
  * Every outbound link: Instagram, YouTube, LinkedIn, and the old archive.


WHAT'S DIFFERENT FROM THE LIVE SITE
-----------------------------------
  1. The private visitor-stats page is not included — it reads from a database and
     only works on the live platform.
  2. The catalogue fan is a scrollable strip rather than a fanned deck, because the
     fan's animation is computed by the app at runtime.
  3. Audio cannot autoplay on first load: browsers require one tap before any sound.
     That is why the tour shows "TAP FOR SOUND" until the page is touched once.

Nothing else is missing. There are no external dependencies for rendering — the
fonts are bundled, so this works fully offline once loaded.


SNAPSHOT, NOT A LIVE MIRROR
---------------------------
These pages were captured from the live site and rewritten to run as plain files.
If the live site changes, this copy does not update itself. Ask for a fresh export
to bring it up to date.
