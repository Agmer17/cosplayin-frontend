
export type NotificationType = 
  | 'POST_LIKE' 
  | 'COMMENT_LIKE' 
  | 'POST_COMMENT' 
  | "COMMENT_REPLY"
  | "FOLLOW"

export interface PostsPreviewNotificationDTO {
  postId: string; 
  thumbnail: string;
}

export interface CommentPreviewDTO {
  comment: string;
  created_at: string; 
}

export interface ActorNotificationPreview {
  user_id: string;
  username: string;
  profile_picture: string;
}

export interface NotificationResponse {
  id: string;
  post_preview: PostsPreviewNotificationDTO;
  comment_preview: CommentPreviewDTO;
  notification_type: NotificationType;
  actors: ActorNotificationPreview[];
  actor_count: number;
  created_at: string;
  last_activity_at: string;
  read_at: string | null; 
}