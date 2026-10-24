"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Play, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

type FeedVideoPlayerProps = {
    src: string;
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
    const [isBuffering, setIsBuffering] = useState(false);
    const [hasError, setHasError] = useState(false);

    const [loaded, setLoaded] = useState(isActive);
    if (isActive && !loaded) setLoaded(true);

    useEffect(() => {
        if (videoRef.current) videoRef.current.muted = muted;
    }, [muted]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !loaded) return;

        if (isActive) {
            video.play().catch(() => { });
        } else {
            video.pause();
            video.currentTime = 0;
        }
    }, [isActive, loaded]);

    useEffect(() => {
        const video = videoRef.current;
        return () => {
            if (!video) return;
            video.pause();
            video.removeAttribute("src");
            video.load();
        };
    }, []);

    const togglePlay = () => {
        const video = videoRef.current;
        if (!video) return;
        if (video.paused) video.play().catch(() => { });
        else video.pause();
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
                src={loaded ? src : undefined}
                poster={poster}
                muted={muted}
                loop
                playsInline
                preload="metadata"
                disablePictureInPicture
                controlsList="nodownload noremoteplayback"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onWaiting={() => setIsBuffering(true)}
                onCanPlay={() => setIsBuffering(false)}
                onPlaying={() => setIsBuffering(false)}
                onError={() => setHasError(true)}
                onClick={togglePlay}
                className="block max-h-[80vh] max-w-full cursor-pointer object-contain"
            />

            {/* play icon: hanya untuk slide aktif yang sedang pause */}
            <div
                className={cn(
                    "pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-200",
                    isActive && !isPlaying && !hasError ? "opacity-100" : "opacity-0",
                )}
            >
                <div className="flex size-16 items-center justify-center rounded-full bg-black/50 text-white">
                    <Play className="size-8 fill-white" />
                </div>
            </div>

            {/* spinner buffering */}
            {isActive && isBuffering && isPlaying && !hasError && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <Loader2 className="size-8 animate-spin text-white/80" />
                </div>
            )}

            {/* fallback error */}
            {hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-sm text-white">
                    Video gagal dimuat
                </div>
            )}

            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    onToggleMute();
                }}
                aria-label={muted ? "Unmute video" : "Mute video"}
                className="absolute bottom-3 right-3 flex size-8 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
            >
                {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
            </button>
        </div>
    );
}