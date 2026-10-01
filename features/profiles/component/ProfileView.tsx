"use client";

import { useState, type ReactNode } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { DetailProfileDTO } from "@/lib/type/profile";
import type { PostsResponse } from "@/lib/type/posts";
import { ProfileHeader, ProfileHeaderSkeleton } from "./profile-header";
import { ProfileTabs } from "./profile-tabs";
import { PostsGrid } from "../../posts/component/posts-grid";

type ProfileTab = "posts" | "likes";

type ProfileViewProps = {
    profileQuery: UseQueryResult<DetailProfileDTO>;
    postsQuery: UseQueryResult<PostsResponse[]>;
    likedPostsQuery: UseQueryResult<PostsResponse[]>;
    actions?: ReactNode;
    showLikesTab?: boolean;
};

export function ProfileView({
    profileQuery,
    postsQuery,
    likedPostsQuery,
    actions,
    showLikesTab = true,
}: ProfileViewProps) {
    const [activeTab, setActiveTab] =
        useState<ProfileTab>("posts");

    return (
        <main className="mx-auto w-full max-w-4xl">
            {profileQuery.isPending && <ProfileHeaderSkeleton />}

            {profileQuery.isError && (
                <div className="flex flex-col items-center gap-3 px-4 py-16 text-center">
                    <p className="text-sm text-destructive">
                        Profil gagal dimuat.
                    </p>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => profileQuery.refetch()}
                    >
                        Coba lagi
                    </Button>
                </div>
            )}

            {profileQuery.data && (
                <ProfileHeader
                    profile={profileQuery.data}
                    actions={actions}
                />
            )}

            <Separator />

            <ProfileTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                showLikesTab={showLikesTab}
            />

            {activeTab === "posts" && (
                <div className="w-full">
                    <PostsGrid
                        posts={postsQuery.data}
                        isPending={postsQuery.isPending}
                        isError={postsQuery.isError}
                        onRetry={() => postsQuery.refetch()}
                    />
                </div>
            )}

            {activeTab === "likes" && (
                <div className="w-full">
                    <PostsGrid
                        posts={likedPostsQuery.data}
                        isPending={likedPostsQuery.isPending}
                        isError={likedPostsQuery.isError}
                        onRetry={() => likedPostsQuery.refetch()}
                    />
                </div>
            )}
        </main>
    );
}