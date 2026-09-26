# How to update this website

**Everything in this repository is yours.** Your live site is https://nikhilmunjampalli.github.io/portfolio/ and it is served straight from the GitHub repository `nikhilmunjampalli/portfolio`, which is on your own account.

There is no build step, no platform, no plugin and no subscription. Edit a file and commit it — the live site updates in about a minute.

**Nothing here depends on Higgsfield, or on the AI assistant that built it.**

## What survives what

| If you lose… | What happens to this site |
|---|---|
| This chat | Nothing. The site and these instructions are in the repository. |
| Your Higgsfield account | Nothing. This site is on GitHub, not Higgsfield. The separate Higgsfield-hosted copy (nikhilmunjampalli.higgsfield.app) would disappear with it — this one would not. |
| Access to your GitHub account | The site goes offline. See Keeping access below. |

The cloned voice used for the narration lived in a Higgsfield workspace, so it cannot be re-run elsewhere. The audio files themselves are in this repository, so everything already recorded keeps working forever.

## The five things you'll actually want to change

### 1. Edit text — from your phone, no tools

1. Open https://github.com/nikhilmunjampalli/portfolio
2. Tap the file you want: index.html (home), design.html, motion.html, photography.html, or one in design/
3. Tap the pencil icon (Edit this file)
4. Use the browser's Find to locate the sentence, and type your change
5. Tap Commit changes, then Commit changes again
6. Wait about a minute, then reload your site

Your words are plain text inside the HTML. The thing that looks like I&apos;m is just an apostrophe written safely, and &amp; is an ampersand.

### 2. Replace a photograph

1. In the repository, open the folder the image lives in — for example assets/photos/
2. Tap Add file → Upload files
3. Upload your new image with exactly the same filename as the one you're replacing. Same name = it swaps in everywhere it's used. Different name = nothing changes.
4. Commit changes

GitHub accepts files up to 25 MB through the browser, so this works for the videos too — replace one by uploading a new file with the same name.

### 3. Update your CV

Replace assets/nikhil-munjampalli-cv.pdf with a new PDF of the same name. Every Download CV link across the site points at that one file.

### 4. Change the tour narration text

The tour's words and timings live in portable-data.js. Each stop looks like:

    {"id":"top","seconds":15.4,"caption":"Hey, I'm Nikhil, …","work":[…]}

Edit the caption text. Leave seconds alone unless the audio changed — it's the measured length of that segment plus a short beat.

To use new audio, upload your file over assets/audio/tour-1.mp3 (and so on), then set that stop's seconds to the new recording's length plus 0.5.

### 5. Add a whole new project

This is the one job that's fiddly by hand, because a project needs images, a heading, and possibly a listener control in the page HTML. Two options:

- Ask any AI — ChatGPT, Claude, Gemini. Point it at https://github.com/nikhilmunjampalli/portfolio and describe what you want. The site is ordinary HTML, CSS and JavaScript, so it can read it and write the change for you.
- Ask any web developer — this is a plain static site. No framework, no build tooling, nothing exotic. Any developer can pick it up in minutes.

## Handing it to someone else

Because the site is plain files on a public repository, no one needs your permissions or your accounts to work on it. Send them the repository link.

If you want someone to edit it rather than just read it: repository → Settings → Collaborators → Add people. They get their own access, and you can remove it later. Never share your password or a token with anyone.

## Keeping access — the one real risk

The site depends entirely on your GitHub account. Protect it:

- Turn on two-factor authentication: https://github.com/settings/security
- Save your recovery codes somewhere offline
- Consider adding a second email address to the account

If you ever lose access to the account entirely, the site goes offline and cannot be recovered without GitHub's support. Your own copy of every file is in the ZIP you downloaded, so you could re-publish it to a new account the same day.

## If you want a proper domain

Right now the address is nikhilmunjampalli.github.io/portfolio/. A real domain (nikhilmunjampalli.com, say) costs roughly NZ$20-30 a year and points at this same repository:

1. Buy the domain from any registrar
2. In the repository: Settings → Pages → Custom domain — enter it, save
3. At the registrar, add the DNS records GitHub shows you
4. Tick Enforce HTTPS once it goes green

That keeps you free of GitHub's URL and free of anyone else's platform.

## If something breaks

Every change is reversible. GitHub keeps a full history:

- Recent mistake: repository → Commits → open the bad commit → Revert
- Anything worse: every file's contents at every point in time is still there, and the whole site can be restored to any earlier commit

Nothing you do in the browser editor can permanently destroy the site.
