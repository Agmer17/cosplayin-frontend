import { DetailProfileDTO } from "./profile";

export type SupportedFileType = "VIDEO" | "AUDIO" | "IMAGE" | "DOCUMENT" | "ANY"
export type PostsStatus = "VISIBLE" | "HIDDEN"
export type PostsCommentStatus = " AVAIBLE " | "NOT_AVAIBLE"

export type PostsMediaResponse = {
  media_id: string;
  posts_id: string;
  media_url: string;
  media_type: SupportedFileType;
  display_order: number;
  created_at: string;
};

export type PostsResponse = {
  posts_id: string;
  author: DetailProfileDTO;
  caption: string;
  status: PostsStatus;
  comment_availability: PostsCommentStatus;
  like_count: number;
  bookmark_count: number;
  share_count: number;
  created_at: string;
  liked: boolean;
  bookmarked: boolean;
  media: PostsMediaResponse[];
};