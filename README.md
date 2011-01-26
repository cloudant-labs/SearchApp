# SearchApp

SearchApp is a CouchDB application that enables full text search and creates a simple search page for any CouchApp or CouchDB database hosted on cloudant.com.

## Requirements

cloudant hosted account (sign up at <https://cloudant.com/#!/solutions/cloud>), couchapp

## Install

<pre><code>cd SearchApp
cat > .couchapprc
{"env":{"default":{"db":"http://<user>:<pass>@<user>.cloudant.com:5984/<db_or_couchapp_you_want_to_search>"}}}
^C</code></pre>

*that last line means hit **CTRL-C***

To configure the display of the search results, modify the file:

evently/search/_init.js

To configure the indexing of documents, modify the file:

_docs/lucene.json

following the insturctions on <http://support.cloudant.com/kb/search/search-indexing>.

The default search.html example works for Twitter data and is based on the style of <https://github.com/doppler/TweetEater>

<pre><code>couchapp push</code></pre>

Now view your app at

<pre><code>http://<user>.cloudant.com:5984/<db_or_couchapp_you_want_to_search>/_design/searchapp/index.html</code></pre>

