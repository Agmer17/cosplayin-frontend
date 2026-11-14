"use client"

import { useParams } from "next/navigation"
import { Clock3, LoaderCircle, UserCheck, UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ProfileView } from "@/features/profiles/component/ProfileView"

import {
    useOtherProfile,
    useUserPosts,
    useOtherUserLikes,
} from "@/features/profiles/hooks/use-profile-query"

import { useToggleFollow } from "@/features/follow/hooks/use-follow"

export default function UserProfilePage() {
    const params = useParams()
    const username = params.username as string

    const profileQuery = useOtherProfile(username)
    const postsQuery = useUserPosts(username)
    const likedPostsQuery = useOtherUserLikes(username)

    const toggleFollow = useToggleFollow(username)

    const profile = profileQuery.data

    const isFollowing = profile?.follow_status === "FOLLOWING"
    const isRequested = profile?.follow_status === "REQUESTED"

    const postsAccessible =
        !profile ||
        profile.visibility !== "PRIVATE" ||
        isFollowing

    const handleToggleFollow = () => {
        if (!profile?.id || toggleFollow.isPending) return

        toggleFollow.mutate({
            userId: profile.id,
            followed: !isFollowing && !isRequested,
        })
    }

    const renderFollowButton = () => {
        const isLoading = toggleFollow.isPending || profileQuery.isPending

        return (
            <Button
                size="sm"
                variant={isFollowing || isRequested ? "outline" : "default"}
                className="gap-2 rounded-full px-4 font-semibold transition-colors"
                onClick={handleToggleFollow}
                disabled={isLoading || !profile}
            >
                {toggleFollow.isPending ? (
                    <>
                        <LoaderCircle className="size-4 animate-spin" />
                        Memproses
                    </>
                ) : isFollowing ? (
                    <>
                        <UserCheck className="size-4" />
                        Mengikuti
                    </>
                ) : isRequested ? (
                    <>
                        <Clock3 className="size-4" />
                        Diminta
                    </>
                ) : (
                    <>
                        <UserPlus className="size-4" />
                        Ikuti
                    </>
                )}
            </Button>
        )
    }

    return (
        <ProfileView
            profileQuery={profileQuery}
            postsQuery={postsQuery}
            likedPostsQuery={likedPostsQuery}
            postsAccessible={postsAccessible}
            actions={renderFollowButton()}
        />
    )
}