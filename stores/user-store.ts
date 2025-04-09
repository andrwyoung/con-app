// storing user profile info globally
import { create } from "zustand";
import { User } from "@supabase/supabase-js";

type UserProfile = {
    user_id: string;
    username: string;
    role: string;
    persona: string;
    has_never_logged_in: boolean;
}

type UserStore = {
    user: User | null | undefined;
    profile: UserProfile | null;
    setUser: (user: User | null) => void;
    setProfile: (profile: UserProfile | null) => void;
}

export const useUserStore = create<UserStore>((set) => ({
    user: undefined,
    profile: null,
    setUser: (user) => set({ user }),
    setProfile: (profile) => set({ profile }),
}))