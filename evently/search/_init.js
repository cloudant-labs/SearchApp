function () {
  var search = $(this), app = $$(search).app;
  var uri = app.db.uri;
  var query = app.req.query.q;
  var limit = app.req.query.limit;
  if (limit == null) limit = 10;
  var skip = app.req.query.skip;
  if (skip == null) skip = 0;
  if (query == null || query.length == 0) return;
  $.getJSON(app.db.uri+"_search?default_field=all&include_docs=true&q="+query+"&skip="+skip+"&limit="+limit,function (data) {
	      var start = data.offset + 1;
	      var finish = data.offset + data.rows.length;
	      var length = data.rows.length;
	      var total = data.total_rows;
	      if (length == 0) {
		$(search).append("<h2 style=\'color:white\'>No Results</h2>");
	      } else {
		var header = "<p id=\'attribution\' style=\'color:white\'>Results " + start + " through " + finish + " of " + total + "</p>";
		$(search).html(header);
		for (i = 0; i < data.rows.length; i++) {
		  var row = data.rows[i];
		  var id = row.id;
		  var doc = row.doc;
		  try {
		    // modify this part to display your results.  This displays Twitter data
		    var r = {
		      screen_name : doc.user.screen_name,
		      name : doc.user.name,
		      avatar : doc.user.profile_image_url,
		      text : $.linkify(doc.text),
		      id : row._id,
		      created_at : doc.created_at
		    };
		    var out = "<li class=\'tweet\' id=\'" + r.id +"\'><img class=\'profile\' src=\'"+ r.avatar + "\' align=\'left\' width=\'36\' /><h3 class=\'screen_name\'><a target=\'_blank\' class=\'user\' href=\'http://twitter.com/" + r.screen_name + "\'>" + r.screen_name + "(" + r.name + ")</a></h3><p class=\'text\'>" + r.text + "</p><span class=\'created_at\'>"+ r.created_at + "</span><br class=\'clear\'></li>"; 
		    $(search).append(out);
		  } catch (err) {
		    // if there is an error above, just display the doc id and a link
		    var out = "<li class=\'tweet\' id=\'" + id +"\'><a target=\'_blank\' href=\'" + uri + id + "\'>" + id + "</a></li>";
		    $(search).append(out);
		  }
		}
		if (total > finish) {
		  var newQuery =  $.query.set("skip",parseInt(skip) + parseInt(limit)).toString();
		  var newUrl = location.pathname + newQuery;
		  $(search).append("<a href=\'" + newUrl + "\'>More Results</a>");
		}
	      }
	      
});
}


 
