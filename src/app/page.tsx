import HomePageClient, { type NotificationType } from '../assets/components/homePageClient';

const KAIKU_NOTIFICATIONS_URL = 'https://kaiku.nitaco.dev/api/notifications?appid=viikkis';

async function getInitialNotifications(): Promise<NotificationType[]> {
	try {
		const response = await fetch(KAIKU_NOTIFICATIONS_URL, {
			cache: 'no-store',
		});

		if (!response.ok) {
			return [];
		}

		const data: { notifications?: NotificationType[] } = await response.json();
		return Array.isArray(data.notifications) ? data.notifications : [];
	} catch (error) {
		console.error('Failed to fetch notifications at page load', error);
		return [];
	}
}

export default async function Page() {
	const initialNotifications = await getInitialNotifications();
	return <HomePageClient initialNotifications={initialNotifications} />;
}
