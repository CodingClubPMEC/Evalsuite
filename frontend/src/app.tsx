import { Router, Route } from 'preact-router';
import Home from './pages/Home';
import Jury from './pages/Jury';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Organisation from './pages/Organisation';

export function App() {
    return (
        <Router>
            <Route path="/" component={Home} />
            <Route path="/jury" component={Jury} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <Route path="/org" component={Organisation} />
        </Router>
    );
}
