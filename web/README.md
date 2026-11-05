# Mirae Flow — LeetCode-style Flowgorithm platform

Mirae Flow is a responsive web platform for learning algorithmic thinking with Flowgorithm. It is built as a real website with separate routes, user accounts, a database-backed submission history, and a server-side `.fprg` judge. The PWA caches the application shell and the public source-problem catalogue for browsing; sign-in and online judging require the API to be reachable.

## What is implemented

- Separate product pages: Dashboard, Roadmap, Topics, Problemset, an individual `/problems/:id` workspace, Submissions, Leaderboard, Account, and Settings.
- Problem library with search, topic, assignment-set, difficulty, status, and judge-readiness filters.
- Dedicated problem workspace with the original book statement, source attribution, guidance, `.fprg` upload, and a server-returned verdict.
- React + TypeScript + Vite frontend, responsive CSS Grid/Flexbox, rem-based sizing, light/dark/system themes, Uzbek/English interface labels, and adjustable UI zoom.
- FastAPI backend, PostgreSQL production database (SQLite local development), Argon2 password hashing, signed HttpOnly sessions, submission history, student statistics, and leaderboard.
- Server-side Flowgorithm XML parser/interpreter. It deliberately supports only the published Topic 1 subset and rejects unsupported shapes. It is not a general-purpose Flowgorithm runtime.
- Docker Compose deployment: PostgreSQL + API + Nginx-hosted React website. Nginx routes `/api` to the backend and applies basic IP-based rate limits to authentication and submissions.
- PWA app-shell caching and an offline copy of the public catalogue. Cached pages can be browsed offline; accounts and online submissions cannot work without a server connection.

## Source-backed problem catalogue

The uploaded `MIRAE_Flowgorithm_Tolik_Toplam.docx` supplies **444 original exercise statements** across 8 of the 12 requested platform topics:

| Platform topic | Source exercises | Online checker |
|---|---:|---|
| 01 Basics | 65 | Available |
| 02 Input | 70 | Preparation required |
| 03 Types (div/mod) | 40 | Preparation required |
| 04 String | No source section in current book | Not available |
| 05 If | 69 | Preparation required |
| 06 Nested If | 35 | Preparation required |
| 07 For | 100 | Preparation required |
| 08 While | 30 | Preparation required |
| 09 Nested For | 35 | Preparation required |
| 10 Array | No source section in current book | Not available |
| 11 Mixed | No source section in current book | Not available |
| 12 Exam | No source section in current book | Not available |

The content in the bank keeps the source statements and the book's section/problem numbering. The classwork/homework/mastery grouping and Beginner/Middle/Finish level are Mirae platform organization, not labels taken from the book. Topic 1 preserves all 65 exercises (25 classwork, 35 homework, 5 mastery).

Only Topic 1 currently has reference-output metadata and an enabled checker. The backend refuses submissions for the other 379 exercises rather than inventing test contracts or returning fake verdicts. Topic 1 contains a single reference-output checker per exercise at this stage; it should not be described as a hidden-test system yet.

## Run locally

Requirements: Node.js 22 recommended, Python 3.11+, and pip.

### 1. Install frontend dependencies

```bash
npm install
```

### 2. Install backend dependencies

```bash
python -m venv .venv
# Windows PowerShell: .venv\\Scripts\\Activate.ps1
# macOS/Linux: source .venv/bin/activate
pip install -r server/requirements.txt
```

### 3. Configure and start the API

```bash
cp server/.env.example server/.env
# Set JWT_SECRET_KEY to a long random value in server/.env.
# Load the variables from server/.env into your shell, then:
uvicorn server.app.main:app --reload --host 0.0.0.0 --port 8000
```

For a quick local run, export the variables in the current shell before starting `uvicorn`. PowerShell example:

```powershell
$env:DATABASE_URL = "sqlite:///./mirae-flow.db"
$env:JWT_SECRET_KEY = "local-only-use-a-long-random-secret-value"
$env:COOKIE_SECURE = "false"
$env:CORS_ORIGINS = "http://localhost:5173"
$env:WEB_ORIGIN = "http://localhost:5173"
uvicorn server.app.main:app --reload --host 0.0.0.0 --port 8000
```

### 4. Start the website in another terminal

```bash
npm run dev
```

Open the Vite URL printed by the terminal. The Vite development server proxies `/api` to `http://127.0.0.1:8000`.

## Test and build

```bash
npm run check
npm run build
npm run preview
npm run test:api
npm run validate:data
```

The static production website is created in `dist/`. For a same-origin deployment, serve `dist/` and proxy `/api/` to the FastAPI server. The included Nginx deployment already does this.

## Deploy the full web platform with Docker Compose

Copy `.env.example` to `.env`, replace both secrets with unique values, and set the public HTTPS origin:

```bash
cp .env.example .env
# Edit POSTGRES_PASSWORD, JWT_SECRET_KEY, WEB_ORIGIN and WEB_PORT
# Then start the stack:
docker compose up --build -d
```

The website listens on `WEB_PORT` (default `8080`). Nginx serves the SPA and proxies API requests to FastAPI. PostgreSQL persists data in a named Docker volume. Put a TLS reverse proxy (for example, Caddy or a managed load balancer) in front of this service before public production use; keep `COOKIE_SECURE=true` in production. The API is not published directly on the host by Compose.

For API documentation during development, open `/docs` on port 8000.

## API overview

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | API status and imported problem count |
| GET | `/api/topics` | 12 platform topics and source counts |
| GET | `/api/problems` | Searchable, filterable, paginated problem catalogue |
| GET | `/api/problems/{id}` | Individual problem statement |
| POST | `/api/auth/register` | Create an account |
| POST | `/api/auth/login` | Start a session |
| POST | `/api/auth/logout` | End a session |
| GET | `/api/auth/me` | Current account |
| GET | `/api/me/stats` | Solved ids, attempts, activity dates, recent submissions |
| GET | `/api/submissions` | Current user's submission history |
| GET | `/api/problems/{id}/submissions` | Current user's history for one problem |
| POST | `/api/problems/{id}/submissions` | Upload and server-judge a `.fprg` solution |
| GET | `/api/leaderboard` | Accepted-problem ranking |

## Judge scope and trust boundaries

The `.fprg` file is parsed as XML on the server. The first judge only accepts Flowgorithm shapes necessary for the no-input Basics topic (`Declare`, `Assign`, `Output`, comments and breakpoints). Other shapes fail closed. The expression evaluator uses an allow-listed Python AST; uploaded files are not executed as Python, JavaScript, shell commands, or native code. File size, XML structure, expression complexity, arithmetic magnitude and output size are bounded.

The expected output/checker metadata lives only in `server/data/problemBank.json`. It is not present in `src/data/problemCatalog.json`, and the submission API does not return reference answers. The current checker is suitable for a limited educational beta, not a competitive-grade hostile-code judge. Before opening submissions to untrusted public traffic, add isolated worker processes/containers, CPU/memory/time quotas, a durable queue, a separate judge service, per-user/IP quotas, logging/monitoring, database migrations, backups, and security review. Do not run arbitrary code in the API process.

## Re-import the source book

Keep the original DOCX outside version control and pass its path to the importer. It requires `python-docx`:

```bash
pip install python-docx
python scripts/import_book.py --book /path/to/MIRAE_Flowgorithm_Tolik_Toplam.docx
python scripts/validate_problem_bank.py
```

The importer preserves the Topic 1 checker metadata already in `server/data/problemBank.json`; do not delete that private bank before importing. It regenerates the public catalogue without answer keys.

## Important next milestones

1. Add declared input cases and per-problem test contracts for Topic 2, then implement Flowgorithm `Input` safely.
2. Prepare reference outputs and multiple test cases for every exercise before enabling its judge flag.
3. Add `If`, loops, arrays and strings incrementally with parser/runtime tests matching Flowgorithm's actual semantics.
4. Add email verification, password reset, profile management, classroom/group roles, teacher tools, and Telegram activation only after the core account flow has production monitoring and abuse protection.
5. Add the real Flowgorithm desktop editor as a supported external authoring workflow; the current website accepts native `.fprg` uploads but does not embed the desktop application's editing canvas.
