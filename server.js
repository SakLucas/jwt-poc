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

function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token === null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
        //token exists but is not valid
        console.log(err)
        if(err) return res.status(403).json(err);
      
        req.user = user;
        next();
    });
}

app.listen(3000);
