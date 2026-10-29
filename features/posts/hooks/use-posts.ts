import { useMutation, useQueryClient } from "@tanstack/react-query"
import { postsApi } from "../api/posts.client"
import type { PostsResponse } from "@/lib/type/posts"
import { useQuery } from "@tanstack/react-query"


export function usePostsLike(postId: string, liked: boolean) {
    const queryClient = useQueryClient()
    const queryKey = ["posts", postId]

    const mutation = useMutation({
        mutationFn: (nextLiked: boolean) =>
            nextLiked
                ? postsApi.client.likePosts(postId)
                : postsApi.client.unlikePosts(postId),

        onMutate: async (nextLiked) => {
            await queryClient.cancelQueries({ queryKey })

             const previous =
                queryClient.getQueryData<PostsResponse>(queryKey)
                
            queryClient.setQueryData<PostsResponse>(queryKey, (old) =>
                old
                    ? {
                        ...old,
                        liked: nextLiked,
                        like_count: Math.max(
                            0,
                            old.like_count + (nextLiked ? 1 : -1),
                        ),
                    }
                    : old,
            )

           

            return { previous }
        },

        // rollback kalau gagal
        onError: (_err, _nextLiked, ctx) => {
            if (ctx?.previous) queryClient.setQueryData(queryKey, ctx.previous)
        },

        // sinkronkan dengan server setelah selesai
        onSettled: () => {
            // queryClient.invalidateQueries({ queryKey });
            queryClient.invalidateQueries({ queryKey: ["my-likes"] })
        },
    })

    return {
        liked,
        loading: mutation.isPending,
        toggleLike: () => mutation.mutate(!liked),
    } 
}


export function usePostsLikeDetails(postId: string) {
    return useQuery({
        queryKey: ["posts", postId, "likes"] as const,
        queryFn: () => postsApi.client.getPostLikeDetails(postId),
        enabled: !!postId,
    })
}

export function usePostsBookmark(postId: string, bookmarked: boolean) {
    const queryClient = useQueryClient()
    const queryKey = ["posts", postId]

    const mutation = useMutation({
        mutationFn: (nextBookmarked: boolean) =>
            nextBookmarked
                ? postsApi.client.addToBookmark(postId)
                : postsApi.client.deleteBookmark(postId),

        onMutate: async (nextBookmarked) => {
            await queryClient.cancelQueries({ queryKey })

            
            const previous =
                queryClient.getQueryData<PostsResponse>(queryKey)

            queryClient.setQueryData<PostsResponse>(queryKey, (old) =>
                old
                    ? {
                        ...old,
                        bookmarked: nextBookmarked,
                        bookmark_count: Math.max(
                            0,
                            old.bookmark_count +
                                (nextBookmarked ? 1 : -1),
                        ),
                    }
                    : old,
            )

            

            return { previous }
        },

        // rollback kalau gagal
        onError: (_err, _nextBookmarked, ctx) => {
            if (ctx?.previous) queryClient.setQueryData(queryKey, ctx.previous)
        },

        onSettled: () => {
            // queryClient.invalidateQueries({ queryKey });
            queryClient.invalidateQueries({queryKey : ["my-bookmark"]})
        },
    })

    return {
        bookmarked,
        loading: mutation.isPending,
        toggleBookmark: () => mutation.mutate(!bookmarked),
    }
}


export function usePostById(postId: string) {
    return useQuery({
        queryKey: ["posts", postId],
        queryFn: () => postsApi.client.getById(postId),
        enabled: !!postId,
    })
}


export function usePostDelete(username : string | undefined) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (postId: string) =>
            postsApi.client.deletePosts(postId),

        onSuccess: (_, postId) => {
            queryClient.removeQueries({
                queryKey: ["posts", postId],
            })

             queryClient.invalidateQueries({ queryKey: ["profiles", "posts", username] })


        },
    })
}

export function useMyBookmark() {
    return useQuery({
        queryKey : ["my-bookmark"],
        queryFn : () => postsApi.client.getMyBookmark(),
    })
}