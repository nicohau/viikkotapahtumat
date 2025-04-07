import { NextResponse } from "next/server";
import fs from "fs";

const eventsFilePath = process.cwd() + "/assets/data/events.json";

export async function GET() {
	try {
		const data = fs.readFileSync(eventsFilePath, "utf-8");
		const events = JSON.parse(data);
		return NextResponse.json(events);
	} catch (error) {
		return NextResponse.json({ error: "Failed to read events data" }, { status: 500 });
	}
}

export async function POST(request: Request) {
	const body = await request.json();
	const { id, ...eventData } = body;
	const data = fs.readFileSync(eventsFilePath, "utf-8");
	try {
		const events = JSON.parse(data);

		const eventIndex = events.findIndex((event: any) => event.id === id);

		if (eventIndex !== -1) {
			// Update existing event
			events[eventIndex] = { id, ...eventData };
		} else {
			// Add new event
			events.push({ id, ...eventData });
		}

		fs.writeFileSync(eventsFilePath, JSON.stringify(events, null, 2), "utf-8");

		return NextResponse.json({ message: "Event saved successfully" });
	} catch (error) {
		return NextResponse.json({ error: "Failed to save event data" }, { status: 500 });
	}
}

export async function DELETE() {
	try {
		fs.writeFileSync(eventsFilePath, JSON.stringify([], null, 2), "utf-8");
		return NextResponse.json({ message: "All events deleted successfully" });
	} catch (error) {
		return NextResponse.json({ error: "Failed to delete events data" }, { status: 500 });
	}
}
