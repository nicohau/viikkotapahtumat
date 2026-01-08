import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Common bot user agents to block
const BOT_USER_AGENTS = ['googlebot', 'bingbot', 'slurp', 'facebookexternalhit', 'twitterbot', 'linkedinbot', 'whatsapp', 'telegrambot', 'applebot', 'baiduspider', 'yandexbot', 'duckduckbot', 'semrushbot', 'ahrefsbot', 'mj12bot', 'dotbot', 'rogerbot', 'exabot', 'facebot', 'ia_archiver', 'archive.org_bot', 'wget', 'curl'];

export function middleware(req: NextRequest) {
	// Block known crawlers and bots
	const userAgent = req.headers.get('user-agent')?.toLowerCase() || '';
	const isBot = BOT_USER_AGENTS.some((bot) => userAgent.includes(bot));

	if (isBot) {
		return new NextResponse('Access Denied', {
			status: 403,
			headers: {
				'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet, noimageindex',
			},
		});
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		'/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
		// Always run for API routes
		'/(api|trpc)(.*)',
	],
};
