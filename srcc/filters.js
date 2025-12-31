/*

filters must check:
Same-domain (exact hostname match)
Depth ≤ max depth
Not auth/login/signup
Not already visited
Not already in frontier

Think of it like this:
“Should this already-normalized URL be enqueued into the frontier?”

Input:
shouldEnqueue(
  url: string,            // normalized absolute URL
  depth: number,          // depth of this URL
  config: object,         // limits (maxDepth, allowedHost, auth keywords)
  visited: visitedModule,
  frontier: frontierModule
)

Output:
boolean
true → enqueue allowed
false → reject

order:
depth -> visitedHas -> frontierHas -> then comes the url parsing.
these three comes first in order to save resources and time, we do cheap checks first.
visitedHas and frontierHas takes normalized url , shouldEnqueue takes normalized url as argument, so we can do these first.

*/


import { MAX_DEPTH, AUTH_PATH_KEYWORDS, ALLOWED_HOSTNAME } from './config.js'

export function shouldEnqueue(url, depth, visitedHas, frontierHas) {

    if ( depth > MAX_DEPTH) {
        return false
    }

    if ( visitedHas(url)) {
        return false
    }

    if ( frontierHas(url)) {
        return false
    }

    const urlObj = new URL(url)

    if ( urlObj.hostname != ALLOWED_HOSTNAME) {
        return false
    }
    
    for (const element in AUTH_PATH_KEYWORDS) {
        if ( (urlObj.pathname.toLowerCase() ).includes(AUTH_PATH_KEYWORDS[element])) {
        return false
    }
    }

    return true
}