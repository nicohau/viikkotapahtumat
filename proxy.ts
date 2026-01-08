import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
	const userAgent = request.headers.get('user-agent') || '';

	// List of common robot/bot patterns to block
	const botPatterns = [/bot/i, /crawl/i, /spider/i, /slurp/i, /mediapartners/i, /googlebot/i, /bingbot/i, /baiduspider/i, /yandex/i, /duckduckbot/i, /facebookexternalhit/i, /twitterbot/i, /linkedinbot/i, /whatsapp/i, /telegrambot/i, /applebot/i, /discordbot/i, /slackbot/i, /semrushbot/i, /ahrefsbot/i, /mj12bot/i, /dotbot/i, /rogerbot/i, /exabot/i, /facebot/i, /ia_archiver/i];

	// Check if the user agent matches any bot pattern
	const isBot = botPatterns.some((pattern) => pattern.test(userAgent));

	if (isBot) {
		// Return 403 Forbidden for bots
		return new NextResponse('Forbidden', { status: 403 });
	}

	// Allow legitimate traffic
	return NextResponse.next();
}

// Configure which routes the middleware applies to
export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api/health (health check endpoints)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		'/((?!_next/static|_next/image|favicon.ico).*)',
	],
};
