"use client"

import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ProfileView } from "@/features/profiles/component/ProfileView"
import {
    useOtherProfile,
    useUserPosts,
    useOtherUserLikes,
} from "@/features/profiles/hooks/use-profile-query"
import { UserCheck, UserPlus } from "lucide-react"
import { useToggleFollow } from "@/features/follow/hooks/use-follow"

export default function UserProfilePage() {
    const params = useParams()
    const username = params.username as string

    const profileQuery = useOtherProfile(username)
    const postsQuery = useUserPosts(username)
    const likedPostsQuery = useOtherUserLikes(username)

    const toggleFollow = useToggleFollow(username)

    const isFollowing =
        profileQuery.data?.follow_status === "FOLLOWING"

    const isPending =
        profileQuery.data?.follow_status === "PENDING"

    const handleToggleFollow = () => {
        if (!profileQuery.data?.id) return

        toggleFollow.mutate({
            userId: profileQuery.data.id,
            followed: !isFollowing && !isPending,
        })
    }

    return (
        <ProfileView
            profileQuery={profileQuery}
            postsQuery={postsQuery}
            likedPostsQuery={likedPostsQuery}
            actions={
                <Button
                    size="sm"
                    variant={isFollowing ? "outline" : "default"}
                    className="gap-2 rounded-full px-4 font-semibold transition-colors"
                    onClick={handleToggleFollow}
                    disabled={toggleFollow.isPending}
                >
                    {isFollowing ? (
                        <>
                            <UserCheck className="size-4" />
                            Mengikuti
                        </>
                    ) : isPending ? (
                        "Menunggu"
                    ) : (
                        <>
                            <UserPlus className="size-4" />
                            Ikuti
                        </>
                    )}
                </Button>
            }
        />
    )
}