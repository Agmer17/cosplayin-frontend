import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

export function NotificationSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i}>
                    <div className="flex items-start gap-3 px-4 py-3">
                        <Skeleton className="size-10 shrink-0 rounded-full" />
                        <div className="flex-1 space-y-2 pt-1">
                            <Skeleton className="h-3.5 w-3/4" />
                            <Skeleton className="h-3 w-1/4" />
                        </div>
                        <Skeleton className="size-11 shrink-0 rounded-md" />
                    </div>
                    {i < count - 1 && <Separator />}
                </div>
            ))}
        </div>
    )
}