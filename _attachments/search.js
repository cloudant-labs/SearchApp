;(function($, undefined) {
    var ROWS = 10

    $.ajaxSetup({ contentType: null, dataType: 'json' })

    var template
    var cache = {}
    var loaded = 0

    function loadResults(query, total, callback) {
        if (cache[query] && cache[query].loading) return;
        if (cache[query] && (cache[query].rows.length >= total)) return callback(cache[query])

        if (!cache[query]) cache[query] = { rows: [], loading: true, offset: 0 }

        return $.get('../../_search', { q: query, default_field: 'all', include_docs: true, limit: ROWS, skip: cache[query].rows.length }, function(results) {
            cache[query] = {
                rows: cache[query].rows.concat(results.rows),
                total_rows: results.total_rows
            }
            return callback(cache[query])
        })
    }

    function search(start) {
        if (!start) loaded = 0

        return loadResults($('#search .box').val(), loaded+ROWS, function(results) {
            fill($('#search .results'), results)

            loaded = results.rows.length

            $('#search .more').toggle(results.total_rows > loaded)
            $('#search .info').toggle(results.total_rows > 0)

            fill($('#search .info'), { loaded: loaded, total: results.total_rows })
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