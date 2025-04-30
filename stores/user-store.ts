// storing user profile info globally
import { create } from "zustand";
import { User } from "@supabase/supabase-js";
import { Tables } from "@/types/supabase";

export type UserProfile = Tables<"user_profiles">;

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