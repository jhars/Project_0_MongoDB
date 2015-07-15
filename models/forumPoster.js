var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ForumPostSchema = new Schema({
	username: String,
	forumPost: String,
});

var ForumPost = mongoose.model('ForumPost', ForumPostSchema);

module.exports = ForumPost;