
"use client"
import { CreatePostForm } from "@/features/posts/component/create-post-form";
import { useAuthStore } from "@/lib/store/auth-store";
import { useRouter } from "next/navigation";

export default function CreatePostPage() {
    const user = useAuthStore((state) => state.user)
    const router = useRouter()

    return (
        <main className="min-h-screen bg-background px-4 py-6 md:px-6">
            <CreatePostForm
                onSuccess={() => {
                    router.push("/my-profile")
                }}
                author={
                    {
                        username: user?.username || "",
                        avatarUrl: user?.avatar_url
                    }
                }
            />
        </main>
    );
}