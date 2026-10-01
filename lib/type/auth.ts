import { UserRole, UserStatus } from "./user";


export interface UserCredentials {
    id : string,
    role : UserRole,
    status : UserStatus,
    username : string

}