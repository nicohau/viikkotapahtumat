'use client';
import { useState } from 'react';
import styles from '@/assets/styles/modules/main.module.css';
import WeekManager from '@/assets/ui/client/weekmanager';
import { getWeekNumber } from '@/assets/ui/client/weekmanager';

export default function Page() {
	// Getting next monday
	let nextMonday = new Date();
	nextMonday.setDate(new Date().getDate() + ((8 - new Date().getDay()) % 7));

	// Defaults to next monday
	const [week, setWeek] = useState<Date>(nextMonday);

	return (
		<>
			<header className={styles.header}>
				<div className={`${styles.centerer}`}>
					<h1 className={styles.title}>* Tapahtuma masiina</h1>
					<WeekDisplay
						week={week}
						setWeek={setWeek}
					/>
				</div>
			</header>
			<main className={styles.main}>
				<div className={`${styles.centerer}`}>
					<WeekManager week={week} />
				</div>
			</main>
		</>
	);
}

const WeekDisplay = ({ week, setWeek }: { week: Date; setWeek: (date: Date) => void }) => {
	const [modalOpen, setModalOpen] = useState(false);

	return (
		<>
			<div
				onClick={() => setModalOpen(true)}
				className={styles.week_container}>
				<p className={styles.week}>
					Viikko
					<span>{getWeekNumber(week)}</span>
				</p>
				<p className={styles.week_date}>
					{week.toLocaleDateString('fi-FI', {
						month: '2-digit',
						day: '2-digit',
					})}
					{' - '}
					{new Date(week.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('fi-FI', {
						month: '2-digit',
						day: '2-digit',
					})}
				</p>
			</div>
			{modalOpen && (
				<div className={styles.week_modal}>
					<div
						onClick={() => setModalOpen(false)}
						className={styles.week_modal__background}
					/>
					<div className={`${styles.week_modal__content}`}>
						<h2>Vaihda viikkoa</h2>
						<p>Valitse jokin päivä ja järjestelmä asettaa automaattisesti päivämäärän sen viikon maanantaille.</p>
						<div className={`${styles.input_wrapper}`}>
							<input
								type='date'
								value={week.toISOString().split('T')[0]}
								onChange={(e) =>
									// Since the user can select a date that is not a monday, we need to set the week to the monday of that week
									setWeek(new Date(new Date(e.target.value).getTime() + (1 - new Date(e.target.value).getDay()) * 24 * 60 * 60 * 1000))
								}
							/>
							<div className={`${styles.input_week}`}>vko {getWeekNumber(week)}</div>
						</div>
						<button onClick={() => setModalOpen(false)}>Jatka</button>
					</div>
				</div>
			)}
		</>
	);
};
