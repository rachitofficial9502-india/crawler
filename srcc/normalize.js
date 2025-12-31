/* 

Think of it like this:
“Given a raw href and a base URL, what is the canonical absolute URL string for this crawler?”

Input:
normalize(rawUrl: string, baseUrl: string)
rawUrl → raw href from parser
baseUrl → normalized absolute URL of current page

Output:
string | null
string → normalized absolute URL
null → invalid / unsupported / unusable URL
never throws

*/



export function normalize(rawUrl, baseUrl) {

    if ( rawUrl == null || rawUrl == "") {
        return null
    }

    if ( rawUrl.startsWith("#") || rawUrl.startsWith("javascript:") || rawUrl.startsWith("mailto:") || rawUrl.startsWith("tel:")) {
        return null
    }

    let urlObj

    try {
        urlObj = new URL(rawUrl, baseUrl)
    }
    catch (error) {
        return null
    }

    // v1 will only support http and https protocol.
    if ( urlObj.protocol != "http:" && urlObj.protocol != "https:") {
        return null
    }

    urlObj.hash = ""
    urlObj.hostname = (urlObj.hostname).toLowerCase()

    if ( (urlObj.protocol == "http:" && urlObj.port == "80") || (urlObj.protocol == "https:" && urlObj.port == "443")) {
        urlObj.port = ""
    }

    if ( !urlObj.pathname.endsWith("/")) {
        urlObj.pathname += "/"
    }
    if (urlObj.pathname == "//") {
        urlObj.pathname = "/"
    }

    return urlObj.toString()

}