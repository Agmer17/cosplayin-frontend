"use client";

import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

import type { PostsMediaResponse } from "@/lib/type/posts";
import { resolveMediaUrl } from "@/lib/image-url-resolver";
import { useEffect, useState } from "react";
import { FeedVideoPlayer } from "./posts-video-player";
import { useInView } from "../hooks/use-in-view-posts";

type PostDetailMediaProps = {
    media: PostsMediaResponse[];
    caption: string;
};

export function PostDetailMedia({ media, caption }: PostDetailMediaProps) {
    const sortedMedia = [...media].sort(
        (a, b) => a.display_order - b.display_order,
    );

    const [api, setApi] = useState<CarouselApi>();
    const [selectedIndex, setSelectedIndex] = useState(0);

    const [containerRef, inView] = useInView<HTMLDivElement>(0.6);

    const [soundEnabled, setSoundEnabled] = useState(true);

    const toggleSound = () => {
        setSoundEnabled((prev) => !prev);
    };

    useEffect(() => {
        if (!api) return;

        const onSelect = () => setSelectedIndex(api.selectedScrollSnap());

        onSelect();
        api.on("select", onSelect);
        api.on("reInit", onSelect);

        return () => {
            api.off("select", onSelect);
            api.off("reInit", onSelect);
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
        <div ref={containerRef}>
            <Carousel setApi={setApi} className="relative w-full bg-background!">
                <CarouselContent className="bg-background!">
                    {sortedMedia.map((item, index) => (
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
                                <FeedVideoPlayer
                                    src={resolveMediaUrl(item.media_url)}
                                    isActive={inView && index === selectedIndex}
                                    muted={!soundEnabled}
                                    onToggleMute={toggleSound}
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

        </div>
    );
}