import { useEffect } from 'preact/hooks';
import { useSignal, useComputed } from '@preact/signals';
import { route } from 'preact-router';
import { currentUser } from '../store/auth';
import { api, Team } from '../services/api';
import { Button } from '../components/ui';
import { ChevronLeft, Info, CheckCircle, Send, ChevronDown, LogOut, Lock, Clock } from 'lucide-preact';

// Signal-based row component for performance
function TeamRow({ team, index }: { team: Team, index: number }) {
    // Local signals for this specific row
    const innovation = useSignal(0);
    const feasibility = useSignal(0);
    const presentation = useSignal(0);
    const impact = useSignal(0);
    const tech = useSignal(0);

    const total = useComputed(() =>
        innovation.value + feasibility.value + presentation.value + impact.value + tech.value
    );

    return (
        <div className="grid grid-cols-12 gap-4 items-center py-4 border-b border-border hover:bg-surface/50 transition-colors px-6">
            {/* Team Details */}
            <div className="col-span-3">
                <div className="text-xs text-muted mb-1 font-mono">TEAM-{index + 1}</div>
                <div className="font-bold text-sm flex items-center gap-2">
                    {team.name}
                    <ChevronDown size={14} className="text-muted" />
                </div>
                <div className="text-xs text-muted truncate">{team.project}</div>
            </div>

            {/* Inputs */}
            {[
                { sig: innovation, max: 25 },
                { sig: feasibility, max: 20 },
                { sig: presentation, max: 15 },
                { sig: impact, max: 20 },
                { sig: tech, max: 20 }
            ].map((field, i) => (
                <div key={i} className="col-span-1.5 px-1">
                    <input
                        type="number"
                        min="0" max={field.max}
                        value={field.sig.value === 0 ? '' : field.sig.value}
                        placeholder="-"
                        onInput={(e) => {
                            const val = parseFloat((e.target as HTMLInputElement).value) || 0;
                            if (val <= field.max) field.sig.value = val;
                        }}
                        className="w-full text-center border border-border rounded h-10 text-sm focus:border-black focus:ring-0 outline-none transition-all placeholder:text-zinc-300"
                    />
                </div>
            ))}

            {/* Total - Computed Signal */}
            <div className="col-span-1.5 text-right pl-4">
                <div className={`inline-flex items-center justify-center w-12 h-10 rounded font-bold text-sm ${total.value > 0 ? 'bg-black text-white' : 'bg-surface text-muted'}`}>
                    {total}
                </div>
            </div>
        </div>
    );
}

export default function Jury() {
    const teams = useSignal<Team[]>([]);
    const user = currentUser.value;

    useEffect(() => {
        if (!user) route('/login');
        else api.getTeams().then(data => teams.value = data);
    }, [user]);

    if (!user) return null;

    // View for unverified juries
    if (!user.isVerified) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 p-6 text-center">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full space-y-6 border border-zinc-100">
                    <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto">
                        <Clock size={32} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-900">Verification Pending</h1>
                        <p className="text-zinc-500 mt-2">Your account is currently under review by the administrator. Please wait for approval to access the marking dashboard.</p>
                    </div>
                    <div className="bg-zinc-50 p-4 rounded-lg text-left text-sm text-zinc-600 border border-zinc-100">
                        <p className="font-semibold mb-1">Details Submitted:</p>
                        <p>Name: <span className="text-black">{user.name}</span></p>
                        <p>Role: <span className="text-black">{user.role}</span></p>
                        <p>Email: <span className="text-black">{user.email}</span></p>
                    </div>
                    <Button variant="outline" className="w-full" onClick={() => route('/')}>Back to Home</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface/30">
            {/* Top Navigation */}
            <div className="bg-white border-b border-border px-6 py-4 flex justify-between items-center sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    <button onClick={() => route('/')} className="text-sm text-muted hover:text-black flex items-center gap-1 transition-colors">
                        <ChevronLeft size={16} /> Back to Home
                    </button>
                </div>
                <Button variant="outline" className="text-red-500 border-red-100 bg-red-50 hover:bg-red-100 hover:border-red-200" onClick={() => route('/')}>
                    <LogOut size={14} className="mr-2" /> Logout
                </Button>
            </div>

            {/* Dashboard Header */}
            <div className="bg-white border-b border-border pb-8 pt-8 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex items-start gap-4">
                        <img src={user.avatar} className="w-16 h-16 rounded-lg object-cover border border-border shadow-sm grayscale" />
                        <div>
                            <h1 className="text-2xl font-bold">{user.name}</h1>
                            <div className="flex items-center gap-2 text-sm text-muted mt-1">
                                <span>{user.role}</span>
                                <span className="text-border">|</span>
                                <span>{user.department}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-surface border border-border rounded-lg p-4 max-w-md flex gap-3">
                        <Info size={20} className="text-zinc-400 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <p className="font-semibold text-sm">Instructions</p>
                            <p className="text-xs text-muted leading-relaxed">
                                Scores are saved automatically. Ensure all teams are evaluated before exporting. Total marks are calculated out of 100.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* Status Bar */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
                        <CheckCircle size={14} />
                        <span className="font-medium">All changes saved</span>
                        <span className="text-green-400 text-xs ml-1">Last synced at 12:33:47 pm</span>
                    </div>
                    <Button className="bg-black text-white hover:bg-zinc-800">
                        <Send size={14} className="mr-2" /> Submit Final Scores
                    </Button>
                </div>

                {/* Evaluation Table */}
                <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 items-end px-6 py-4 border-b border-border bg-surface/50 text-xs font-semibold text-muted uppercase tracking-wider">
                        <div className="col-span-3">Team Details</div>
                        <div className="col-span-1.5">Innovation <br /><span className="text-[10px] text-zinc-400 font-normal">Max: 25</span></div>
                        <div className="col-span-1.5">Feasibility <br /><span className="text-[10px] text-zinc-400 font-normal">Max: 20</span></div>
                        <div className="col-span-1.5">Presentation <br /><span className="text-[10px] text-zinc-400 font-normal">Max: 15</span></div>
                        <div className="col-span-1.5">Impact <br /><span className="text-[10px] text-zinc-400 font-normal">Max: 20</span></div>
                        <div className="col-span-1.5">Tech Quality <br /><span className="text-[10px] text-zinc-400 font-normal">Max: 20</span></div>
                        <div className="col-span-1.5 text-right">Total</div>
                    </div>

                    {/* Table Rows */}
                    <div className="divide-y divide-border">
                        {teams.value.map((team, idx) => (
                            <TeamRow key={team.id} team={team} index={idx} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
