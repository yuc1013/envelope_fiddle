import { LocationProvider, Router, Route, hydrate, prerender as ssr } from 'preact-iso';

import { NotFound } from './pages/_404.jsx';
import './style.css';
import About from './pages/About.js';
import Wallpaper from './components/Wallpaper.js';

const base = import.meta.env.BASE_URL;

export function App() {
	return (
		<LocationProvider>
			<main>
				<Router>
					<Route path={`${base}`} component={About} />
					<Route default component={NotFound} />
				</Router>
			</main>
			<Wallpaper />
		</LocationProvider>
	);
}

if (typeof window !== 'undefined') {
	hydrate(<App />, document.getElementById('app'));
}

export async function prerender(data) {
	return await ssr(<App {...data} />);
}