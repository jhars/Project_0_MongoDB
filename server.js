// require express framework and additional modules
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    _ = require('underscore');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/views/microblog.html');
});

//-------------------Blog Posts------------------//

var blogposts = [
{id:"1",username: "peterP",forumPost: "i love to fly, any comments?"},
{id:"2",username: "Gilly",forumPost: "im stuck on an island"},
{id:"3",username: "hook",forumPost: "pan? is that your? it's been a while, hows wendy?"}
];

//------------------JJH NODE CODE--------------------//

app.get('/api/blogposts', function (req, res){
	res.json(blogposts);
});

//---------show User based on ID in URL----------//
app.get('/api/blogposts/:id', function (req, res){
	var targetID = req.params.id;
	var showBlogPost= _.findWhere(blogposts, {id: targetID});
	res.json(showBlogPost);
});


//-------------NEW BLOG POST--------------------//

app.post('/api/blogposts',function (req, res){
	var newPost = req.body;
	blogposts.push(newPost);
	res.json(newPost);
});

// //-----------UPDATE POST-------------------//

app.put('/api/blogposts/:id', function (req, res){
	var targetID = req.params.id;
	//-------SAME AS forEach + if statement--------//
	var foundBlogPost = _.findWhere(blogposts, {id: targetID});
	foundBlogPost.username = req.body.username;
	foundBlogPost.forumPost = req.body.forumPost;

	res.json(foundBlogPost);
});

//----------DELETE USER-----------------//
app.delete('/api/blogposts/:id',function (req, res){
	var targetID = req.params.id;
	var foundBlogPost = _.findWhere(blogposts, {id: targetID});
	var index = blogposts.indexOf(foundBlogPost);
	blogposts.splice(index,1);
	res.json(foundBlogPost.username + ' has been deleted');
});



// --------------listen on port 3000-------------------//
app.listen(3000, function () {
  console.log('server started on localhost:3000');
});