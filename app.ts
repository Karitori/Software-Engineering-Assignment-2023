import express from 'express';
import Note from "./note_model";
var data = require("./data.json")

const app = express();
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
// var urlencodedParser = bodyParser.urlencoded({ extended: false });




app.get("/", function (req, res) {
	res.send("Working As Expected");
});

app.post("/createNote", jsonParser, function (req, res) {
	const note = req.body;
	data.writeFile(note)
	console.log(note);
	res.send("done");
});

module.exports = app;
