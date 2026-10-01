import { UserStatus, UserRole } from "./user";

export type ProfilesVisibility = "PUBLIC" | "PRIVATE"

export type DetailProfileDTO = {
  id: string;
  display_name: string;
  bio: string | null;
  avatar_url: string;
  banner_url: string | null;
  visibility: ProfilesVisibility;
  username: string;
  user_status: UserStatus;
  user_role: UserRole;
};