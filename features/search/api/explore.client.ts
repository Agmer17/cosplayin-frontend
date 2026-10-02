import { clientApi } from "@/lib/api/client-api";
import { PostsResponse } from "@/lib/type/posts";
import { DetailProfileDTO } from "@/lib/type/profile";

export const exploreApi = {
    searchPosts: async (query: string) => {
        const data = await clientApi.get<PostsResponse[]>("/posts", {
            params: { query },
        });

        return data;
    },

    searchUsers: async (query: string) => {
        const data = await clientApi.get<DetailProfileDTO[]>(
            "/profiles/search",
            {
                params: { q : query },
            }
        );

        return data;
    },
};