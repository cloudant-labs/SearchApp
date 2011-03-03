function(doc, req) {
    // !json templates.result
    // !code lib/mustache.js
    return Mustache.to_html(templates.result, doc)
}