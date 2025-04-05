import Link from "next/link";

export default function Page() {
	return (
		<>
			<h1>404 Not Found</h1>
			<p>Sorry, the page you're looking for doesn't exist.</p>
			<Link href='/'>Return home</Link>
		</>
	);
}
