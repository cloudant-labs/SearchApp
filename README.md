# SearchApp

SearchApp is a CouchDB application that enables full text search and creates a simple search page for any CouchApp or CouchDB database hosted on cloudant.com.

## Requirements

cloudant hosted account (sign up at <https://cloudant.com/#!/solutions/cloud>), couchapp

## Install

<pre><code>cd SearchApp
cat > .couchapprc
{"env":{"default":{"db":"http://&lt;user&gt;:&lt;pass&gt;@&lt;user&gt;.cloudant.com:5984/&lt;db_or_couchapp_you_want_to_search&gt;"}}}
^C</code></pre>

*that last line means hit **CTRL-C***

To configure the display of the search results, modify the file:

evently/search/_init.js

To configure the indexing of documents, modify the file:

_docs/lucene.json

following the insturctions on <http://support.cloudant.com/kb/search/search-indexing>.  By default, all json values are indexed as text using the Lucene Standard analyzer, and put into a single default field call "all".

The default search.html example works for Twitter data and is based on the style of <https://github.com/doppler/TweetEater>

<pre><code>couchapp push</code></pre>

Now view your app at

<pre><code>http://&lt;user&gt;.cloudant.com:5984/&lt;db_or_couchapp_you_want_to_search&gt;/_design/searchapp/index.html</code></pre>

By default, searches are executed against the field "all". 
