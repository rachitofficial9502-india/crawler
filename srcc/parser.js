/* 

# Think of parser like this:
“Given HTML, what raw links did this page declare?”

# Parser contract:
input:
extractLinks(html: string, baseUrl: string)
html is raw HTML from fetcher
baseUrl is provided only for future extensibility
(parser still does NOT resolve URLs in V1)

Output:
Array<string>
Each element:
is the raw value of href
exactly as found in HTML
may be relative, absolute, empty, malformed

*/

/* 

# cheerio:
We are using cheeio
Cheerio is a fast, lightweight library for parsing and manipulating HTML in a Node.js server-side environment.
npm install cheerio

*/

import {load} from "cheerio"

export function extractLinks(html, baseUrl) {

    const links = []

    const dom = load(html)

    // anchors will be a cheeio collection , not an array, not an list.
    const anchors = dom("a[href]")

    // .each is used for a cheerio collection, here _ is for index because we have no need for the index.
    anchors.each((_, element) => {

        // .attr is how we do it in cheerio to get that specific attribute.
        const href = dom(element).attr("href")

        if (href != undefined && href != "") {
            links.push(href)
        }
    })

    return links

}

/* 

links must be created inside extractLinks, otherwise:

Links from previous pages leak into next pages
Parser becomes stateful
Crawl graph becomes corrupted

Parser must be pure per call.

*/