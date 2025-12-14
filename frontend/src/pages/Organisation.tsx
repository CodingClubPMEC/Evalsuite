import { useEffect, useState } from 'preact/hooks';
import { route } from 'preact-router';
import { api, User, Team } from '../services/api';
import { currentUser, auth } from '../store/auth';
import { Button, Card, Badge } from '../components/ui';
import { ArrowLeft, CheckCircle, Clock, Search, LogOut, Users, ShieldAlert, Plus, Download, BarChart2 } from 'lucide-preact';
import * as XLSX from 'xlsx';

/**
 * Admin Dashboard Component
 * Handles jury management verification and real-time team scoring overview.
 */
export default function Organisation() {
    // State: User Management
    const [pendingJuries, setPendingJuries] = useState<User[]>([]);
    const [approvedJuries, setApprovedJuries] = useState<User[]>([]);

    // State: Team & Scoring
    const [teams, setTeams] = useState<Team[]>([]);

    // State: UI Controls
    const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false);

    // State: Form Inputs
    const [newTeamName, setNewTeamName] = useState('');
    const [newTeamProject, setNewTeamProject] = useState('');

    const loggedInUser = currentUser.value;

    /**
     * Data Fetching Logic
     * Retrieves users and teams, filtering users by verification status.
     * Teams are sorted by total score descending to create a "Leaderboard" effect.
     */
    const fetchData = async () => {
        try {
            const allUsers = await api.getJuries();

            if (!allUsers) return; // Defensive: exit if API fails silently

            setPendingJuries(allUsers.filter(user => !user.isVerified));
            setApprovedJuries(allUsers.filter(user => user.isVerified));

            const allTeams = await api.getTeams();

            // Sorting teams by score (Highest first) for the leaderboard
            // We create a new array copy to avoid mutating any referenced state directly
            const sortedTeams = [...allTeams].sort((teamA, teamB) => {
                const scoreA = calculateTotalScore(teamA);
                const scoreB = calculateTotalScore(teamB);
                return scoreB - scoreA;
            });

            setTeams(sortedTeams);
        } catch (error) {
            console.error('Data sync failed:', error);
        }
    };

    /**
     * Helper to compute total score from all categories.
     */
    const calculateTotalScore = (team: Team): number => {
        if (!team || !team.scores) return 0;
        const { innovation, feasibility, presentation, impact, techQuality } = team.scores;
        return innovation + feasibility + presentation + impact + techQuality;
    };

    // Lifecycle: Auth Check & Polling
    useEffect(() => {
        // Redirect non-admins immediately
        if (!loggedInUser || loggedInUser.type !== 'admin') {
            route('/');
            return;
        }

        fetchData();

        // Poll for updates every 5 seconds (Realtime feel)
        const pollingId = setInterval(fetchData, 5000);
        return () => clearInterval(pollingId);
    }, [loggedInUser]);

    const handleApproveJury = async (userId: string) => {
        if (!userId) return; // Defensive check

        try {
            await api.approveJury(userId);
            fetchData(); // Immediate refresh to update UI
        } catch (error) {
            console.error('Approval failed:', error);
        }
    };

    const handleLogout = () => {
        auth.logout();
        route('/');
    };

    const handleAddTeamSubmit = async (event: Event) => {
        event.preventDefault();

        if (!newTeamName.trim() || !newTeamProject.trim()) {
            return; // Basic validation
        }

        try {
            await api.addTeam({ name: newTeamName, project: newTeamProject });

            // cleanup form
            setIsAddTeamModalOpen(false);
            setNewTeamName('');
            setNewTeamProject('');

            fetchData();
        } catch (error) {
            console.error('Add team failed:', error);
        }
    };

    const handleExportExcel = () => {
        if (teams.length === 0) return;

        try {
            // Flatten data for Excel row consumption
            const sheetData = teams.map(team => {
                const total = calculateTotalScore(team);
                return {
                    "Team ID": team.id,
                    "Team Name": team.name,
                    "Project": team.project,
                    "Innovation (25)": team.scores.innovation,
                    "Feasibility (20)": team.scores.feasibility,
                    "Presentation (15)": team.scores.presentation,
                    "Impact (20)": team.scores.impact,
                    "Tech Quality (20)": team.scores.techQuality,
                    "Total (100)": total
                };
            });

            const worksheet = XLSX.utils.json_to_sheet(sheetData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Marksheet");

            // Format: Evalsuite_Marksheet_YYYY-MM-DD.xlsx
            const filename = `Evalsuite_Marksheet_${new Date().toISOString().split('T')[0]}.xlsx`;
            XLSX.writeFile(workbook, filename);
        } catch (error) {
            console.error('Export failed:', error);
        }
    };

    if (!loggedInUser) return null;

    return (
        <div className="min-h-screen bg-zinc-50 pb-20">
            {/* Admin Header */}
            <header className="bg-white border-b border-zinc-200 sticky top-0 z-10 px-6 py-4 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 text-white p-2 rounded-lg shadow-sm">
                        <ShieldAlert size={20} />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-tight text-zinc-900">Admin Portal</h1>
                        <p className="text-xs text-zinc-500 font-medium">Manage Jury & Team Scoring</p>
                    </div>
                </div>
                <Button
                    variant="outline"
                    className="text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200 border-red-100 transition-colors"
                    onClick={handleLogout}
                >
                    <LogOut size={16} className="mr-2" /> Logout
                </Button>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
                {/* Stats Overview */}
                <div className="grid md:grid-cols-4 gap-6">
                    <StatCard label="Pending Approval" value={pendingJuries.length} colorClass="bg-yellow-400" />
                    <StatCard label="Active Juries" value={approvedJuries.length} colorClass="bg-green-500" />
                    <StatCard label="Total Teams" value={teams.length} colorClass="bg-purple-500" />
                    <StatCard label="Total Users" value={pendingJuries.length + approvedJuries.length} colorClass="bg-blue-500" />
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Column 1: Verification Queue & List */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                            <Users size={20} className="text-zinc-400" />
                            <h2 className="text-xl font-bold text-zinc-800">User Management</h2>
                        </div>

                        {/* Pending Requests */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Pending Requests</h3>
                            {pendingJuries.length === 0 ? (
                                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-zinc-300">
                                    <CheckCircle size={32} className="mx-auto text-green-500 mb-3 opacity-80" />
                                    <p className="text-zinc-500 font-medium text-sm">All caught up! No pending verifications.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {pendingJuries.map(jury => (
                                        <Card key={jury.id} className="p-4 flex items-center justify-between bg-white border-zinc-200 shadow-sm hover:border-zinc-300 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <img src={jury.avatar} className="w-10 h-10 rounded-full object-cover border border-zinc-200" alt={jury.name} />
                                                <div>
                                                    <h3 className="font-bold text-sm text-zinc-900">{jury.name}</h3>
                                                    <p className="text-xs text-zinc-500">{jury.role}</p>
                                                </div>
                                            </div>
                                            <Button
                                                size="sm"
                                                onClick={() => handleApproveJury(jury.id)}
                                                className="bg-black text-white hover:bg-zinc-800 h-9 px-4 text-xs font-medium"
                                            >
                                                Approve
                                            </Button>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Approved List */}
                        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/50">
                                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Active Juries</h3>
                            </div>
                            <div className="max-h-[28rem] overflow-y-auto custom-scrollbar">
                                <table className="w-full text-sm text-left">
                                    <tbody className="divide-y divide-zinc-100">
                                        {approvedJuries.map(jury => (
                                            <tr key={jury.id} className="hover:bg-zinc-50/80 transition-colors">
                                                <td className="px-6 py-4 font-medium text-zinc-900 flex items-center gap-3">
                                                    <img src={jury.avatar} className="w-8 h-8 rounded-full bg-zinc-100" />
                                                    {jury.name}
                                                </td>
                                                <td className="px-6 py-4 text-zinc-500 text-xs">{jury.department}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Leaderboard */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <BarChart2 size={20} className="text-zinc-400" />
                                <h2 className="text-xl font-bold text-zinc-800">Live Scoreboard</h2>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => setIsAddTeamModalOpen(true)}>
                                    <Plus size={16} className="mr-2" /> Add Team
                                </Button>
                                <Button variant="outline" size="sm" onClick={handleExportExcel}>
                                    <Download size={16} className="mr-2" /> Export
                                </Button>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-zinc-50/80 border-b border-zinc-200 text-xs uppercase font-bold text-zinc-500">
                                    <tr>
                                        <th className="px-5 py-3 pl-6">Team Name</th>
                                        <th className="px-5 py-3">Project Title</th>
                                        <th className="px-5 py-3 pr-6 text-right">Total Score</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100">
                                    {teams.map((team, index) => {
                                        const total = calculateTotalScore(team);
                                        const isTopUser = index === 0 && total > 0;

                                        return (
                                            <tr key={team.id} className={`hover:bg-zinc-50/80 transition-colors ${isTopUser ? 'bg-yellow-50/30' : ''}`}>
                                                <td className="px-5 py-4 pl-6 font-bold text-zinc-900 relative">
                                                    {isTopUser && <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400"></div>}
                                                    {team.name}
                                                </td>
                                                <td className="px-5 py-4 text-zinc-500 text-xs">{team.project}</td>
                                                <td className={`px-5 py-4 pr-6 text-right font-mono font-bold ${total > 0 ? 'text-blue-600' : 'text-zinc-300'}`}>
                                                    {total}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {teams.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-8 text-center text-zinc-400 text-sm">
                                                No teams added yet. Add a team to start scoring.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>

            {/* Modal: Add Team */}
            {isAddTeamModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <Card className="w-full max-w-sm p-6 bg-white shadow-2xl border-zinc-200 space-y-5 transform transition-all scale-100">
                        <div className="space-y-1">
                            <h3 className="text-lg font-bold text-zinc-900">Add New Team</h3>
                            <p className="text-xs text-zinc-500">Register a team for the hackathon.</p>
                        </div>
                        <form onSubmit={handleAddTeamSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-700">Team Name</label>
                                <input
                                    required
                                    value={newTeamName}
                                    onInput={(e) => setNewTeamName((e.target as HTMLInputElement).value)}
                                    className="w-full h-10 rounded-lg border border-zinc-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
                                    placeholder="e.g. Code Masters"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-700">Project Title</label>
                                <input
                                    required
                                    value={newTeamProject}
                                    onInput={(e) => setNewTeamProject((e.target as HTMLInputElement).value)}
                                    className="w-full h-10 rounded-lg border border-zinc-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
                                    placeholder="e.g. AI Crop Dusting"
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-3">
                                <Button type="button" variant="ghost" onClick={() => setIsAddTeamModalOpen(false)}>Cancel</Button>
                                <Button type="submit" className="bg-black text-white hover:bg-zinc-800">Create Team</Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
}

// Simple internal component for consistent stats cards
function StatCard({ label, value, colorClass }: { label: string, value: number, colorClass: string }) {
    return (
        <Card className="pl-6 py-5 pr-6 bg-white border-zinc-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className={`absolute right-0 top-0 bottom-0 w-1.5 ${colorClass}`}></div>
            <p className="text-zinc-500 text-sm font-medium mb-1">{label}</p>
            <p className="text-3xl font-bold tracking-tight text-zinc-900">{value}</p>
        </Card>
    );
}
