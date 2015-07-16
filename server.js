// require express framework and additional modules
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    _ = require('underscore'),
    mongoose = require('mongoose'),
	ForumPost = require("./models/forumPoster");

//------------Linking to Public Folder------//
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
//----Connects to localhost to Database------//
mongoose.connect('mongodb://localhost/forumposts');


//----------------------ROUTES---------------------//

//-----------------ROOT Route---------------------//
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/views/microblog.html');
});

//------------------DATA/API Routes-------------------//

//----------------Show All Forum Posts--------------//
app.get('/api/forumposts', function (req, res){
	ForumPost.find({}, function (err, allForumPosts){
		if(err){
			console.log('wrong path dummy:', err);
			res.status(500).send(err);
		} else {
			res.json(allForumPosts);
		}
	});
});

app.get('/api/forumposts/:id', function (req, res){
	var targetID = req.params.id;
	ForumPost.findOne({_id: targetID}, function (err, foundForumPost){
		console.log(foundForumPost);
		if(err){
			console.log("wtf happened dude", err);
			res.status(500).send(err);
		} else {
			res.json(foundForumPost);
		}
	});
});



//-------------NEW BLOG POST--------------------//


app.post('/api/forumposts', function (req, res){
	var newForumPost = new ForumPost({
		username: req.body.username,
		forumPost: req.body.forumPost
	});
	newForumPost.save(function (err, savedForumPost){
		if (err){
			console.log("fucked up again", err);
			res.status(500).send(err);
		} else {
			res.json(savedForumPost);
		}
	});
});

//----------------UPDATE SINGLE POST---------------//

app.put('/api/forumposts/:id', function (req, res){
	var targetID = req.params.id;
	ForumPost.findOne({_id: targetID}, function (err, foundForumPost){
		if(err){
			console.log("wrong again fucker");
			res.status(500).send(err);
		} else {
			foundForumPost.username = req.body.username;
			foundForumPost.forumPost = req.body.forumPost;
			res.json(foundForumPost);
			foundForumPost.save(function (err, savedForumPost){
				if (err){
					console.log("mother fkcur");
					res.status(500).send(err);
				} else {
					res.json(savedForumPost);
				}
			});
		}
	});
});

//-----------------DELETE User By ID------------------//
app.delete('/api/forumposts/:id', function (req, res){
	var targetID = req.params.id;
	ForumPost.findOneAndRemove({_id: targetID}, function (err, deletedForumPost){
		if(err){
			console.log("wrong again fucker");
			res.status(500).send(err);
		} else {
			res.json(deletedForumPost);
			};
		});
});

// --------------listen on port 3000-------------------//
app.listen(3000, function () {
  console.log('server started on localhost:3000');
});