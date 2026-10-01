"use client";

import { Button } from "@/components/ui/button";
import { ProfileView } from "@/features/profiles/component/ProfileView";
import {
    useMyLikes,
    useMyProfile,
    useUserPosts,
} from "@/features/profiles/hooks/use-profile-query";
import { Settings } from "lucide-react";

export default function MyProfilePage() {
    const profileQuery = useMyProfile();

    const postsQuery = useUserPosts(
        profileQuery.data?.username
    );

    const likedPostsQuery = useMyLikes();

    return (
        <ProfileView
            profileQuery={profileQuery}
            postsQuery={postsQuery}
            likedPostsQuery={likedPostsQuery}
            actions={
                <Button
                    variant="outline"
                    className="rounded-full"
                >
                    <Settings className="h-5! w-5!" />
                </Button>
            }
        />
    );
}