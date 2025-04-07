import { NextResponse } from "next/server";
import fs from "fs";

const eventsFilePath = process.cwd() + "/assets/data/events.json";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
	const data = fs.readFileSync(eventsFilePath, "utf-8");
	const events = JSON.parse(data);
	try {
		const id = (await params).id;

		if (!id) {
			return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
		}

		const updatedEvents = events.filter((event: any) => event.id !== parseInt(id));

		if (updatedEvents.length === events.length) {
			return NextResponse.json({ error: "Event not found" }, { status: 404 });
		}

		fs.writeFileSync(eventsFilePath, JSON.stringify(updatedEvents, null, 2), "utf-8");

		return NextResponse.json({ message: "Event deleted successfully" });
	} catch (error) {
		return NextResponse.json({ error: "Failed to delete event data" }, { status: 500 });
	}
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
	const data = fs.readFileSync(eventsFilePath, "utf-8");
	const events = JSON.parse(data);
	try {
		// Updating data for the selected event based on the id
		const id = (await params).id;
		const body = await request.json();
		const { ...eventData } = body;

		if (!id) {
			return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
		}

		const eventIndex = events.findIndex((event: any) => event.id === parseInt(id));
		if (eventIndex === -1) {
			return NextResponse.json({ error: "Event not found" }, { status: 404 });
		}
		events[eventIndex] = { ...events[eventIndex], ...eventData };

		// Updating the event data
		fs.writeFileSync(eventsFilePath, JSON.stringify(events, null, 2), "utf-8");

		return NextResponse.json({ message: "Event saved successfully" });
	} catch (error) {
		return NextResponse.json({ error: "Failed to save event data" }, { status: 500 });
	}
}
