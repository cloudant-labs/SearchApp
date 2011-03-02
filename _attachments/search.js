;(function($, undefined) {
    var ROWS = 10
    var DELAY = 300

    function debounce(delay, f) {
        if (f.timeout) clearTimeout(f.timeout)
        if (f.xhr) f.xhr.abort()
        f.timeout = setTimeout(function() {
            delete f.timeout
            f.xhr = f()
            if (f.xhr) f.xhr.complete(function() {
                delete f.xhr
            })
        }, delay)
    }

    $.ajaxSetup({ contentType: null, dataType: 'json' })

    var template
    var cache = {}
    var loaded = 0

    function loadResults(query, total, callback) {
        if (cache[query] && cache[query].length && (cache[query].length >= total)) return callback(cache[query])

        if (!cache[query] || (!cache[query].length)) cache[query] = []

        return $.get('../../_search', { q: query, default_field: 'all', include_docs: true, limit: ROWS, skip: cache[query].length }, function(results) {
            cache[query] = cache[query].concat(results.rows)
            return callback(cache[query].slice(0, total), results.total_rows)
        })
    }

    function search(start) {
        if (!start) loaded = 0

        return loadResults($('#search .box').val(), loaded+ROWS, function(rows, total) {
            fill($('#search .results'), { rows: rows })

            loaded = rows.length

            $('#search .more').toggle(total > loaded)
            $('#search .info').toggle(total > 0)

            fill($('#search .info'), { loaded: loaded, total: total })
        })

    }

    function fill(el, data) {
        var template = el.data('template')
        if (!template) {
            template = el.html()
            el.data('template', template)
        }
        el.html(Mustache.to_html(template, data)).removeClass('template')
    }

    $('#search .form').live('submit', function() {
        search()
        return false
    })

    $('#search .more').live('click', function() {
        search(loaded)
    })


    $(function() {
        if ($('#search .box').val()) search()
    })

})(jQuery);