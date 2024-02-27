require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { authenticateLogin } = require("./helpers.js");
const jwt = require("jsonwebtoken");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Refresh tokens stored in db/cache
let refreshTokens = [];

app.post("/login", (req, res) => {
  // Authenticate
  const authenticatedUser = authenticateLogin(req.body);
  if (authenticatedUser) {
    console.log("user", authenticatedUser);

    const accessToken = generateAccessToken(authenticatedUser);
    const refreshToken = jwt.sign(
      authenticatedUser,
      process.env.REFRESH_TOKEN_SECRET
    );
    refreshTokens.push(refreshToken);

    res.json({ accessToken: accessToken, refreshToken: refreshToken });
  } else {
    res.status(500).json("Login inválido");
  }
});

app.post("/refresh-token", (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  //token invalidado
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json(err);

    const accessToken = generateAccessToken({ name: user.username });
    res.json({accessToken: accessToken})
  });
});

app.delete("/invalidate", (req, res) =>{
  refreshTokens = refreshTokens.filter(token => token !== req.body.token);
  res.sendStatus(204);
})

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15s",
  });
}

app.listen(4000);
