import { profileClientApi } from "@/features/profiles/api/profile.client"

export async function isUsernameAvaible(username: string) {

    const used = await profileClientApi.isUsernameAvaible(username)

    return used

}