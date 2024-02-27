require('dotenv').config()
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { authenticateLogin } = require("./helpers.js");
const jwt = require("jsonwebtoken");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const posts = [
  { username: "lucass@shifta.la", title: "Post 1" },
  { username: "marcosf@shifta.la", title: "Post 2" },
];

app.get("/posts", authenticateToken, (req, res) => {
  res.json(posts.filter(post=> post.username === req.user.username));
});

app.post("/login", (req, res) => {
  // Authenticate
  const authenticatedUser = authenticateLogin(req.body);
  if (authenticatedUser) {
    console.log("user", authenticatedUser)
    const accessToken = jwt.sign(
      authenticatedUser,
      process.env.ACCESS_TOKEN_SECRET
    );

    res.json({ accessToken: accessToken });
  } else {
    res.status(500).json("Login inválido");
  }
});

function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token === null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
        //token exists but is not valid
        if(err) return res.status(403).json("Token inválido");
      
        req.user = user;
        next();
    });
}

app.listen(3000);
