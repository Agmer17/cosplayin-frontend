import { PostDetailPageClient } from "./page-client";

type PostPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function PostPage({
    params,
}: PostPageProps) {
    const { id } = await params;

    return <PostDetailPageClient id={id} />;
}