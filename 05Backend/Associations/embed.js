var mongoose = require("mongoose");

// MONGOOSE MODEL CONFIG
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/blog_demo", {useNewUrlParser: true});
// Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
// by default, you need to set it to false.
mongoose.set('useFindAndModify', false);


// POST
var postSchema = new mongoose.Schema({
	title: String,
	content: String
});

var Post = mongoose.model("Post", postSchema);

// USER
var userSchema = new mongoose.Schema({
	email: String,
	name: String,
	posts: [postSchema]
});

var User = mongoose.model("User", userSchema);

var newUser = new User({
	email: "hermione@hogwarts.edu",
	name: "Hermione Granger",
});

newUser.posts.push({
	title: "How to brew polyjuice potion",
	content: "Just kidding. Go to potions class to learn it!"
});

// newUser.save(function(err, user){
// 	if (err) {
// 		console.log(err);
// 	} else {
// 		console.log(user);
// 	}
// });

var newPost = new Post({
	title: "Reflections on Apples",
	content: "They are delicious"
});

// newPost.save(function(err, post){
// 	if (err) {
// 		console.log(err);
// 	} else {
// 		console.log(post);
// 	}
// });

User.findOne({name: "Hermione Granger"}, function(err, user){
	if (err) {
		console.log(err);
	} else {
		user.posts.push({
			title: "3 Things I really hate",
			content: "Voldemort. Voldemort. Voldemort."
		});
		user.save(function(err, user){
			if (err) {
				console.log(err);
			} else {
				console.log(user);
			}
		});
	}
});