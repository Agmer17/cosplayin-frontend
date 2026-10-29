import { clientApi } from "@/lib/api/client-api";
import type {
    CommentResponse,
    CreateCommentDto,
} from "@/lib/type/comment";

export const commentsApi = {
    getPostComments: async (postId: string) => {
        const data = await clientApi.get<CommentResponse[]>(
            `/posts/${postId}/comment`
        );

        return data;
    },

    getReplies: async (commentId: string) => {
        const data = await clientApi.get<CommentResponse[]>(
            `/comment/${commentId}/replies`
        );

        return data;
    },

    createComment: async (
        postId: string,
        dto: CreateCommentDto
    ) => {
        const data = await clientApi.post<CommentResponse>(
            `/posts/${postId}/comment`,
            dto
        );

        return data;
    },

    deleteComment: async (commentId: string) => {
        const data = await clientApi.delete<unknown>(
            `/comment/${commentId}`
        );

        return data;
    },

    createLikeComment: async (commentId: string) => {
        const data = await clientApi.post<unknown>(
            `/comment/${commentId}/likes`
        );

        return data;
    },
    deleteLikeComment: async (commentId: string) => {
        const data = await clientApi.delete<unknown>(
            `/comment/${commentId}/likes`
        );

        return data;
    },
};