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



// //---------Show User based on ID in URL----------//
// app.get('/api/blogposts/:id', function (req, res){
// 	var targetID = req.params.id;
// 	var showBlogPost= _.findWhere(blogposts, {id: targetID});
// 	res.json(showBlogPost);
// });


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


//-----------get a single post (SOLUTION)-------------//
// app.get('/api/posts/:id', function(req, res) {

//   // take the value of the id from the url parameter
//   // note that now we are NOT using parseInt
//   var targetId = req.params.id

//   // find item in database matching the id
//   Post.findOne({_id: targetId}, function(err, foundPost){
//     console.log(foundPost);
//     if(err){
//       console.log("error: ", err);
//       res.status(500).send(err);
//     } else {
//       // send back post object
//       res.json(foundPost);
//     }
//   });

// });



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

//----------DELETE USER (ORIGINAL)-----------------//
// app.delete('/api/blogposts/:id',function (req, res){
// 	var targetID = req.params.id;
// 	var foundBlogPost = _.findWhere(blogposts, {id: targetID});
// 	var index = blogposts.indexOf(foundBlogPost);
// 	blogposts.splice(index,1);
// 	res.json(foundBlogPost.username + ' has been deleted');
// });

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




// // delete post
app.delete('/api/posts/:id', function(req, res) {

  // take the value of the id from the url parameter
  var targetId = req.params.id;

 // remove item from the db that matches the id
   Post.findOneAndRemove({_id: targetId}, function (err, deletedPost) {
    if (err){
      res.status(500).send(err);
    } else {
      // send back deleted post
      res.json(deletedPost);
    }
  });
});


// --------------listen on port 3000-------------------//
app.listen(3000, function () {
  console.log('server started on localhost:3000');
});