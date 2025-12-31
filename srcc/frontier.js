/* 
we are using ESM 
Use import { enqueue } from "./frontier.js"
This is how we will import these functions.
"type": "module" in package.json

node = {
url, depth }

*/

const frontierQueue = []
const frontierSet = new Set()

export function enqueue(node) {

    const hasURL = frontierSet.has(node.url) 
    if (hasURL) {
        return false
    }

    frontierQueue.push(node)
    frontierSet.add(node.url)

    return true

}

export function dequeue() {

    if (frontierQueue.length === 0) {
        return null
    }

    const node = frontierQueue.shift()
    frontierSet.delete(node.url)

    return node

}

export function isEmpty() {
    return frontierQueue.length === 0
}

export function frontierHas(url) {
    return frontierSet.has(url)
}

/* 
Right now:

const frontierQueue = []
const frontierSet = new Set()
This makes frontier singleton state

 singleton state means that your data structures (frontierQueue and frontierSet) exist as a single, shared instance across the entire application for the duration of the process.

The state lives as long as the application is running. If you were to call your crawl() function twice in the same process, the second run would inherit all the URLs already present in the frontierSet from the first run, likely causing it to skip everything or behave unpredictably.

Factory approach (V2)
function createCrawler() {
  return {
    queue: [],
    set: new Set(),
    run: function()
  };
}

*/