"use client";

import { useQuery } from "@tanstack/react-query";

import { exploreApi } from "../api/explore.client";

export function useSearchPosts(query: string, enabled: boolean) {
    return useQuery({
        queryKey: ["explore-search", "posts", query],
        queryFn: () => exploreApi.searchPosts(query),
        enabled,
    });
}

export function useSearchUsers(query: string, enabled: boolean) {
    return useQuery({
        queryKey: ["explore-search", "users", query],
        queryFn: () => exploreApi.searchUsers(query),
        enabled,
    });
}