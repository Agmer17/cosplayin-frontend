"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { PostsResponse } from "@/lib/type/posts";
import { PostDetailMedia } from "./post-detail-media";
import { PostDetailSidebar } from "./posts-detail-sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRouter } from "next/navigation";
import { DetailProfileDTO } from "@/lib/type/profile";

type PostDetailProps = {
    post: PostsResponse;
    profile: DetailProfileDTO | null
    onDelete: (id: string) => void
};

export function PostDetail({ post, onDelete, profile }: PostDetailProps) {
    const isMobile = useIsMobile();
    const router = useRouter()

    return (
        <main className="min-h-screen bg-background">
            <div className="sticky top-0 z-20 flex h-14 items-center border-b bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/60 md:h-16">
                <Button onClick={() => router.back()} variant="ghost" className="rounded-full">
                    <ArrowLeft className="h-6 w-6" />
                </Button>
                <h1 className="ml-3 text-sm font-semibold md:text-base">Postingan</h1>
            </div>

            <div className="mx-auto w-full max-w-6xl p-0 md:p-6">
                <Card className="overflow-hidden rounded-none border-x-0 border-y md:rounded-xl md:border">
                    <div className="flex flex-col md:flex-row">
                        {isMobile && (
                            <div className="shrink-0 border-b">
                                <PostDetailSidebar currentProfile={profile} post={post} headerOnly onDeletePosts={onDelete} />
                            </div>
                        )}

                        <div className="min-h-0 min-w-0 md:flex-1">
                            <PostDetailMedia media={post.media} caption={post.caption} />
                        </div>

                        <Separator className="md:hidden" />

                        <div className="min-h-0 min-w-0 md:w-95 md:shrink-0">
                            <PostDetailSidebar
                                currentProfile={profile}
                                post={post}
                                hideHeader={isMobile}
                                onDeletePosts={onDelete}
                            />
                        </div>
                    </div>
                </Card>
            </div>
        </main>
    );
}