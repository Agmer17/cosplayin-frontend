import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postsApi } from "../api/posts.client";
import type { PostsResponse } from "@/lib/type/posts";
import { useQuery } from "@tanstack/react-query";


export function usePostsLike(postId: string, liked: boolean) {
    const queryClient = useQueryClient();
    const queryKey = ["posts", postId];

    const mutation = useMutation({
        mutationFn: (nextLiked: boolean) =>
            nextLiked
                ? postsApi.client.likePosts(postId)
                : postsApi.client.unlikePosts(postId),

        // optimistic update langsung ke cache
        onMutate: async (nextLiked) => {
            await queryClient.cancelQueries({ queryKey });

            const previous = queryClient.getQueryData<PostsResponse>(queryKey);

            queryClient.setQueryData<PostsResponse>(queryKey, (old) =>
                old ? { ...old, liked: nextLiked } : old,
            );

            return { previous };
        },

        // rollback kalau gagal
        onError: (_err, _nextLiked, ctx) => {
            if (ctx?.previous) queryClient.setQueryData(queryKey, ctx.previous);
        },

        // sinkronkan dengan server setelah selesai
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey });
            queryClient.invalidateQueries({ queryKey: ["my-likes"] });
        },
    });

    return {
        liked,
        loading: mutation.isPending,
        toggleLike: () => mutation.mutate(!liked),
    };
}



export function usePostsBookmark(postId: string, bookmarked: boolean) {
    const queryClient = useQueryClient();
    const queryKey = ["posts", postId];

    const mutation = useMutation({
        mutationFn: (nextBookmarked: boolean) =>
            nextBookmarked
                ? postsApi.client.addToBookmark(postId)
                : postsApi.client.deleteBookmark(postId),

        onMutate: async (nextBookmarked) => {
            await queryClient.cancelQueries({ queryKey });

            const previous = queryClient.getQueryData<PostsResponse>(queryKey);

            queryClient.setQueryData<PostsResponse>(queryKey, (old) =>
                old ? { ...old, bookmarked: nextBookmarked } : old,
            );

            return { previous };
        },

        // rollback kalau gagal
        onError: (_err, _nextBookmarked, ctx) => {
            if (ctx?.previous) queryClient.setQueryData(queryKey, ctx.previous);
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });

    return {
        bookmarked,
        loading: mutation.isPending,
        toggleBookmark: () => mutation.mutate(!bookmarked),
    };
}


export function usePostById(postId: string) {
    return useQuery({
        queryKey: ["posts", postId],
        queryFn: () => postsApi.client.getById(postId),
        enabled: !!postId,
    });
}


export function usePostDelete(username : string | undefined) {


    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (postId: string) =>
            postsApi.client.deletePosts(postId),

        onSuccess: (_, postId) => {
            queryClient.removeQueries({
                queryKey: ["posts", postId],
            });

             queryClient.invalidateQueries({ queryKey: ["profiles", "posts", username] });


        },
    });
}