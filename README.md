# Folder Structure :

```javascipt
crawler/
├── src/
│   ├── index.js              # entry point (wire everything)
│   ├── crawler.js            # BFS crawl loop (core)
│   ├── frontier.js           # queue abstraction
│   ├── visited.js            # visited set abstraction
│   ├── fetcher.js            # HTTP fetch logic
│   ├── parser.js             # HTML parsing + link extraction
│   ├── normalize.js          # URL normalization rules
│   ├── filters.js            # link filtering rules
│   ├── logger.js             # structured crawl logs
│   └── config.js             # crawler limits & constants
│
├── output/
│   └── crawl.jsonl            # crawl results (append-only)
│
├── package.json
└── README.md
```

# Core modules & Responsibilities :

# config.js :

Only constants

SEED_URL

MAX_DEPTH

MAX_PAGES

ALLOWED_HOSTNAME

# frontier.js :

Queue behavior only

Enqueue { url, depth }

Dequeue FIFO

Check empty

❗ Frontier does NOT know:

visited

normalization

filtering

# visited.js

Set behavior only

has(url)

add(url)

size tracking (for max pages)

Visited is updated only when dequeued.

# fetcher.js

One job

Input: normalized URL

Output: { status, html } OR error

# parser.js

HTML → raw links

Input: HTML + base URL

Output: array of raw href strings

Rules:

Only <a href>

No normalization here

# normalize.js

Deterministic URL normalization

Resolve relative URLs

Remove fragment

Normalize hostname

Remove default ports

Normalize path (/page vs /page/)

Keep query params

# filters.js

Pure boolean decisions

Same hostname

Depth allowed

Avoid auth/login/signup

Already visited?

Already in frontier?

# logger.js

Human + machine readable logs

enqueue

dequeue

fetch success/fail

skip reasons

# crawler.js

🚨 The brain

Owns the BFS loop

Coordinates everything

Enforces invariants


