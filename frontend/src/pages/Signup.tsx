import { useState } from 'preact/hooks';
import { route } from 'preact-router';
import { api } from '../services/api';
import { Button, Card } from '../components/ui';
import { Hexagon, Lock, Mail, User as UserIcon, Building, Briefcase, Loader2, Phone } from 'lucide-preact';

/**
 * Signup Page Component
 * Handles new user registration (Jury & Admin).
 */
export default function Signup() {
    // Form State
    const [fullName, setFullName] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [jobTitle, setJobTitle] = useState('Senior Architect'); // Default Placeholder Job
    const [departmentName, setDepartmentName] = useState('Computer Science');
    const [accountType, setAccountType] = useState<'jury' | 'admin'>('jury');

    // Conditional Fields
    const [mobileNumber, setMobileNumber] = useState('');
    const [selectedOrganization, setSelectedOrganization] = useState('PMEC');

    // UI State
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSignupSubmit = async (event: Event) => {
        event.preventDefault(); // Stop page reload

        if (isSubmitting) return; // Prevent double clicks

        setIsSubmitting(true);
        setErrorMessage('');

        try {
            // Construct payload defensively
            // Only include fields relevant to the account type
            await api.signup({
                name: fullName,
                email: emailAddress,
                password: password,
                role: jobTitle,
                department: departmentName,
                type: accountType,
                // Only admins have mobile numbers
                mobile: accountType === 'admin' ? mobileNumber : undefined,
                // Only juries need an organization at this stage
                organization: accountType === 'jury' ? selectedOrganization : undefined,
            });

            // On success, guide user to login
            route('/login');
        } catch (error) {
            console.error('Registration failed:', error);
            const message = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
            setErrorMessage(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen grid items-center justify-center bg-zinc-50 p-4 py-8">
            <Card className="w-full max-w-lg p-8 space-y-8 bg-white shadow-xl border-zinc-200 rounded-2xl">
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-black text-white mb-4 shadow-lg shadow-black/20">
                        <Hexagon size={24} fill="currentColor" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Create your account</h1>
                    <p className="text-zinc-500 text-sm">Join the evaluation panel for the next hackathon</p>
                </div>

                <form onSubmit={handleSignupSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Full Name</label>
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-2.5 text-zinc-400" size={18} />
                                <input
                                    required
                                    value={fullName}
                                    onInput={(e) => setFullName((e.target as HTMLInputElement).value)}
                                    className="w-full pl-10 h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                                    placeholder="Dr. John Doe"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Account Type</label>
                            <select
                                value={accountType}
                                onChange={(e) => setAccountType((e.target as HTMLSelectElement).value as any)}
                                className="w-full h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                            >
                                <option value="jury">Jury Member</option>
                                <option value="admin">Administrator</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Email address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 text-zinc-400" size={18} />
                            <input
                                type="email"
                                required
                                value={emailAddress}
                                onInput={(e) => setEmailAddress((e.target as HTMLInputElement).value)}
                                className="w-full pl-10 h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                                placeholder="name@university.edu"
                            />
                        </div>
                    </div>

                    {/* Conditional Logic: Admin Specific Fields */}
                    {accountType === 'admin' && (
                        <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Mobile Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-2.5 text-zinc-400" size={18} />
                                <input
                                    type="tel"
                                    required
                                    value={mobileNumber}
                                    onInput={(e) => setMobileNumber((e.target as HTMLInputElement).value)}
                                    className="w-full pl-10 h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                                    placeholder="+91 98765 43210"
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 text-zinc-400" size={18} />
                            <input
                                type="password"
                                required
                                value={password}
                                onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
                                className="w-full pl-10 h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Job Title</label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-2.5 text-zinc-400" size={18} />
                                <input
                                    required
                                    value={jobTitle}
                                    onInput={(e) => setJobTitle((e.target as HTMLInputElement).value)}
                                    className="w-full pl-10 h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                                    placeholder="e.g. Professor"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Department</label>
                            <div className="relative">
                                <Building className="absolute left-3 top-2.5 text-zinc-400" size={18} />
                                <input
                                    required
                                    value={departmentName}
                                    onInput={(e) => setDepartmentName((e.target as HTMLInputElement).value)}
                                    className="w-full pl-10 h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                                    placeholder="e.g. CS / IT"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Conditional Logic: Jury Specific Fields */}
                    {accountType === 'jury' && (
                        <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Organisation</label>
                            <div className="relative">
                                <Building className="absolute left-3 top-2.5 text-zinc-400" size={18} />
                                <select
                                    value={selectedOrganization}
                                    onChange={(e) => setSelectedOrganization((e.target as HTMLSelectElement).value)}
                                    className="w-full pl-10 h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all app-select"
                                >
                                    <option value="PMEC">PMEC (Default)</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {errorMessage && (
                        <div className="text-red-600 text-xs font-medium bg-red-50 p-3 rounded-lg border border-red-100 flex items-center justify-center animate-in fade-in">
                            {errorMessage}
                        </div>
                    )}

                    <Button className="w-full h-11 text-base font-medium shadow-md shadow-zinc-200" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                        {isSubmitting ? 'Processing...' : 'Create account'}
                    </Button>
                </form>

                <div className="text-center pt-4 border-t border-zinc-100">
                    <p className="text-sm text-zinc-500">
                        Already have an account?
                        <span
                            onClick={() => route('/login')}
                            className="text-zinc-900 font-semibold cursor-pointer hover:underline ml-1.5 transition-all"
                        >
                            Log in
                        </span>
                    </p>
                </div>
            </Card>
        </div>
    );
}
