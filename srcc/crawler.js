/*

Think of the crawler loop like this:
“Take the next URL → mark it visited → fetch it → extract links → normalize → filter → enqueue → repeat”

Inputs & state owned by crawler:
State:
frontier (queue)
visited (set)
pagesCrawled counter
output stream (JSONL)
Config:
seed URL
max depth
max pages
allowed hostname
Crawler owns all state.

crawler loop:
dequeue → visited check → mark visited → fetch → depth cutoff → extract → normalize → filter → enqueue

Output:
record = {
                url: url,
                depth: depth,
                status: result.ok ? "success" : "error",
                status_code: result.status,
                raw_html: result.html,
                out_links: outlinks,
                timestamp: new Date().toISOString()
            }
out_links contains only normalized links.


*/

import {SEED_URL, MAX_DEPTH, MAX_PAGES, } from './config.js'
import { fetchPage } from './fetcher.js'
import { shouldEnqueue } from './filters.js'
import { enqueue, isEmpty, dequeue, frontierHas} from './frontier.js'
import { normalize } from './normalize.js'
import { extractLinks } from './parser.js'
import { visitedHas, add, size} from './visited.js'

import fs from "fs"

let seed = normalize(SEED_URL, SEED_URL)

if (!seed) {
    throw new Error("Invalid Seed Url.")
}

let enqueued = enqueue({url: seed, depth: 0})
console.log("Enqueued: ", enqueued)

async function crawl() {

    const output = fs.createWriteStream("../output/output.jsonl", {
        flags: "a"
    })

        while (!isEmpty() && size() < MAX_PAGES) {

            let {url, depth} = dequeue()
            
            if (visitedHas(url)) {
                continue
            }
            add(url)

            let result = await fetchPage(url) 
            
            if (!result.ok) {
                continue
            }
            console.log("Crawled: ", result.ok, "URL: ", url, "depth: ", depth)

            const rawLinks = extractLinks(result.html, url)

            let outlinks = []

            for (const rawHref of rawLinks) {

                const normalized = normalize(rawHref, url)
                if (!normalized) {
                    continue
                }

                outlinks.push(normalized)

                const newDepth = depth + 1

                if (!shouldEnqueue(normalized, newDepth, visitedHas, frontierHas)) {
                    continue
                }

                enqueued = enqueue({url: normalized, depth: newDepth})
            }
            console.log("URL: ", url, "Enqueued: ", enqueued)

            const record = {
                url: url,
                depth: depth,
                status: result.ok ? "success" : "error",
                status_code: result.status,
                raw_html: result.html,
                out_links: outlinks,
                timestamp: new Date().toISOString()
            }

            output.write(JSON.stringify(record) + "\n")

            if ( depth === MAX_DEPTH) {
                continue
            }

        }

    output.end()

}

crawl()


/*

This i v1:

Architecture:
Raw-artifact crawler
Crawler fetches pages
Crawler stores facts, not interpretations
Indexer consumes crawler output offline

Responsibilities:
Crawler does:
BFS traversal (frontier + visited)
Same-domain crawling
Depth-limited crawling
Max-pages enforcement
Fetch HTML
Extract <a href>
Normalize URLs
Apply crawl policy
Store raw artifacts to output.jsonl
Crawler does NOT:
Clean text
Tokenize
Index
Rank
Decide relevance
Re-fetch during indexing

Output:
Each line in output.jsonl:
{
  "url": "https://example.com/about/",
  "depth": 1,
  "status": "success",
  "status_code": 200,
  "raw_html": "<!doctype html>...",
  "out_links": [
    "https://example.com/contact/",
    "https://example.com/team/"
  ],
  "timestamp": "2025-01-10T12:30:45.123Z"
}

Invariants (never break these):
Visited marked on dequeu
Depth incremented on enqueue
Normalize → Filter → Enqueue
Record written before depth cutoff
Crawler policy ≠ page reality
Indexer never touches the network



*/

