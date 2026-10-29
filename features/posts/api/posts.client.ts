import { RequestOptions } from "@/lib/api/api"
import { clientApi } from "@/lib/api/client-api"
import { PostsLikeDetailResponse, PostsResponse } from "@/lib/type/posts"
export const postsApi = {
    client : {
        getMyPosts : (username : string, options? : RequestOptions) => 
            clientApi.get<PostsResponse[]>("/users/" + username +"/posts", options),
        
        getById : (id : string) => 
            clientApi.get<PostsResponse>("/posts/" + id),

        create : (form : FormData, options? : RequestOptions) => 
            clientApi.post<PostsResponse>("/posts", form,options),

        likePosts : (id : string, options? : RequestOptions) => 
            clientApi.post<string>("/posts/" +id + "/likes", null, options),

        unlikePosts : (id : string) => 
            clientApi.delete("/posts/" + id + "/likes"),

        getMyLikedPosts : () => 
                clientApi.get<PostsResponse[]>("/profiles/me/likes"),

        getOtherLikesPosts : (username : string) => 
            clientApi.get<PostsResponse[]>("/users/" + username +"/likes"),

        getPostLikeDetails : (id : string) =>
            clientApi.get<PostsLikeDetailResponse[]>("/posts/" + id + "/likes"),
        
        addToBookmark : (id : string) => 
            clientApi.post("/posts/" + id + "/bookmark", null),
        deleteBookmark : (id : string) => 
            clientApi.delete("/posts/" + id + "/bookmark"),

        deletePosts : (id : string) => 
            clientApi.delete("/posts/"+ id),

        getFeed :  () => 
            clientApi.get<PostsResponse[]>("/posts/feed"),

        getMyBookmark : () => 
            clientApi.get<PostsResponse[]>("/profiles/me/bookmark")
        
    

    }
}