// src/components/auth/auth-provider.tsx

"use client";

import { useEffect } from "react";

import { useAuthStore } from "@/lib/store/auth-store";
import { DetailProfileDTO } from "@/lib/type/profile";

interface AuthProviderProps {
    user: DetailProfileDTO | null;
    children: React.ReactNode;
}

export function AuthProvider({
    user,
    children,
}: AuthProviderProps) {
    const setUser = useAuthStore((state) => state.setUser);

    useEffect(() => {
        setUser(user);
    }, [user, setUser]);

    return children;
}