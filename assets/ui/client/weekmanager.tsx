"use client";
import { useState, useEffect } from "react";
import styles from "@/assets/styles/modules/weekmanager.module.css";

import events from "@/assets/data/events.json";

interface EventFormData {
	id: number;
	name_fi: string;
	name_en?: string;
	location_fi?: string;
	location_en?: string;
	day: number;
	start_time: string;
	end_time?: string;
	signup: boolean;
}

export default function WeekManager({ week }: { week: Date }) {
	const [eventList, setEventList] = useState<EventFormData[]>([]);

	useEffect(() => {
		// Fetch events from the server
		fetch("/api")
			.then((response) => response.json())
			.then((data) => {
				setEventList(data);
			})
			.catch((error) => {
				console.error("Error fetching events:", error);
			});
	}, []);

	return (
		<div className={styles.weekmanager}>
			<WeekForm
				setEventList={setEventList}
				week={week}
			/>
			<WeekList
				eventList={eventList}
				setEventList={setEventList}
				week={week}
			/>
		</div>
	);
}

function WeekList({
	eventList,
	setEventList,
	week,
}: {
	eventList: EventFormData[];
	setEventList: React.Dispatch<React.SetStateAction<EventFormData[]>>;
	week: Date;
}) {
	const [editMode, setEditMode] = useState(false);
	const [lang, setLang] = useState("fi");
	const [editEvent, setEditEvent] = useState<number | null>(null);

	return (
		<div className={styles.weeklist}>
			<div>
				<button
					className={styles.manage_button}
					onClick={() => setEditMode(!editMode)}>
					{editMode ? "Valmis" : "Muokkaa"}
				</button>
				<button
					className={styles.manage_button}
					onClick={() => {
						// Change lantuage
						if (lang === "fi") {
							setLang("en");
						} else {
							setLang("fi");
						}
					}}>
					{lang === "fi" ? "FI / en" : "EN / fi"}
				</button>
				{editMode && (
					<button
						className={`${styles.manage_button} ${styles.delete_all}`}
						onClick={() => {
							// Clear all events
							if (confirm("Haluatko varmasti poistaa kaikki tapahtumat?")) {
								fetch("/api", {
									method: "DELETE",
									headers: {
										"Content-Type": "application/json",
									},
								})
									.then((response) => response.json())
									.then((data) => {
										console.log("Events deleted:", data);
									})
									.catch((error) => {
										console.error("Error deleting events:", error);
									});
								setEventList([]);
								setEditMode(!editMode);
							}
						}}>
						Poista kaikki tapahtumat
					</button>
				)}
			</div>
			{Object.entries(
				eventList.reduce((acc, event) => {
					(acc[event.day] = acc[event.day] || []).push(event);
					return acc;
				}, {} as Record<number, EventFormData[]>)
			)
				// Convert the grouped events into an array for rendering
				.sort(([dayA], [dayB]) => parseInt(dayA) - parseInt(dayB))
				.map(([day, events]) => (
					<p
						key={day}
						className={styles.dayGroup}>
						<strong>
							{lang === "fi"
								? [
										"Maanantai",
										"Tiistai",
										"Keskiviikko",
										"Torstai",
										"Perjantai",
										"Lauantai",
										"Sunnuntai",
								  ][parseInt(day)]
								: [
										"Monday",
										"Tuesday",
										"Wednesday",
										"Thursday",
										"Friday",
										"Saturday",
										"Sunday",
								  ][parseInt(day)]}{" "}
							{/* week, is the first day of the selected week. corresponding to day 0 */}
							{new Date(
								week.getTime() + parseInt(day) * 24 * 60 * 60 * 1000
							).toLocaleDateString("fi-FI", {
								day: "numeric",
								month: "numeric",
							})}
						</strong>
						{events
							.sort((a, b) => {
								const aTime = new Date(`1970-01-01T${a.start_time}:00`).getTime();
								const bTime = new Date(`1970-01-01T${b.start_time}:00`).getTime();
								return aTime - bTime;
							})
							.map((event) => (
								<>
									<br />
									<span key={event.id}>
										{lang === "fi"
											? event.name_fi
											: event.name_en || event.name_fi}
										,{" "}
										<em>
											{`${event.start_time}${
												event.end_time ? `→${event.end_time}` : ""
											}`}
											{event.location_fi
												? ` @${
														lang === "fi"
															? event.location_fi
															: event.location_en || event.location_fi
												  }`
												: ""}
										</em>{" "}
										{event.signup
											? lang === "fi"
												? "(Ilmoittautuneille)"
												: "(Signed up only)"
											: ""}
									</span>
									{editMode && (
										<>
											<button
												className={styles.editButton}
												onClick={() => setEditEvent(event.id)}>
												Muokkaa
											</button>
											<button
												className={styles.deleteButton}
												onClick={() => {
													const updatedEvents = eventList.filter(
														(e) => e.id !== event.id
													);
													// Removing event from file with api call
													fetch("/api/" + event.id, {
														method: "DELETE",
														headers: {
															"Content-Type": "application/json",
														},
													})
														.then((response) => response.json())
														.then((data) => {
															console.log("Event deleted:", data);
														})
														.catch((error) => {
															console.error(
																"Error deleting event:",
																error
															);
														});
													setEventList(updatedEvents);
												}}>
												Poista
											</button>
											{editEvent === event.id && (
												<div className={styles.editForm}>
													<EventEditForm
														event={event}
														setEventList={setEventList}
														onClose={() => setEditEvent(null)}
													/>
												</div>
											)}
										</>
									)}
								</>
							))}
					</p>
				))}
		</div>
	);
}

function EventEditForm({
	event,
	setEventList,
	onClose,
}: {
	event: EventFormData;
	setEventList: React.Dispatch<React.SetStateAction<EventFormData[]>>;
	onClose: () => void;
}) {
	const [formData, setFormData] = useState<EventFormData>({ ...event });

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value, type } = e.target;
		const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// Update event data
		setEventList((prevEvents) => {
			const updatedEvents = [...prevEvents, event];
			return updatedEvents;
		});

		// Sending event to api
		fetch("/api", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(event),
		})
			.then((response) => response.json())
			.then((data) => {
				console.log("Event added:", data);
			})
			.catch((error) => {
				console.error("Error adding event:", error);
			});

		onClose();
	};

	return (
		<form
			onSubmit={handleSubmit}
			className={styles.edit_form}>
			<div className={styles.form_row}>
				<div className={styles.form_group}>
					<label htmlFor='edit_name_fi'>Nimi (fi):</label>
					<input
						type='text'
						id='edit_name_fi'
						name='name_fi'
						value={formData.name_fi}
						onChange={handleChange}
						required
					/>
				</div>
				<div className={styles.form_group}>
					<label htmlFor='edit_name_en'>Nimi (en):</label>
					<input
						type='text'
						id='edit_name_en'
						name='name_en'
						value={formData.name_en || ""}
						onChange={handleChange}
					/>
				</div>
			</div>
			<div className={styles.form_row}>
				<div className={styles.form_group}>
					<label htmlFor='edit_location_fi'>Sijainti (fi):</label>
					<input
						type='text'
						id='edit_location_fi'
						name='location_fi'
						value={formData.location_fi || ""}
						onChange={handleChange}
					/>
				</div>
				<div className={styles.form_group}>
					<label htmlFor='edit_location_en'>Sijainti (en):</label>
					<input
						type='text'
						id='edit_location_en'
						name='location_en'
						value={formData.location_en || ""}
						onChange={handleChange}
					/>
				</div>
			</div>
			<div className={styles.form_row}>
				<div className={styles.form_group}>
					<label htmlFor='edit_day'>Päivä:</label>
					<select
						name='day'
						id='edit_day'
						value={formData.day}
						onChange={handleChange}>
						{[0, 1, 2, 3, 4, 5, 6].map((day) => (
							<option
								key={day}
								value={day}>
								{
									[
										"Maanantai",
										"Tiistai",
										"Keskiviikko",
										"Torstai",
										"Perjantai",
										"Lauantai",
										"Sunnuntai",
									][day]
								}
							</option>
						))}
					</select>
				</div>
				<div className={styles.form_group}>
					<label htmlFor='edit_start_time'>Alkaa:</label>
					<input
						type='time'
						id='edit_start_time'
						name='start_time'
						value={formData.start_time}
						onChange={handleChange}
						required
					/>
				</div>
			</div>
			<div className={styles.form_row}>
				<div className={styles.form_group}>
					<label htmlFor='edit_end_time'>Loppuu:</label>
					<input
						type='time'
						id='edit_end_time'
						name='end_time'
						value={formData.end_time || ""}
						onChange={handleChange}
					/>
				</div>
				<div className={styles.form_group}>
					<label htmlFor='edit_signup'>Ilmoittautuneille:</label>
					<input
						type='checkbox'
						id='edit_signup'
						name='signup'
						checked={formData.signup}
						onChange={handleChange}
					/>
				</div>
			</div>
			<div className={styles.form_buttons}>
				<button type='submit'>Tallenna</button>
				<button
					type='button'
					className={styles.cancel}
					onClick={onClose}>
					Peruuta
				</button>
			</div>
		</form>
	);
}

function WeekForm({
	week,
	setEventList,
}: {
	week: Date;
	setEventList: React.Dispatch<React.SetStateAction<EventFormData[]>>;
}) {
	// Add event to local storage
	const addEvent = (event: EventFormData) => {
		setEventList((prevEvents) => {
			const updatedEvents = [...prevEvents, event];
			return updatedEvents;
		});

		// Sending event to api
		fetch("/api", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(event),
		})
			.then((response) => response.json())
			.then((data) => {
				console.log("Event added:", data);
			})
			.catch((error) => {
				console.error("Error adding event:", error);
			});
	};

	// Handle form submission
	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = event.currentTarget;
		const data: EventFormData = {
			id: Date.now(),
			name_fi: formData.name_fi.value,
			name_en: formData.name_en.value,
			location_fi: formData.location_fi.value,
			location_en: formData.location_en.value,
			day: parseInt(formData.start_day.value),
			start_time: formData.start_time.value,
			end_time: formData.end_time.value,
			signup: formData.signup.checked,
		};
		console.log(data);

		// Add event to local storage
		addEvent(data);

		// Reset form
		event.currentTarget.reset();
	};

	return (
		<form
			onSubmit={handleSubmit}
			className={styles.event_form}>
			<div className={`${styles.form_row}`}>
				<div className={styles.form_group}>
					<label htmlFor='name_fi'>Nimi (fi):</label>
					<input
						type='text'
						id='name_fi'
						name='name_fi'
						required
					/>
				</div>
				<div className={styles.form_group}>
					<label htmlFor='name_en'>Nimi (en):</label>
					<input
						type='text'
						id='name_en'
						name='name_en'
					/>
				</div>
			</div>
			<div className={`${styles.form_row}`}>
				<div className={styles.form_group}>
					<label htmlFor='location_fi'>Sijainti (fi):</label>
					<input
						type='text'
						id='location_fi'
						name='location_fi'
					/>
				</div>
				<div className={styles.form_group}>
					<label htmlFor='location_en'>Sijainti (en):</label>
					<input
						type='text'
						id='location_en'
						name='location_en'
					/>
				</div>
			</div>
			<div className={`${styles.form_row}`}>
				<div className={styles.form_group}>
					<label htmlFor='start_day'>Päivä:</label>
					<select
						name='start_day'
						id='start_day'>
						{[0, 1, 2, 3, 4, 5, 6].map((day) => (
							<option
								key={day}
								value={day}>
								{
									[
										"Maanantai",
										"Tiistai",
										"Keskiviikko",
										"Torstai",
										"Perjantai",
										"Lauantai",
										"Sunnuntai",
									][day]
								}{" "}
								{new Date(
									week.getTime() + day * 24 * 60 * 60 * 1000
								).toLocaleDateString("fi-FI", {
									day: "numeric",
									month: "numeric",
								})}
							</option>
						))}
					</select>
				</div>
				<div className={styles.form_group}>
					<label htmlFor='start_time'>Alkaa:</label>
					<input
						type='time'
						id='start_time'
						name='start_time'
						required
					/>
				</div>
			</div>
			<div className={`${styles.form_row}`}>
				<div className={styles.form_group}>
					<label htmlFor='end_time'>Loppuu:</label>
					<input
						type='time'
						id='end_time'
						name='end_time'
					/>
				</div>
				<div className={styles.form_group}>
					<label htmlFor='signup'>Ilmoittautuneille:</label>
					<input
						type='checkbox'
						id='signup'
						name='signup'
					/>
				</div>
			</div>
			<button type='submit'>Tallenna tapahtuma</button>
		</form>
	);
}

// Based on Youp Bernoulli's code on https://stackoverflow.com/a/6117889 Thanks! <3
export function getWeekNumber(date: Date): number {
	const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
	const dayNum = d.getUTCDay() || 7;
	d.setUTCDate(d.getUTCDate() + 4 - dayNum);
	const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
	return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}
