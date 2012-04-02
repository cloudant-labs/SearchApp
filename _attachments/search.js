;(function($, undefined) {

    // http://stackoverflow.com/questions/901115/get-querystring-values-with-jquery/2880929#2880929
    function parseQS() {
        var urlParams = {};
        var e,
        a = /\+/g,  // Regex for replacing addition symbol with a space
        r = /([^&=]+)=?([^&]*)/g,
        d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
        q = window.location.search.substring(1);
        while (e = r.exec(q)) urlParams[d(e[1])] = d(e[2]);
        return urlParams;
    }

    var ROWS = 1000;
    var SHOWROWS = 10;

    $.ajaxSetup({ contentType: null, dataType: 'json' })

    var template
    var cache = {}
    var loaded = 0

    function loadResults(query, total, callback) {
        console.log("query");
        console.log(query);
        console.log("cache[query]");
        console.log(cache[query]);

        if (cache[query] && cache[query].loading) return;
        if (cache[query] && (cache[query].rows.length >= total)) return callback(cache[query])

        if (!cache[query]) cache[query] = { rows: [], loading: true, offset: 0 }
        return $.get('../../_search', { q: query, default_field: 'all', include_docs: false, limit: ROWS, skip: cache[query].rows.length }, function(results) {
            cache[query] = {
                rows: cache[query].rows.concat(results.rows),
                total_rows: results.total_rows
            }
            console.log("cache[query]");
            console.log(cache[query]);
            var urlParams = parseQS(document.location.search);
            console.log("urlParams");
            console.log(urlParams);
            var aid = urlParams.aid;
            console.log("aid");
            console.log(aid);
            var sq = urlParams.sq;
            console.log("sq");
            console.log(sq);
//            return callback(cache[query]); //short curuit the rest

            var newquery = query + " OR (";
            if (undefined != sq) {
                    newquery = newquery + sq + " AND (";
            }
            if (undefined != aid) {
                    var ids = new Array();
                    for (row in results.row) {
                            ids.push(aid + ":" + row.id);
                    }
                newquery = newquery + ids.join(" OR ") + ")";
            }
            if (undefined != sq) {
                    newquery = newquery + ")";
            }
            console.log("newquery");
            console.log(newquery);
            return  $.get('../../_search', { q: newquery, default_field: 'all', include_docs: false, limit: SHOWROWS, skip: cache[newquery].rows.length }, function(data) {
                                        cache[newquery] = {
                                                rows: cache[newquery].rows.concat(data.rows),
                                                total_rows: data.total_rows
                                        }
                                        callback(cache[newquery]) 
                    })
        })
    }

    function search(start) {
        if (!start) loaded = 0

        var q = $('#search .box').val()
        updateUrl(q)

        return loadResults(q, loaded+ROWS, function(results) {
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
            template = decodeURIComponent(el.html())
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

    function updateUrl(q) {
        if (history.pushState) {
            document.title = 'Searching for "'+q+'"'
            history.pushState({ q: q }, document.title, 'index.html?q=' + encodeURIComponent(q))
        }
    }

    function init() {
        var q = parseQS(document.location.search).q
        if (q) {
            $('#search .box').val(q)
            search()
        }
    }

    $(window).bind('popstate', init)
    $(init)

})(jQuery);