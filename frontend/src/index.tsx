import { render } from 'preact';
import { LocationProvider, Router, Route } from 'preact-iso';

import './global.css';
import Home from "./pages/Home";
import Login from './pages/Login';
import Signup from './pages/Signup';
import Organisation from './pages/Organisation';
import Jury from './pages/Jury';

export function App() {
	return (
		<LocationProvider>
			<main>
				<Router>
					<Route path="/home" component={Home} />
					<Route path="/login" component={Login} />
					<Route path="/signup" component={Signup} />
					<Route path="/:organisation" component={Organisation} />
					<Route path="/:jury" component={Jury} />
				</Router>
			</main>
		</LocationProvider>
	);
}

render(<App />, document.getElementById('app'));
