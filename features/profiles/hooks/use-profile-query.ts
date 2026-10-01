import { useQuery } from "@tanstack/react-query";
import { profileClientApi } from "@/features/profiles/api/profile.client";
import { postsApi } from "@/features/posts/api/posts.client";

export const profileKeys = {
    me: ["profile", "me"] as const,
    other: (username: string) =>
        ["profile", "user", username] as const,
    posts: (username: string) =>
        ["profile", "posts", username] as const,
};

export function useMyProfile() {
    return useQuery({
        queryKey: profileKeys.me,
        queryFn: () => profileClientApi.getMyProfile(),
    });
}

export function useOtherProfile(username?: string) {
    return useQuery({
        queryKey: profileKeys.other(username ?? ""),
        queryFn: () =>
            profileClientApi.getOtherProfile(username as string),
        enabled: Boolean(username),
    });
}

export function useUserPosts(username?: string) {
    return useQuery({
        queryKey: profileKeys.posts(username ?? ""),
        queryFn: () =>
            postsApi.client.getMyPosts(username as string),
        enabled: Boolean(username),
    });
}

export function useMyLikes() {
    return useQuery({
        queryKey: ["my-likes"],
        queryFn: () => postsApi.client.getMyLikedPosts(),
    });
}