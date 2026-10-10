export interface CommentResponse {
    id: string;
    posts_id: string;
    comment: string;
    profile_picture: string | null;
    reply_count: number;
    username: string;
    parent_id: string | null;
    like_count: number;
    created_at: string;
    is_liked?: boolean;
}

export interface CreateCommentDto {
    comment: string;
    replyTo: string | null;
}