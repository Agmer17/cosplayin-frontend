import { SimpleProfileDTO } from "./profile"

export type FollowStatus = "NONE" | "FOLLOWING" | "REQUESTED";


export type FollowerResponse =  {

    user : SimpleProfileDTO
    status : FollowStatus
    created_at : string
}