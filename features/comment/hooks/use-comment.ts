import {
    useMutation,
    useQuery,
    useQueryClient,
    type QueryKey,
} from "@tanstack/react-query";

import { commentsApi } from "../api/comment-api";
import type {
    CommentResponse,
    CreateCommentDto,
} from "@/lib/type/comment";
import { PostsResponse } from "@/lib/type/posts";

// Semua query komentar berada di bawah prefix ini.
export const commentKeys = {
    all: ["comments"] as const,

    posts: () => [...commentKeys.all, "post"] as const,

    post: (postId: string) =>
        [...commentKeys.posts(), postId] as const,

    replies: () => [...commentKeys.all, "replies"] as const,

    repliesFor: (commentId: string) =>
        [...commentKeys.replies(), commentId] as const,
};

// Ambil komentar utama dari sebuah postingan.
export function usePostComments(postId: string) {
    return useQuery({
        queryKey: commentKeys.post(postId),
        queryFn: () => commentsApi.getPostComments(postId),
        enabled: Boolean(postId),
    });
}

// Balasan hanya di-fetch ketika komponen membuka balasannya.
export function useCommentReplies(
    commentId: string,
    enabled = true
) {
    return useQuery({
        queryKey: commentKeys.repliesFor(commentId),
        queryFn: () => commentsApi.getReplies(commentId),
        enabled: Boolean(commentId) && enabled,
    });
}

export function useCreateComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateCommentDto) =>
      commentsApi.createComment(postId, dto),

    onSuccess: async (newComment, dto) => {
      // Update comment_count di post detail
      queryClient.setQueryData<PostsResponse>(
        ["posts", postId],
        (old) =>
          old
            ? { ...old, comment_count: old.comment_count + 1 }
            : old
      );

      const invalidations: Promise<unknown>[] = [
        queryClient.invalidateQueries({
          queryKey: commentKeys.post(postId),
        }),
      ];

      if (dto.replyTo) {
        const bumpReplyCount = (comments: CommentResponse[] | undefined) => {
          if (!comments) return comments;
          return comments.map((c) =>
            c.id === dto.replyTo
              ? { ...c, reply_count: (c.reply_count ?? 0) + 1 }
              : c
          );
        };

        queryClient.setQueryData<CommentResponse[]>(
          commentKeys.post(postId),
          bumpReplyCount
        );

        queryClient.setQueriesData<CommentResponse[]>(
          { queryKey: commentKeys.replies() },
          bumpReplyCount
        );

        invalidations.push(
          queryClient.invalidateQueries({
            queryKey: commentKeys.repliesFor(dto.replyTo),
          })
        );
      }

      await Promise.all(invalidations);
    },
  });
}

// Hapus komentar.
export function useDeleteComment(postId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (commentId: string) =>
            commentsApi.deleteComment(commentId),

        onSuccess: async () => {

             queryClient.setQueryData<PostsResponse>(
                ["posts", postId],
                (old) =>
                    old
                        ? {
                              ...old,
                              comment_count: old.comment_count - 1,
                          }
                        : old,
            );

            await queryClient.invalidateQueries({
                queryKey: commentKeys.all,
            });

            await queryClient.invalidateQueries({
                queryKey: commentKeys.post(postId),
            });
        },
    });
}

type PreviousCommentQueries = Array<
    [QueryKey, CommentResponse[] | undefined]
>;

// Like komentar dengan optimistic update.
export function useToggleCommentLike() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (commentId: string) =>
            commentsApi.toggleLike(commentId),

        onMutate: async (commentId) => {
            await queryClient.cancelQueries({
                queryKey: commentKeys.all,
            });

            const previous =
                queryClient.getQueriesData<CommentResponse[]>({
                    queryKey: commentKeys.all,
                }) as PreviousCommentQueries;

            // Komentar bisa ada di query utama maupun query replies.
            for (const [key] of previous) {
                queryClient.setQueryData<CommentResponse[]>(
                    key,
                    (comments) =>
                        comments?.map((comment) => {
                            if (comment.id !== commentId) {
                                return comment;
                            }

                            const wasLiked =
                                comment.is_liked ?? false;

                            return {
                                ...comment,
                                is_liked: !wasLiked,
                                like_count: Math.max(
                                    0,
                                    comment.like_count +
                                        (wasLiked ? -1 : 1)
                                ),
                            };
                        })
                );
            }

            return { previous };
        },

        onError: (_error, _commentId, context) => {
            // Kembalikan cache jika request gagal.
            context?.previous.forEach(([key, data]) => {
                queryClient.setQueryData(key, data);
            });
        },

        onSettled: async () => {
            // Sinkronkan cache dengan data dari backend.
            await queryClient.invalidateQueries({
                queryKey: commentKeys.all,
            });
        },
    });
}