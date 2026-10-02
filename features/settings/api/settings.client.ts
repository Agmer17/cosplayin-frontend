// lib/api/settings.ts
import { profileClientApi } from "@/features/profiles/api/profile.client"
import type { DetailProfileDTO, ProfilesVisibility } from "@/lib/type/profile"

export type Gender = "MALE" | "FEMALE" | "FEMBOY" // samakan dengan enum Gender di BE

export type UpdateProfilePayload = {
  displayName: string
  bio: string
  avatar?: File | null
  banner?: File | null
  visibility: ProfilesVisibility
  gender?: Gender
}


export async function updateProfile(
  payload: UpdateProfilePayload,
  current: DetailProfileDTO
): Promise<DetailProfileDTO> {
  const fd = new FormData()
  fd.append("displayName", payload.displayName)
  fd.append("bio", payload.bio)
  fd.append("visibility", payload.visibility)
  if (payload.gender) fd.append("gender", payload.gender)
  if (payload.avatar) fd.append("avatar", payload.avatar)
  if (payload.banner) fd.append("banner", payload.banner)

  const updated = await profileClientApi.updateMyProfile(fd)

  return {
    ...current,
    display_name: payload.displayName,
    bio: payload.bio || null,
    visibility: payload.visibility,
    avatar_url: updated.avatar_url,
    banner_url: updated.banner_url,
  }
}

export async function updateUsername(username: string): Promise<{ username: string }> {
  await profileClientApi.updateMyUsername(username)
  return { username }
}