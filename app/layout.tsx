import type { Metadata } from 'next';
import { Nunito_Sans } from 'next/font/google';
import '@/assets/styles/global.css';

const nunito_sans = Nunito_Sans({
	subsets: ['latin'],
	weight: ['200', '300', '400', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
	title: '* Tapahtuma masiina',
	description: '* Tapahtuma masiina',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={`${nunito_sans.className}`}>{children}</body>
		</html>
	);
}
