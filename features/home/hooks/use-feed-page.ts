import { postsApi } from "@/features/posts/api/posts.client"
import { useQuery } from "@tanstack/react-query"
import { feedQueryKey } from "./keys"

export function useFeedData() {
    

    return useQuery({
        queryKey : feedQueryKey.feed,
        queryFn : () => postsApi.client.getFeed(),
    })

}