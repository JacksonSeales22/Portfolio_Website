# SilentShell

A personal portfolio and project showcase: a React single-page site hosted on AWS, with playable and documented projects, a blog page, and a Tetris game (C++ compiled to WebAssembly) backed by a serverless leaderboard.

**Live site:** [SilentShell](dch8kwxpd1rhm.cloudfront.net)

## Features

- **Landing page** with an intro and a navigation panel.
- **Projects page** where each project gets a demo window. A window can be a playable game, an inline PDF viewer, a screenshot gallery with captions, or any combination in tabs.
- **Tetris**, a C++/SDL2 game compiled to WebAssembly and embedded in the Projects page.
- **Leaderboard**: when a game ends, players can save a score to a public top-10 board.
- **Blog page** with the latest post featured and a "show more" archive.
- **Design**: dark grey and black base with two accent colors, gold `#947726` and purple `#8B008B`.

## Tools and technologies

| Area | Tool | Used for |
|---|---|---|
| Frontend | React, Vite | Single-page app and build tooling |
| Frontend | React Router | Client-side routing (`/`, `/projects`, `/blog`) |
| Frontend | Plain CSS with custom properties | Styling and shared design tokens |
| Hosting | Amazon S3 | Stores the built site (private bucket) |
| Hosting | Amazon CloudFront | CDN, HTTPS, access to S3 through Origin Access Control (OAC) |
| Hosting | AWS Certificate Manager, Route 53 | Custom-domain HTTPS and DNS (planned, no domain yet) |
| CI/CD | GitHub Actions | Builds the site and deploys it on every push to `main` |
| CI/CD | AWS IAM | Dedicated, least-privilege deploy user |
| Backend | AWS Lambda (Python) with a Function URL | Leaderboard API |
| Backend | Amazon DynamoDB | Stores scores |
| Game | C++17, SDL2, SDL2_ttf | Tetris game and rendering |
| Game | Emscripten (`em++`), WebAssembly | Compiles the game to run in the browser |
| Game | Make | Native and web build targets |

## How the pieces fit

```
git push -> GitHub Actions -> S3 (private bucket) <- CloudFront <- Visitor
                                                        (Route 53 planned)

Visitor's browser -> Lambda Function URL -> DynamoDB   (scores API)
```

- Pushing to `main` builds the site, syncs `dist/` to S3, and invalidates the CloudFront cache.
- CloudFront is the only thing allowed to read the bucket (OAC). Custom error responses send 403 and 404 to `/index.html` so React Router handles direct links.
- The game runs in an iframe on the Projects page. When a game ends, it posts the score to the page, which shows a name form and calls the Lambda.

## Project structure

```
SilentShell/
├── .github/
│   └── workflows/
│       └── deploy.yml           # Build, sync to S3, invalidate CloudFront
├── lambda/
│   └── lambda_function.py       # Leaderboard API (GET top scores, POST a score)
├── public/
│   ├── games/
│   │   └── tetris/              # WebAssembly build: tetris.html, .js, .wasm, .data
│   └── projects/
│       └── <project-id>/        # PDFs and screenshots used by project demos
├── src/
│   ├── assets/                  # Images imported by components
│   ├── components/
│   │   ├── Header.jsx / .css    # Site title and links
│   │   ├── ___.jsx/____.css        # Various React components
leaderboard
│   │   └── Leaderboard.jsx / .css   # Leaderboard table and score form
│   ├── App.jsx                  # Landing page
│   ├── Landing.css
│   ├── index.css                # Global styles and design tokens
│   └── main.jsx                 # Entry point and routes
├── index.html
├── package.json
└── vite.config.js
```

Files in `public/` are copied to the site root, so `public/projects/foo/paper.pdf` is served at `/projects/foo/paper.pdf`.

## Local development

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build into dist/
npm run preview    # serve the production build locally
```

To use the leaderboard locally, create `.env.local` (ignored by git):

```
VITE_SCORES_API_URL=https://<your-function-url>/
```

If the variable is missing, the leaderboard shows a "not connected" note and no score form appears.

## Deployment

Every push to `main` runs `.github/workflows/deploy.yml`, which installs dependencies, builds the site, syncs `dist/` to S3 with `--delete`, and invalidates the CloudFront cache.

Repository **secrets** (Settings, Secrets and variables, Actions):

| Name | Purpose |
|---|---|
| `AWS_ACCESS_KEY_ID` | Deploy IAM user key ID |
| `AWS_SECRET_ACCESS_KEY` | Deploy IAM user secret |
| `AWS_S3_BUCKET` | Bucket name |
| `AWS_CLOUDFRONT_DISTRIBUTION_ID` | Distribution to invalidate |

Repository **variable**:

| Name | Purpose |
|---|---|
| `VITE_SCORES_API_URL` | Lambda Function URL, baked into the build. It is public, so it is a variable, not a secret. |

The deploy user's IAM policy allows only `s3:PutObject`, `s3:DeleteObject` and `s3:ListBucket` on the one bucket, and `cloudfront:CreateInvalidation` on the one distribution.

## Adding a project

Projects are entries in the `projects` array at the top of `src/components/Projects.jsx`. Each project chooses its demo window with the `demo` field:

| `demo` | Window shows | Extra fields |
|---|---|---|
| `'wasm'` | The Tetris game and leaderboard | none |
| `'pdf'` | Inline PDF viewer plus an "Open PDF" button | `pdfUrl` |
| `'gallery'` | Screenshot carousel with captions | `images: [{ src, alt, caption }]` |
| `['gallery', 'pdf']` | Tabs, one per type | fields for each type |
| `'none'` or omitted | Text and links only | none |

Put PDFs and images in `public/projects/<project-id>/` and reference them with root-relative paths, for example `'/projects/my-project/paper.pdf'`. Do not include `public` in the path.

## Leaderboard API

One Lambda function behind a Function URL, with CORS configured on the URL itself.

- `GET` returns the top 10 scores, highest first.
- `POST` with `{ "name": "...", "score": 1200 }` saves a score.
- Names must be 1 to 12 characters (letters, numbers, spaces, `_`, `.`, `-`). Scores must be between 1 and 1,000,000. Invalid input returns a 400.
- DynamoDB table `tetris-scores`: partition key `game` (String), sort key `sortKey` (String, zero-padded score plus a random suffix). A reverse query returns the highest scores first.
- The Lambda needs `TABLE_NAME` set as an environment variable, and its role needs `dynamodb:PutItem` and `dynamodb:Query` on the table.

Scores are submitted from the browser, so they can be forged. Input limits and a Lambda concurrency cap keep abuse modest, which is acceptable for this purpose.

## Tetris

The game source lives in its own repository: [tetris](https://github.com/JacksonSeales22/WSL_Code_Projects/tree/main/Tetris). One codebase builds both a desktop and a web version.

```
tetris/
├── tetris.cpp       # Entry point, piece data, game loop, game over handling
├── board.h          # Board state, collision, line clearing
├── pieces.h         # Piece shapes and start positions
├── display.h        # SDL2 window, rendering, text, input
├── gameplay.h       # Game state, scoring, speed-up, drawing
├── Nasa21.ttf       # Font
├── shell.html       # Minimal page for the web build
└── Makefile         # `make` (native) and `make web` (WebAssembly)
```

**Controls:** arrow keys move and soft drop, `Z` rotates, `X` hard drops, `Esc` quits (desktop only).

**Build:**

```bash
make            # desktop build (needs SDL2 and SDL2_ttf dev packages)
make web        # WebAssembly build into web/ (needs the Emscripten SDK on PATH)
```

After `make web`, copy `tetris.html`, `tetris.js`, `tetris.wasm` and `tetris.data` from `web/` into `public/games/tetris/` in this repo and push.

**Web port, in brief:**

- The desktop `while` loop became a per-frame function handed to `emscripten_set_main_loop`, so it no longer blocks the browser. An `#ifdef __EMSCRIPTEN__` keeps one codebase for both builds.
- Game over is a rendered state instead of a blocking key wait, and any key restarts after a short delay.
- The font is packaged into Emscripten's virtual filesystem with `--preload-file`.
- `shell.html` replaces Emscripten's default page: the canvas fills the window, scrolling is disabled, and an Exit/Restart button ends the game and holds the game over screen.
- At game over, the game posts the score to the parent page, which handles the name form and the API call.

## Roadmap

- Register a domain, add an ACM certificate (requested in `us-east-1`) and Route 53 records.
- Build the Notes page (the navigation button exists, the page does not).
- A separate backend for the blog. The Blog page currently reads from a list of posts in `Blog.jsx`.

## AI assistance

Much of the code in this project to speed up the React development was written with help from Claude, an AI assistant made by Anthropic. Claude contributed to the planning of S3, CloudFront and GitHub Actions deployment setup.