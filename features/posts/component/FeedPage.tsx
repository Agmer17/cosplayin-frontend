"use client";

import { useQuery } from "@tanstack/react-query";

import { PostCard } from "./posts-card";
import { postsApi } from "../api/posts.client";
import { DetailProfileDTO } from "@/lib/type/profile";

interface FeedPageProps {
    currentUser: DetailProfileDTO | null;
}

export default function FeedPage({ currentUser }: FeedPageProps) {
    const { data: feedData = [], isLoading } = useQuery({
        queryKey: ["feed"],
        queryFn: postsApi.client.getFeed,
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col gap-4 md:gap-6">
            {feedData.map((p) => (
                <PostCard
                    key={p.posts_id}
                    post={p}
                    currentUser={currentUser}
                />
            ))}
        </div>
    );
}