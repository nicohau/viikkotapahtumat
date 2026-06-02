'use client';

import { useEffect, useState } from 'react';
import styles from '@/assets/styles/modules/main.module.css';
import WeekManager from '@/assets/components/weekmanager';
import { getWeekNumber } from '@/assets/components/weekNumber';

export interface NotificationType {
	id: string;
	visibility: {
		begin: string;
		end: string;
		status: 'RELEASE' | 'DRAFT' | 'ARCHIVED';
		hidden?: boolean;
		severity: 0 | 1 | 2;
	};
	content: {
		title: string;
		message: string;
	};
	tasks: {
		dismissable: boolean;
		showOnce: boolean;
	};
}

const NOTIFICATIONS_URL = '/api/notifications';
const NOTIFICATIONS_REFRESH_MS = 60 * 1000;

export default function HomePageClient({ initialNotifications }: { initialNotifications: NotificationType[] }) {
	// Getting next monday
	const [week, setWeek] = useState<Date>(() => {
		const nextMonday = new Date();
		nextMonday.setDate(new Date().getDate() + ((8 - new Date().getDay()) % 7));
		return nextMonday;
	});

	return (
		<>
			<header className={styles.header}>
				<div className={`${styles.centerer}`}>
					<h1 className={styles.title}>Viikkis</h1>
					<WeekDisplay week={week} setWeek={setWeek} />
				</div>
			</header>
			<main className={styles.main}>
				<div className={`${styles.centerer}`}>
					<Notifications initialNotifications={initialNotifications} />
					<WeekManager week={week} />
				</div>
			</main>
		</>
	);
}

const Notifications = ({ initialNotifications }: { initialNotifications: NotificationType[] }) => {
	const [notifications, setNotifications] = useState<NotificationType[]>(initialNotifications);

	useEffect(() => {
		let isDisposed = false;

		const fetchNotifications = async () => {
			try {
				const response = await fetch(NOTIFICATIONS_URL, { cache: 'no-store' });
				if (!response.ok) {
					throw new Error(`Notification fetch failed with status ${response.status}`);
				}

				const data: { notifications?: NotificationType[] } = await response.json();
				if (!isDisposed) {
					setNotifications(Array.isArray(data.notifications) ? data.notifications : []);
				}
			} catch (error) {
				console.error('Failed to fetch notifications', error);
			}
		};

		const intervalId = window.setInterval(fetchNotifications, NOTIFICATIONS_REFRESH_MS);

		return () => {
			isDisposed = true;
			window.clearInterval(intervalId);
		};
	}, []);

	if (notifications.length === 0) {
		return null;
	}

	return (
		<section className={styles.notifications_wrapper}>
			{notifications.map((n) => (
				<div key={n.id} className={`${styles.notification}${n.visibility.severity === 1 ? ' ' + styles.notice : n.visibility.severity === 2 ? ' ' + styles.warning : ''}`}>
					<h3>{n.content.title}</h3>
					<p>
						{n.content.message.split(/(\[.*?\]\(.*?\))/g).map((part, i) => {
							const match = part.match(/\[(.*?)\]\((.*?)\)/);
							return match ? (
								<a key={i} href={match[2]} target='_blank' rel='noopener noreferrer'>
									{match[1]}
								</a>
							) : (
								part
							);
						})}
					</p>
				</div>
			))}
		</section>
	);
};

const WeekDisplay = ({ week, setWeek }: { week: Date; setWeek: (date: Date) => void }) => {
	const [modalOpen, setModalOpen] = useState(false);

	return (
		<>
			<div onClick={() => setModalOpen(true)} className={styles.week_container}>
				<p className={styles.week}>
					Viikko
					<span>{getWeekNumber(week)}</span>
				</p>
				<p className={styles.week_date}>
					{week.toLocaleDateString('fi-FI', {
						month: 'numeric',
						day: 'numeric',
					})}
					{' → '}
					{new Date(week.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('fi-FI', {
						month: 'numeric',
						day: 'numeric',
					})}
				</p>
			</div>
			{modalOpen && (
				<div className={styles.week_modal}>
					<div onClick={() => setModalOpen(false)} className={styles.week_modal__background} />
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
