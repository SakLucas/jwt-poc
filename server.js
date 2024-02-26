const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const { authenticate } = require('./helpers.js')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const posts = [
  { username: "Lucas", title: "Post 1" },
  { username: "Marcos", title: "Post 2" },
];

app.get("/posts", (req, res) => {
  res.json(posts);
});

app.post("/login", (req, res) => {
  // Authenticate
  if(authenticate(req.body)){
    res.json(posts);
  }else{
    res.status(500).json("Login inválido");
  }
});

app.listen(3000);