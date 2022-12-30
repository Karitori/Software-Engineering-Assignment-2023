import Note from "./note";
import fs from "fs";
var express = require("express");

const app = express();
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", function (req, res) {
	res.send("Working As Expected");
});

app.post("/createNote", jsonParser, function (req, res) {
	const note = req.body;
	fs.readFile("./data.json", "utf-8", (err, data) => {
		if (err) {
			throw err;
		}
		const notes: Note[] = JSON.parse(data).notes;
		const newNote = new Note(
			req.body.id,
			req.body.title,
			req.body.description,
			new Date(req.body.date),
			req.body.priority
		);
		notes.push(newNote);
		fs.writeFile("./data.json", JSON.stringify({ notes }), "utf-8", (err) => {
			if (err) {
				throw err;
			}
			res.send(newNote);
		});
	});
});

app.get("/readNotes", (req, res) => {
	fs.readFile("./data.json", "utf-8", (err, data) => {
		if (err) {
			throw err;
		}
		const notes: Note[] = JSON.parse(data).notes;
		const date = req.query.date;
		notes.sort((x, y) => {
			if (x[date] < y[date]) {
				return -1;
			}
			if (x[date] > y[date]) {
				return 1;
			}
			return 0;
		});
		res.send(notes);
	});
});

app.get("/readNotes/:id", (req, res) => {
	fs.readFile("./data.json", "utf-8", (err, data) => {
		if (err) {
			throw err;
		}
		const id = Number(req.params.id);
		const notes: Note[] = JSON.parse(data).notes;
		const note = notes.find((obj) => {
			return obj.id === id;
		});
		if (note) {
			res.send(note);
		} else {
			res.sendStatus(404);
		}
	});
});

app.put("/updateNote/:id", (req, res) => {
	fs.readFile("./data.json", "utf-8", (err, data) => {
		if (err) {
			throw err;
		}
		const id = Number(req.params.id);
		const notes: Note[] = JSON.parse(data).notes;

		const noteIndex = notes.findIndex((obj) => {
			obj.id === id;
		});
		if (noteIndex) {
			const updatedNote = new Note(
				req.body.id,
				req.body.title,
				req.body.description,
				new Date(req.body.date),
				req.body.priority
			);
			notes[noteIndex] = updatedNote;
			fs.writeFile("./data.json", JSON.stringify({ notes }), "utf-8", (err) => {
				if (err) {
					throw err;
				}
			});
			res.send(updatedNote);
		} else {
			res.sendStatus(404);
		}
	});
});

app.delete("/deleteNote/:id", (req, res) => {
	fs.readFile("./data.json", "utf-8", (err, data) => {
		if (err) {
			throw err;
		}
		const id = Number(req.params.id);
		const notes: Note[] = JSON.parse(data).notes;

		const noteIndex = notes.findIndex((obj) => {
			obj.id === id;
		});
		if (noteIndex) {
			notes.splice(noteIndex, 1);
			fs.writeFile("./data.json", JSON.stringify({ notes }), "utf-8", (err) => {
				if (err) {
					throw err;
				}
			});
			res.sendStatus(200);
		} else {
			res.sendStatus(404);
		}
	});
});

module.exports = app;
