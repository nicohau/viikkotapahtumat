import type { Metadata } from 'next';
import { Nunito_Sans } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import '@/assets/styles/global.css';

const nunito_sans = Nunito_Sans({
	subsets: ['latin'],
	weight: ['200', '300', '400', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
	title: '* Tapahtuma masiina',
	description: '* Tapahtuma masiina',
	robots: {
		index: false,
		follow: false,
		nocache: true,
		googleBot: {
			'index': false,
			'follow': false,
			'noimageindex': true,
			'max-video-preview': -1,
			'max-image-preview': 'none',
			'max-snippet': -1,
		},
	},
	other: {
		'revisit-after': 'never',
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<head>
				{/* Additional anti-indexing meta tags */}
				<meta
					name='robots'
					content='noindex, nofollow, noarchive, nosnippet, noimageindex, nocache'
				/>
				<meta
					name='googlebot'
					content='noindex, nofollow, noarchive, nosnippet, noimageindex'
				/>
				<meta
					name='bingbot'
					content='noindex, nofollow, noarchive, nosnippet, noimageindex'
				/>
				<meta
					name='slurp'
					content='noindex, nofollow, noarchive, nosnippet, noimageindex'
				/>
				<meta
					name='msnbot'
					content='noindex, nofollow, noarchive, nosnippet, noimageindex'
				/>
				<meta
					name='teoma'
					content='noindex, nofollow, noarchive, nosnippet, noimageindex'
				/>
				<meta
					name='ia_archiver'
					content='noindex, nofollow, noarchive, nosnippet, noimageindex'
				/>
				<meta
					name='crawl-control'
					content='no-crawl'
				/>
				<meta
					name='referrer'
					content='no-referrer'
				/>
			</head>
			<body className={`${nunito_sans.className}`}>
			{children}
			<Analytics />
		</body>
		</html>
	);
}
