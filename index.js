var http = require("http");
var path = require("path");
var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");
var request = require('request');

var app = express();

var entries = [];
app.locals.entries = entries;

app.use(logger("dev"));

app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function (req, res) {
    res.render("index");
});

app.get("/new-entry", function (req, res) {
    res.render("new-entry");
});

app.post("/new-entry", function (req, res) {
    var fromUser = "resource:org.hawkoin.network.Student#" + req.body.id;
    var toUser = "resource:org.hawkoin.network.Vendor#" + req.body.vid;
    request.post(
        'http://35.224.160.182:3000/api/org.hawkoin.network.TransferFunds',
        { json: { "$class": "org.hawkoin.network.TransferFunds", "amount": req.body.amt, "authToken": req.body.auth, "fromUser": fromUser, "toUser": toUser} },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body)
            }
        }
    );
    res.redirect("/");
});

app.use(function (req, res) {
    res.status(404).render("404");
});

http.createServer(app).listen(process.env.PORT || 3000, function () {
    console.log("Hawkoin app started.");
});
