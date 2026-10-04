"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

type FeedVideoPlayerProps = {
    src: string;
    /** true = video aktif (slide yang sedang tampil) -> autoplay. false -> pause & reset */
    isActive?: boolean;
    muted: boolean;
    onToggleMute: () => void;
    poster?: string;
    className?: string;
};

export function FeedVideoPlayer({
    src,
    isActive = true,
    muted,
    onToggleMute,
    poster,
    className,
}: FeedVideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // autoplay saat slide aktif, pause + reset saat pindah slide
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (isActive) {
            video.play().catch(() => {
                // autoplay diblokir browser -> user tinggal tap
            });
        } else {
            video.pause();
            video.currentTime = 0;
        }
    }, [isActive]);

    const togglePlay = () => {
        const video = videoRef.current;
        if (!video) return;

        if (video.paused) {
            video.play().catch(() => { });
        } else {
            video.pause();
        }
    };

    return (
        <div
            className={cn(
                "relative flex max-h-[80vh] max-w-full items-center justify-center",
                className,
            )}
        >
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                muted={muted}
                loop
                playsInline
                preload="metadata"
                disablePictureInPicture
                controlsList="nodownload noremoteplayback"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onClick={togglePlay}
                className="block max-h-[80vh] max-w-full cursor-pointer object-contain"
            />

            {/* icon play di tengah, muncul pas video di-pause */}
            <div
                className={cn(
                    "pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-200",
                    isPlaying ? "opacity-0" : "opacity-100",
                )}
            >
                <div className="flex size-16 items-center justify-center rounded-full bg-black/50 text-white">
                    <Play className="size-8 fill-white" />
                </div>
            </div>

            {/* tombol mute */}
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    onToggleMute();
                }}
                aria-label={muted ? "Unmute video" : "Mute video"}
                className="absolute bottom-3 right-3 flex size-8 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
            >
                {muted ? (
                    <VolumeX className="size-4" />
                ) : (
                    <Volume2 className="size-4" />
                )}
            </button>
        </div>
    );
}