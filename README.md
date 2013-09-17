# SearchApp

SearchApp is a CouchDB application that enables full text search and creates a simple search page for any CouchApp or CouchDB database hosted on cloudant.com.

## Requirements

cloudant hosted account (sign up at <https://cloudant.com/sign-up/>), couchapp

## Install

<pre><code>cd SearchApp
cat > .couchapprc
{"env":{"default":{"db":"https://&lt;user&gt;:&lt;pass&gt;@&lt;user&gt;.cloudant.com/&lt;db_or_couchapp_you_want_to_search&gt;"}}}
^C</code></pre>

*that last line means hit **CTRL-C***

To configure the display of the search results, modify the file:

    _attachments/index.html

To configure the indexing of documents, modify the file:

    _docs/lucene.json

following the insturctions on <https://cloudant.com/for-developers/search/>.  By default, all json values are indexed as text using the Lucene Standard analyzer, and put into a single default field call "all".

The default search.html example works for Twitter data and is based on the style of <https://github.com/doppler/TweetEater>

    couchapp push

Now view your app at

    https://&lt;user&gt;.cloudant.com/&lt;db_or_couchapp_you_want_to_search&gt;/_design/searchapp/index.html

By default, searches are executed against the field "all". 
