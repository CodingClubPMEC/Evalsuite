import { route } from 'preact-router';
import { Button, Badge } from '../components/ui';
import { ArrowRight, Hexagon, Shield, Users, CheckCircle } from 'lucide-preact';

export default function Home() {
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="border-b border-border sticky top-0 bg-white/80 backdrop-blur z-10">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                        <div className="bg-black text-white p-1 rounded-md"><Hexagon size={20} fill="white" /></div>
                        Evalsuite.
                    </div>
                    <div className="flex gap-4">
                        <Button variant="ghost" onClick={() => route('/login')}>Login</Button>
                        <Button onClick={() => route('/signup')}>Sign Up</Button>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <main className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
                <div className="flex flex-col items-center text-center space-y-8 mb-24">
                    <Badge variant="secondary" className="px-4 py-1.5 text-sm font-medium">PMEC Internal Hackathon 2025</Badge>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 max-w-4xl">
                        Streamlined Evaluation for <span className="text-zinc-500">Modern Hackathons.</span>
                    </h1>
                    <p className="text-zinc-500 max-w-2xl text-lg md:text-xl leading-relaxed">
                        The centralized platform for jury members to evaluate teams, track criteria, and submit scores securely.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Button size="lg" className="h-12 px-8 text-base" onClick={() => route('/login')}>
                            Start Evaluation <ArrowRight className="ml-2" size={18} />
                        </Button>
                        <Button size="lg" variant="outline" className="h-12 px-8 text-base" onClick={() => route('/signup')}>
                            Register as Judge
                        </Button>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { icon: Shield, title: "Secure Authentication", desc: "Role-based access ensure only verified judges can submit scores." },
                        { icon: Users, title: "Team Management", desc: "View all participating teams and their project details in one place." },
                        { icon: CheckCircle, title: "Real-time Scoring", desc: "Scores are calculated instantly and saved automatically." }
                    ].map((feature, i) => (
                        <div key={i} className="p-6 rounded-2xl bg-zinc-50 border border-zinc-100 hover:border-zinc-200 transition-colors">
                            <div className="w-12 h-12 bg-white rounded-xl border border-zinc-200 flex items-center justify-center mb-4">
                                <feature.icon className="text-black" size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                            <p className="text-zinc-500 leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-border mt-20 py-12 bg-zinc-50">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-muted">
                    <div className="flex items-center gap-2 font-bold text-zinc-900">
                        <Hexagon size={16} fill="black" /> Evalsuite.
                    </div>
                    <p>© 2025 Evalsuite. Built for CDD at PMEC.</p>
                </div>
            </footer>
        </div>
    );
}
