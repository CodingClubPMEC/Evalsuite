export interface User {
    id: string;
    name: string;
    email: string;
    password?: string;
    role: string;
    department: string;
    avatar: string;
    type: 'jury' | 'admin' | 'org';
    isVerified: boolean;
    mobile?: string;
    organization?: string;
}

export interface Team {
    id: string;
    name: string;
    project: string;
    scores: {
        innovation: number;
        feasibility: number;
        presentation: number;
        impact: number;
        techQuality: number;
    }
}

// Utility for simulating network latency in development
const simulateNetworkDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// --- Mock Data Store ---

export const MOCK_ADMINS: User[] = [
    {
        id: '1',
        name: 'Admin User',
        email: 'admin@evalsuite.com',
        password: 'admin123', // In real app, never store plain text
        role: 'Administrator',
        department: 'Management',
        avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff',
        type: 'admin',
        isVerified: true
    }
];

export const MOCK_JURIES: User[] = [
    {
        id: '2',
        name: 'Dr. Sarah Wilson',
        email: 'judge@evalsuite.com',
        role: 'Senior Professor',
        department: 'Computer Science',
        avatar: 'https://ui-avatars.com/api/?name=Sarah+Wilson&background=random',
        type: 'jury',
        isVerified: true // Pre-verified for demo
    },
    {
        id: '3',
        name: 'James Carter',
        email: 'james@techcorp.com',
        role: 'Tech Lead',
        department: 'Engineering',
        avatar: 'https://ui-avatars.com/api/?name=James+Carter&background=random',
        type: 'jury',
        isVerified: false // Needs approval
    }
];

// Combine for a unified lookup
let GLOBAL_USER_STORE = [...MOCK_JURIES, ...MOCK_ADMINS];

// Mock Teams with varied scores to demonstrate sorting/ranking
export const MOCK_TEAMS: Team[] = [
    { id: 't1', name: 'Code Warriors', project: 'AI Surveillance', scores: { innovation: 18, feasibility: 15, presentation: 12, impact: 16, techQuality: 15 } }, // Total: 76
    { id: 't2', name: 'Neural Net', project: 'Health Bridge', scores: { innovation: 22, feasibility: 18, presentation: 14, impact: 19, techQuality: 18 } }, // Total: 91
    { id: 't3', name: 'Green Earth', project: 'Waste Mgmt', scores: { innovation: 15, feasibility: 14, presentation: 11, impact: 18, techQuality: 14 } }, // Total: 72
    { id: 't4', name: 'Block Chainers', project: 'DeFi Sol', scores: { innovation: 24, feasibility: 19, presentation: 15, impact: 20, techQuality: 19 } }, // Total: 97
    { id: 't5', name: 'Cyber Shield', project: 'Secure Net', scores: { innovation: 20, feasibility: 16, presentation: 13, impact: 17, techQuality: 16 } }, // Total: 82
];

/**
 * Mock API Service
 * 
 * Simulates backend interactions. In a real application, 
 * these methods would wrap `fetch` or `axios` calls.
 */
export const api = {
    /**
     * Authenticates a user against the mock store.
     */
    login: async (email: string, password: string): Promise<User> => {
        await simulateNetworkDelay(800);

        // Defensive: Case-insensitive email check
        const user = GLOBAL_USER_STORE.find(u =>
            u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        if (!user) {
            throw new Error('Invalid credentials');
        }

        return user;
    },

    /**
     * Registers a new user.
     */
    signup: async (userData: Partial<User>) => {
        await simulateNetworkDelay(1000);

        // Validation: Check if email already exists
        const exists = GLOBAL_USER_STORE.some(u => u.email.toLowerCase() === userData.email?.toLowerCase());
        if (exists) {
            throw new Error('User already exists with this email.');
        }

        const newUser: User = {
            id: Math.random().toString(36).substr(2, 9),
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || 'User')}&background=random`,
            isVerified: userData.type === 'admin', // Admins auto-verified for this demo
            ...userData as User
        };

        GLOBAL_USER_STORE.push(newUser);
        return newUser;
    },

    /**
     * Returns all users with the 'jury' role.
     */
    getJuries: async (): Promise<User[]> => {
        await simulateNetworkDelay(300); // Faster reads
        return GLOBAL_USER_STORE.filter(u => u.type === 'jury');
    },

    /**
     * Approves a pending jury member.
     */
    approveJury: async (targetUserId: string) => {
        await simulateNetworkDelay(500);

        const userIndex = GLOBAL_USER_STORE.findIndex(u => u.id === targetUserId);
        if (userIndex === -1) {
            throw new Error(`User with ID ${targetUserId} not found.`);
        }

        // Update in place
        GLOBAL_USER_STORE[userIndex].isVerified = true;
        return GLOBAL_USER_STORE[userIndex];
    },

    /**
     * Returns the list of teams.
     */
    getTeams: async (): Promise<Team[]> => {
        await simulateNetworkDelay(300);
        return MOCK_TEAMS;
    },

    /**
     * creates a new team.
     */
    addTeam: async (teamData: Pick<Team, 'name' | 'project'>) => {
        await simulateNetworkDelay(600);

        const newTeam: Team = {
            id: Math.random().toString(36).substr(2, 9),
            ...teamData,
            // Initialize with zero scores
            scores: { innovation: 0, feasibility: 0, presentation: 0, impact: 0, techQuality: 0 }
        };

        MOCK_TEAMS.push(newTeam);
        return newTeam;
    }
};
