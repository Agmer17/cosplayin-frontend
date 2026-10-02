import { serverApi } from "@/lib/api/server-api"
import { PostsResponse } from "@/lib/type/posts"

export const postsServerApi = {
    getSearch : (query : string, page  : number =0) => 
        serverApi.get<PostsResponse[]>("/posts", {params : {
            "query" : query,
            "page" : page
        }})
    
}