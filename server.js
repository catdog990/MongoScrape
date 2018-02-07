const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
const axios = require("axios");
const cheerio = require("cheerio");

// Require all models
const db = require("./models");

const PORT = 3000;

// Initialize Express
const app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// By default mongoose uses callbacks for async queries, we're setting it to use promises (.then syntax) instead
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost:27017/mongoScraper", {
  
});


app.get("/scrape", function(req, res) {
  
  axios.get("http://www.espn.com/").then(function(response) {
   
    var $ = cheerio.load(response.data);

   
    $("article.contentItem").each(function(i, element) {
      // Save an empty result object
      var result = [];

      // Add the text and href of every link, and save them as properties of the result object
      // result.title = $(this)
      //   .parent("a")
      //   .text();
      // var title = $(element).find('h1').text();

    //  result.push({
    //    title: title
    //  });
        result.title = $(this)
        .find("h1")
        .text();

        result.summary = $(this)
        .find("p")
        .text();

      result.link = $(this)
        .find("a")
        .attr("href");


      // Create a new Article using the `result` object built from scraping
      // db.Article.create(result)
      //   .then(function(dbArticle) {
      //     // View the added result in the console
      //     console.log(dbArticle);
      //   })
      //   .catch(function(err) {
      //     // If an error occurred, send it to the client
      //     return res.json(err);
      //   });
      console.log(result);
    });

    // If we were able to successfully scrape and save an Article, send a message to the client
    res.send("Scrape Complete");
  });
});


app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});