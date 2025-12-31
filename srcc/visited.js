// URLs stored must already be normalized.

const visitedSet = new Set()

export function visitedHas(url) {
    return visitedSet.has(url)
}

export function add(url) {
   
    visitedSet.add(url)

}

export function size() {
    return visitedSet.size
}

/*  
add(url) is called only after a node is dequeued
and before links from that page are enqueued.
*/
