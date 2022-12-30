//importing the Note class
import Note from "./note_model";
//importing the filesystem library
import fs from "fs";
//importing the express library
import express from "express";

//Using Express and the body parser middleware to parse requests into JSON.
const app = express();
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//An initial endpoint to check if the app is working
app.get("/", function (req, res) {
	res.send("Working As Expected");
});

//The first of the CRUD endpoints. The endpoint takes a JSON object of type Note and adds it to the JSON file.
app.post("/createNote", jsonParser, function (req, res) {
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

//The second of the CRUD endpoints. The endpoint doesn't take any parameters. It returns a sorted list of notes based on priority from high to low
app.get("/readNotes", (req, res) => {
	fs.readFile("./data.json", "utf-8", (err, data) => {
		if (err) {
			throw err;
		}
		const notes: Note[] = JSON.parse(data).notes;
		notes.sort((x, y) => {
			var priorityX;
			var priorityY;
			if (x.priority === "low") {
				priorityX = 0;
			} else if (x.priority === "medium") {
				priorityX = 1;
			} else if (x.priority === "high") {
				priorityX = 2;
			}

			if (y.priority === "low") {
				priorityY = 0;
			} else if (y.priority === "medium") {
				priorityY = 1;
			} else if (y.priority === "high") {
				priorityY = 2;
			}

			if (priorityX > priorityY) {
				return -1;
			}
			if (priorityX < priorityY) {
				return 1;
			}
			return 0;
		});
		res.send(notes);
	});
});

//The second read of the CRUD operations. It takes an ID and returns the note of the said ID.
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

//The third of the CRUD endpoints. This endpoints recieves both an ID and a JSON. It searches for the note with the given ID and updates it.
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

//The fourth and last of the CRUD endpoints. This endpoint take an ID and deletes the note of said ID.
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
