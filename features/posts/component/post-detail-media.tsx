
"use client";

import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Play } from "lucide-react";

import type { PostsMediaResponse } from "@/lib/type/posts";
import { resolveMediaUrl } from "@/lib/ImageUrlResolver";
import { useEffect, useRef, useState } from "react";

type PostDetailMediaProps = {
    media: PostsMediaResponse[];
    caption: string;
};

export function PostDetailMedia({
    media,
    caption,
}: PostDetailMediaProps) {
    const sortedMedia = [...media].sort(
        (a, b) => a.display_order - b.display_order,
    );

    const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
    const [api, setApi] = useState<CarouselApi>();


    useEffect(() => {
        if (!api) return;

        const stopVideos = () => {
            Object.values(videoRefs.current).forEach((video) => {
                video?.pause();
            });
        };

        api.on("select", stopVideos);

        return () => {
            api.off("select", stopVideos);
        };
    }, [api]);
    if (sortedMedia.length === 0) {
        return (
            <div className="flex aspect-square w-full items-center justify-center bg-muted">
                <p className="text-sm text-muted-foreground">
                    Media tidak tersedia.
                </p>
            </div>
        );
    }



    return (
        <Carousel
            setApi={setApi}
            className="relative w-full bg-background!"
        >
            <CarouselContent className="bg-background!">
                {sortedMedia.map((item) => (
                    <CarouselItem
                        key={item.media_id}
                        className="relative bg-background! flex basis-full items-center justify-center"
                    >
                        {item.media_type === "IMAGE" && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={resolveMediaUrl(item.media_url)}
                                alt={caption || "Post image"}
                                className="max-h-[80vh] max-w-full object-contain"
                            />
                        )}

                        {item.media_type === "VIDEO" && (
                            <video
                                ref={(el) => {
                                    videoRefs.current[item.media_id] = el;
                                }}
                                src={resolveMediaUrl(item.media_url)}
                                controls
                                playsInline
                                preload="metadata"
                                className="max-h-[80vh] max-w-full object-contain"
                            />
                        )}

                        {item.media_type !== "IMAGE" &&
                            item.media_type !== "VIDEO" && (
                                <div className="flex aspect-square w-full items-center justify-center bg-muted text-muted-foreground">
                                    <p className="text-sm">
                                        Media ini belum didukung di viewer.
                                    </p>
                                </div>
                            )}
                    </CarouselItem>
                ))}
            </CarouselContent>

            {sortedMedia.length > 1 && (
                <>
                    <CarouselPrevious className="left-3" />
                    <CarouselNext className="right-3" />
                </>
            )}
        </Carousel>
    );
}

