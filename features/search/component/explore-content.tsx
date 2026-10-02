"use client";

import { useState } from "react";

import { PostsGrid } from "@/features/posts/component/posts-grid";
import { ProfileList } from "@/features/profiles/component/profile-lists";

import { ExploreTabs } from "./explore-tabs";
import { ExploreSearchInput } from "./search-input";

import {
    useSearchPosts,
    useSearchUsers,
} from "../hooks/use-search-input";
import { useAuthStore } from "@/lib/store/auth-store";

export function ExploreContent() {
    const [query, setQuery] = useState("");
    const [tab, setTab] = useState<"posts" | "users">("posts");

    const currentProfile = useAuthStore((state) => state.user)

    const postsQuery = useSearchPosts(
        query,
        tab === "posts"
    );

    const usersQuery = useSearchUsers(
        query,
        tab === "users"
    );

    return (
        <div className="flex flex-col gap-4">
            <ExploreSearchInput
                value={query}
                onChange={setQuery}
            />

            <ExploreTabs
                value={tab}
                onChange={setTab}
            />

            {tab === "posts" ? (
                <PostsGrid
                    posts={postsQuery.data}
                    isPending={postsQuery.isPending}
                    isError={postsQuery.isError}
                    onRetry={() => postsQuery.refetch()}
                    emptyMessage="Tidak ada postingan ditemukan"
                />
            ) : (
                <ProfileList
                    users={usersQuery.data}
                    currentProfile={currentProfile}
                />
            )}
        </div>
    );
}