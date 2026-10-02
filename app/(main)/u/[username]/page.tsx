"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ProfileView } from "@/features/profiles/component/ProfileView";
import {
    useOtherProfile,
    useUserPosts,
    useOtherUserLikes,
} from "@/features/profiles/hooks/use-profile-query";
import { Settings } from "lucide-react";

export default function UserProfilePage() {
    const params = useParams();

    const username = params.username as string;

    const profileQuery = useOtherProfile(username);

    const postsQuery = useUserPosts(username);

    const likedPostsQuery = useOtherUserLikes(params.username as string);

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
                    <Settings className="h-5 w-5" />
                </Button>
            }
        />
    );
}