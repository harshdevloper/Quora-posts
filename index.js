const express = require("express");
const path = require("path");
const { v4: uuidv4 } = require('uuid');
const methodOverride = require("method-override");

const app = express();
const port = process.env.PORT || 3000;  // Use the environment port if available, else default to 3000

// Middleware setup
app.use(methodOverride("_method"));  // Override HTTP methods for form submissions
app.set("view engine", "ejs");  // Set EJS as the view engine
app.use(express.urlencoded({ extended: true }));  // Parse form data
app.set("views", path.join(__dirname, "views"));  // Set views directory
app.use(express.static(path.join(__dirname, "public")));  // Serve static files from public

// In-memory data store
let posts = [
  { id: uuidv4(), username: "Harsh Sharma", content: "I Love coding" },
  { id: uuidv4(), username: "Ritik Latiyan", content: "Hardwork is important to achieve success" },
  { id: uuidv4(), username: "Manish", content: "I got selected for my first internship" }
];

// Redirect root path to /posts
app.get('/', (req, res) => {
  res.redirect('/posts');
});

// Route to display all posts
app.get('/posts', (req, res) => {
  res.render("index.ejs", { posts });
});

// Route to render new post form
app.get("/posts/new", (req, res) => {
  res.render("new.ejs");
});

// Route to create a new post
app.post("/posts", (req, res) => {
  const { username, content } = req.body;
  posts.push({ id: uuidv4(), username, content });
  res.redirect(`/posts/${req.params.id}`); 
});

// Route to display a specific post
app.get('/posts/:id', (req, res) => {
  const { id } = req.params;
  const post = posts.find(p => p.id === id);
  if (post) {
    res.render("show.ejs", { post });
  } else {
    res.status(404).send("Post not found");
  }
});

// Route to edit a post (render form)
app.get("/posts/:id/edit", (req, res) => {
  const { id } = req.params;
  const post = posts.find(p => p.id === id);
  if (post) {
    res.render("edit.ejs", { post });
  } else {
    res.status(404).send("Post not found");
  }
});

// Route to update a post
app.patch("/posts/:id", (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const post = posts.find(p => p.id === id);
  if (post) {
    post.content = content;
    res.redirect(`/posts/${req.params.id}`); 
  } else {
    res.status(404).send("Post not found");
  }
});

// Route to delete a post
app.delete("/posts/:id", (req, res) => {
  const { id } = req.params;
  posts = posts.filter(p => p.id !== id);
  res.redirect(`/posts/${req.params.id}`); 
});

// 404 Error handling for undefined routes
app.use((req, res) => {
  res.status(404).send("404: Page not found");
});

// Start the server
app.listen(port, () => {
  console.log(`The server is listening at http://localhost:${port}`);
});
