import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <main className="min-h-screen bg-background">
            <div className="flex h-14 items-center border-b px-4 md:h-16">
                <Skeleton className="h-9 w-9 rounded-full" />
                <Skeleton className="ml-3 h-4 w-24" />
            </div>

            <div className="mx-auto w-full max-w-6xl p-0 md:p-6">
                <div className="grid md:grid-cols-[1.15fr_0.85fr] md:rounded-xl">
                    <Skeleton className="aspect-square w-full rounded-none md:aspect-auto md:min-h-[600px]" />

                    <div className="space-y-5 p-4">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-full" />

                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                        </div>

                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-48 w-full" />
                    </div>
                </div>
            </div>
        </main>
    );
}