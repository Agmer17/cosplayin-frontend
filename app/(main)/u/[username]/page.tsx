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

    const profile = profileQuery.data

    const isFollowing =
        profile?.follow_status === "FOLLOWING"

    const isRequested =
        profile?.follow_status === "REQUESTED"

    const postsAccessible =
        !profile ||
        profile.visibility !== "PRIVATE" ||
        isFollowing

    const handleToggleFollow = () => {
        if (!profile?.id) return

        toggleFollow.mutate({
            userId: profile.id,
            followed: !isFollowing && !isRequested,
        })
    }

    return (
        <ProfileView
            profileQuery={profileQuery}
            postsQuery={postsQuery}
            likedPostsQuery={likedPostsQuery}
            postsAccessible={postsAccessible}
            actions={
                <Button
                    size="sm"
                    variant={isFollowing ? "outline" : "default"}
                    className="gap-2 rounded-full px-4 font-semibold transition-colors"
                    onClick={handleToggleFollow}
                    disabled={
                        toggleFollow.isPending ||
                        profileQuery.isPending
                    }
                >
                    {isFollowing ? (
                        <>
                            <UserCheck className="size-4" />
                            Mengikuti
                        </>
                    ) : isRequested ? (
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