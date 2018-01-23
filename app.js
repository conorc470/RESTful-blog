// to see changes in terminal, node app.js, mongo, use restful_blog_app (the name you called it below in mongoose connect)

var express = require("express"),
app = express(),
bodyParser = require("body-parser"), // takes the body of your request and parses it to whatever you want your server to receive in POST/PUT requests (JSON, URL encoded, text, raw).
mongoose = require("mongoose"),
methodOverride = require("method-override");

// APP Config
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

// Mongoose/Model Config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "Test Blog",
//     image: "https://static.pexels.com/photos/248797/pexels-photo-248797.jpeg",
//     body: "Hello this is a blog post"
// });

// RESTFUL ROUTES
app.get("/", function(req, res){
    res.redirect("/blogs");
});

// INDEX ROUTE
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("Error");
        } else {
            res.render("index", {blogs: blogs});
        }
    })
});

// NEW ROUTE
app.get("/blogs/new", function(req, res){
    res.render("new");
})

// CREATE ROUTE
app.post("/blogs", function(req, res){
    //create blog
    Blog.create(req.body.blog, function(err, newBlog){
        if(err) {
            res.render("new");
        } else {
            // then, redirect to the index
            res.redirect("/blogs");
        }
    })
});

// SHOW ROUTE
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundBlog});
        }
    })
})

// EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log("error occured in fetching")
        }
        else{
            res.render("edit", {blog: foundBlog})
        }
    })
});

// UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err, updatedBlog){
        if(err){
            console.log("error updating")
        }
        else{
            res.redirect("/blogs/"+req.params.id)
        }
    })
})

// DELETE ROUTE
app.delete("/blogs/:id",function(req, res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log("error deleting post")
        }
        else{
            res.redirect("/blogs")
        }
    })
})

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server is running");
});