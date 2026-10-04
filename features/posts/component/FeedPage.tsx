"use client";


import { PostCard } from "./posts-card";
import { DetailProfileDTO } from "@/lib/type/profile";
import { useFeedData } from "@/features/home/hooks/use-feed-page";

interface FeedPageProps {
    currentUser: DetailProfileDTO | null;
}

export default function FeedPage({ currentUser }: FeedPageProps) {
    const { isLoading, data = [] } = useFeedData()

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col gap-4 md:gap-6">
            {data.map((p) => (
                <PostCard
                    key={p.posts_id}
                    post={p}
                    currentUser={currentUser}
                />
            ))}
        </div>
    );
}