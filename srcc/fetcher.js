/* 

think of this as:
“Given a URL, try to download its HTML, and tell me what happened.”

# fetcher will:
Fetch a URL
Set User-Agent
Return { status, html }
Handle network errors cleanly

# output:
{
  ok: true,
  status: number,
  html: string
}

*/

/* 

# why are we using native fetch and not axios:

"axios for easy error handling"
That’s a web app mindset, not a crawler mindset.

In crawlers:
404 is normal
500 is normal
timeouts are normal
half the web is broken

Native fetch is the right choice because:
We want to explicitly decide what “ok” means
We want to see raw status codes
We want full control over failure semantics
Fetcher must never throw
Axios makes that harder, not easier.

*/

// URLs fetched must already be normalized.

import { REQUEST_TIMEOUT_MS, USER_AGENT } from './config.js'

export async function fetchPage(url) {

  const contoller = new AbortController()
  const signal = contoller.signal

  const timeoutId = setTimeout( () => contoller.abort(), REQUEST_TIMEOUT_MS)

  let response
  let html
    
  try {

    response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": USER_AGENT,
        "Accept": "text/html"
      },
      signal
    })
    clearTimeout(timeoutId)

  }
  catch (e) {
    
    clearTimeout(timeoutId)
    return { ok: false, error: "Network error or timeout."}

  }

  const status = response.status
  if ( status < 200 || status >= 300) {
    return { ok: false, error: "non-2xx status", status}
  }

  const contentType = response.headers.get("content-type")
  if (!contentType || !contentType.includes("text/html")) {
    return { ok: false, error: "non-html content type", status}
  }

  try {
    html = await response.text()
  }
  catch (e) {
    return { ok: false, error: "failed to read body"}
  }

  return {
    ok: true,
    status: status,
    html: html
  }

}



