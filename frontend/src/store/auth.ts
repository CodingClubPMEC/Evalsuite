import { signal, computed } from "@preact/signals";
import { User, api } from "../services/api";

export const currentUser = signal<User | null>(null);

export const auth = {
    login: async (email: string, pass: string) => {
        const user = await api.login(email, pass);
        currentUser.value = user;
        return user;
    },
    logout: () => {
        currentUser.value = null;
    },
    isAdmin: computed(() => currentUser.value?.type === 'admin'),
    isJudge: computed(() => currentUser.value?.type === 'jury'),
    isVerified: computed(() => currentUser.value?.isVerified),
};
