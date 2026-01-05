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

## Crawler (V1)

This crwaler is the part of another project - a search engine, i am wroking on.

# What this crawler does:

Starts from a single seed URL

Crawls only the same hostname

Uses BFS traversal with a depth limit

Avoids revisiting or re-enqueueing URLs

Fetches pages and stores raw crawl artifacts

Writes results as append-only JSONL

Each successfully fetched page is recorded exactly once per run.

# What this crawler stores:

URL (normalized)

Depth

Fetch status and HTTP status code

Raw HTML (unprocessed)

Outgoing links discovered on the page

No text cleaning, indexing, or ranking happens here.

# Design guarantees:

A URL is never crawled twice in the same run

Crawl terminates cleanly when:

frontier is empty, or
page limit is reached

Output is replayable and deterministic

# Status:

Crawler V1 is complete and frozen.

Future versions may add:

robots.txt handling

rate limiting

concurrency

compression

But the core architecture is locked.





