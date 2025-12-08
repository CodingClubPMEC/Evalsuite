import { useState } from 'preact/hooks';
import { route } from 'preact-router';
import { auth } from '../store/auth';
import { Button, Card } from '../components/ui';
import { Hexagon, Lock, Mail, Loader2 } from 'lucide-preact';

export default function Login() {
    const [email, setEmail] = useState('judge@evalsuite.com'); // Default for easy testing
    const [password, setPassword] = useState('judge123'); // Default for easy testing
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const user = await auth.login(email, password);
            if (user.type === 'admin') route('/org');
            else route('/jury');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid items-center justify-center bg-zinc-50 p-4">
            <Card className="w-full max-w-md p-8 space-y-8 bg-white shadow-xl border-zinc-200">
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-black text-white mb-4">
                        <Hexagon size={24} fill="white" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
                    <p className="text-zinc-500 text-sm">Enter your credentials to access the portal</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 text-zinc-400" size={18} />
                            <input
                                type="email"
                                required
                                value={email}
                                onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
                                className="w-full pl-10 h-10 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 text-zinc-400" size={18} />
                            <input
                                type="password"
                                required
                                value={password}
                                onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
                                className="w-full pl-10 h-10 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {error && <div className="text-red-500 text-xs font-medium bg-red-50 p-3 rounded-md">{error}</div>}

                    <Button className="w-full h-11 text-base" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                        {loading ? 'Signing in...' : 'Sign in'}
                    </Button>
                </form>

                <div className="text-center text-xs text-zinc-500">
                    Did you know? You can use <br />
                    <code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-700">admin@evalsuite.com</code> / <code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-700">admin123</code>
                    <br />or<br />
                    <code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-700">judge@eval.com</code> / <code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-700">123</code>
                </div>

                <div className="text-center pt-2 border-t border-zinc-100">
                    <p className="text-sm text-muted">Don't have an account? <span onClick={() => route('/signup')} className="text-black font-semibold cursor-pointer hover:underline">Sign up</span></p>
                </div>
            </Card>
        </div>
    );
}
