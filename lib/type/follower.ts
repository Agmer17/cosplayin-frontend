import { SimpleProfileDTO } from "./profile"

export type FollowStatus = "NONE" | "FOLLOWING" | "PENDING";


export type FollowerResponse =  {

    user : SimpleProfileDTO
    status : FollowStatus
    created_at : string
}