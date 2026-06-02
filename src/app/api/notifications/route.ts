import { NextResponse } from 'next/server';

const KAIKU_NOTIFICATIONS_URL = 'https://kaiku.nitaco.dev/api/notifications?appid=viikkis';

export const dynamic = 'force-dynamic';

export async function GET() {
	try {
		const response = await fetch(KAIKU_NOTIFICATIONS_URL, {
			headers: {
				accept: 'application/json',
			},
			cache: 'no-store',
		});

		if (!response.ok) {
			return NextResponse.json(
				{
					error: `Failed to load notifications from Kaiku (status ${response.status})`,
				},
				{ status: response.status }
			);
		}

		const data: unknown = await response.json();
		return NextResponse.json(data, {
			headers: {
				'Cache-Control': 'no-store, max-age=0',
			},
		});
	} catch (error) {
		console.error('Notifications proxy failed', error);
		return NextResponse.json(
			{
				error: 'Failed to load notifications from Kaiku',
			},
			{ status: 502 }
		);
	}
}
