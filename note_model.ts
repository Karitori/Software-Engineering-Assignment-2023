class Note {
	id: number;
	title: string;
	description: string;
	date: Date;
	priority: string;

	constructor(
		id: number,
		title: string,
		description: string,
		date: Date,
		priority: string
	) {
		this.id = id;
		this.title = title;
		this.description = description;
		this.date = date;
		this.priority = priority;
	}
}
export = Note;