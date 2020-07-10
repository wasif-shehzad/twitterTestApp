require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json({limit: "50mb"}));
let temp = {};

app.get('/updates/:timespan', (req, res) => {
  try {
    let timeSpan = +req.params.timespan;
    let posts = [];
    if (timeSpan) {
      let responseKeys = Object.keys(temp).filter((item) => item > timeSpan);
      responseKeys.forEach((item) => {
        posts.push(temp[item]);
      })
    } else {
      posts = Object.values(temp);
    }

    res.json({success: true, posts});

  } catch (exception) {
    res.json({success: false, err: exception});
  }
});
app.post('/add', (req, res) => {
  try {
    const {post} = req.body;
    temp[+post.timespan] = post;
    res.json({success: true});

  } catch (exception) {
    res.json({success: false, err: exception});
  }
});

const port = process.env.PORT || 80;

app.listen(port, "0.0.0.0", function () {
  console.log("Express server listening on:" + port);
});
