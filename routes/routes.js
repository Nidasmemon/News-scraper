const db = require("../models");
// Require scraping tools
var axios = require("axios");
var cheerio = require("cheerio");
function routes(app) {
    // Routes

    app.get("/", function (req, res) {

        db.Article.find({}).then(function (data) {

            console.log(data);

            var newData = []

            for (var i = 0; i < data.length; i++) {
                newData.push({
                    _id: data[i]._id,
                    title: data[i].title,
                    description: data[i].description,
                    image: data[i].image,
                    link: data[i].link
                })
            }
            res.render("articles", { articles: newData })
        })
    })

    app.get("/saved", function (req, res) {

        db.Article.find({ saved: true }).then(function (data) {

            console.log(data);

            var newData = []

            for (var i = 0; i < data.length; i++) {
                newData.push({
                    _id: data[i]._id,
                    title: data[i].title,
                    description: data[i].description,
                    image: data[i].image,
                    link: data[i].link
                })
            }
            res.render("savedArticles", { articles: newData })
        })
    })


    // A GET route for scraping the Mercury News website
    app.get("/scrape", function (req, res) {
        db.Article.remove({});
        // First, we grab the body of the html with axios
        axios.get("https://www.mercurynews.com/").then(function (response) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(response.data);

            // Now, we grab every h5 within the figure, and do the following:
            $("figure").each(function (i, element) {
                // Save an empty result object
                var result = {};

                // Add the text, summary, image, and href of every link, and save them as properties of the result object
                result.title = $(this).children("a").attr("title");
                result.description = $(this).children("a").children("div").children("img").attr("alt");
                result.image = $(this).children("a").children("div").children("img").attr("data-srcset");
                result.link = $(this).children("a").attr("href");
                // console.log("-------------");
                // console.log(result);
                // console.log("-------------");

                // Create a new Article using the `result` object built from scraping
                db.Article.create(result)
                    .then(function (dbArticle) {
                        // View the added result in the console
                        console.log(dbArticle);
                    })
                    .catch(function (err) {
                        // If an error occurred, log it
                        console.log(err);
                    });
            });

            // Send a message to the client
            res.send("Scrape Complete");
        });
    });


    // Route for getting all Articles from the db
    app.get("/articles", function (req, res) {
        // Grab every document in the Articles collection
        db.Article.find({})
            .then(function (dbArticle) {
                // If we were able to successfully find Articles, send them back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    // Route for grabbing a specific Article by id, populate it with it's note
    app.get("/articles/:id", function (req, res) {
        // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
        db.Article.findOne({ _id: req.params.id })
            // ...and populate all of the notes associated with it
            .populate("note")
            .then(function (dbArticle) {
                // If we were able to successfully find an Article with the given id, send it back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });


    // Route for saving/updating an Article's associated Note
    app.post("/articles/:id", function (req, res) {
        // Create a new note and pass the req.body to the entry
        db.Note.create(req.body)
            .then(function (dbNote) {
                // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
                // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
                // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
                return db.Article.findOneAndUpdate(
                    { _id: req.params.id },
                    { note: dbNote._id },
                    { new: true }
                );
            })
            .then(function (dbArticle) {
                // If we were able to successfully update an Article, send it back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });


    app.put("/api/articles/:id", function (req, res) {
        db.Article.findOneAndUpdate({ _id: req.params.id }, { $set: { saved: true } }, { new: true }, function (err, data) {
            res.json(data);
        });
    })

    app.post("/api/articles/delete/:id", function (req, res) {
        db.Article.findOneAndUpdate({ _id: req.params.id }, { $set: { saved: false } }, function (err, data) {
            res.send(data);
        });
    })

    app.delete("/delete", function (req, res) {
        db.Article.deleteMany({ saved: false }, function (err) {
            res.send(err);
        })
    })
}

module.exports = routes;
