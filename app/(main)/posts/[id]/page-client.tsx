"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { PostDetail } from "@/features/posts/component/posts-detail";
import { usePostById, usePostDelete } from "@/features/posts/hooks/use-posts";
import { useAuthStore } from "@/lib/store/auth-store";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/api";
import { useRouter } from "next/navigation";

type PostDetailPageClientProps = {
    id: string;
};

export function PostDetailPageClient({
    id,
}: PostDetailPageClientProps) {


    const { data, isPending, isError, refetch } = usePostById(id)
    const profile = useAuthStore((state) => state.user)

    const mutation = usePostDelete(profile?.username)
    const router = useRouter()

    const handleDelete = (id: string) => {
        if (!data) {
            toast.error("postingan tidak dtemukan!")
        }

        if (profile == null || profile.id != data?.author.id) {
            toast.error("kamu tidak bisa menghapus postingan ini!")
            return
        }


        try {
            mutation.mutate(data.posts_id)
            toast.success("berhasil menghapus postingan!")

            router.push("/my-profile")

        } catch (error) {
            if (error instanceof ApiError) {
                toast.error(error.message)
            }
        }




    }



    if (isPending) {
        return <PostDetailSkeleton />;
    }

    if (isError || !data) {
        return (
            <main className="flex min-h-screen items-center justify-center px-4">
                <div className="flex flex-col items-center text-center">
                    <h1 className="text-lg font-semibold">
                        Postingan tidak dapat dimuat
                    </h1>

                    <p className="mt-2 text-sm text-muted-foreground">
                        Postingan mungkin sudah dihapus atau terjadi
                        kesalahan saat mengambil data.
                    </p>

                    <div className="mt-5 flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={() => refetch()}
                        >
                            Coba lagi
                        </Button>

                        <Button>
                            <Link href="/">Kembali</Link>
                        </Button>
                    </div>
                </div>
            </main>
        );
    }

    return <PostDetail profile={profile} onDelete={(id: string) => {

        try {
            handleDelete(id)

        } catch (error) {
            if (error instanceof ApiError) {
                toast.error(error.message)
            }
        }

    }} post={data} />;
}

function PostDetailSkeleton() {
    return (
        <main className="min-h-screen bg-background">
            <div className="flex h-14 items-center border-b px-4 md:h-16">
                <Skeleton className="h-9 w-9 rounded-full" />
                <Skeleton className="ml-3 h-4 w-24" />
            </div>

            <div className="mx-auto w-full max-w-6xl p-0 md:p-6">
                <div
                    className="
                        grid
                        overflow-hidden
                        border-y
                        md:min-h-[600px]
                        md:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]
                        md:rounded-xl
                        md:border
                    "
                >
                    <Skeleton className="aspect-[4/5] w-full rounded-none md:aspect-auto" />

                    <div className="space-y-6 p-4">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-full" />

                            <div className="space-y-2">
                                <Skeleton className="h-4 w-28" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                        </div>

                        <Skeleton className="h-20 w-full" />

                        <div className="flex flex-1 items-center justify-center">
                            <Skeleton className="h-20 w-20 rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}