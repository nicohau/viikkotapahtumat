import styles from '@/assets/styles/modules/notfound.module.css';
import Link from 'next/link';

export default function NotFound() {
	return (
		<div className={styles.wrapper}>
			<h1>Löysit sivun, jota ei ole olemassa!</h1>
			<p>Etsimääsi sisältöä ei löytynyt. Palaa etusivulle ja kokeile uudelleen!</p>
			<Link href='/' className={styles.button}>
				<span>Palaa etusivulle</span>
			</Link>
		</div>
	);
}
