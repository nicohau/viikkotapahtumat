import type { Metadata } from "next";
import { Kanit, Manrope } from "next/font/google";
import "@/assets/styles/global.css";

const sans_serif = Manrope({
	subsets: ["latin"],
	variable: "--ff-sans-serif",
});

const kanit = Kanit({
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700", "800", "900"],
	variable: "--ff-kanit",
});

export const metadata: Metadata = {
	title: "Story creator - Viikon tapahtumat",
	description: `
	Viikon tapahtumat is a web application that allows users to create an instagtam story with the upcoming weeks events.
	`,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={`${kanit.variable}`}>{children}</body>
		</html>
	);
}
