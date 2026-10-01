"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Images, Loader2, Play, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { PostsCommentStatus } from "@/lib/type/posts";
import { postsApi } from "../api/posts.client";
import { toast } from "sonner";
import { resolvePublicMedia } from "@/lib/ImageUrlResolver";

const COMMENT_STATUS_OPTIONS: { value: PostsCommentStatus; label: string }[] = [
    { value: " AVAIBLE ", label: "Izinkan semua komentar" },
    { value: "NOT_AVAIBLE", label: "Matikan komentar" },
];

const DEFAULT_COMMENT_STATUS: PostsCommentStatus = " AVAIBLE ";
const MAX_FILES = 10;
const MAX_FILE_SIZE_MB = 10;
const MAX_CAPTION = 2200;
const ACCEPTED_TYPES = "image/*,video/*";

type MediaItem = {
    id: string;
    file: File;
    previewUrl: string;
    type: "IMAGE" | "VIDEO";
};

type CreatePostFormProps = {
    author?: { username: string; avatarUrl?: string | null };
    onCancel?: () => void;
    onSuccess?: () => void;
};

export function CreatePostForm({
    author,
    onCancel,
    onSuccess,
}: CreatePostFormProps) {
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [caption, setCaption] = useState("");
    const [commentStatus, setCommentStatus] =
        useState<PostsCommentStatus>(DEFAULT_COMMENT_STATUS);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
    // Selalu menyimpan media terbaru, supaya cleanup saat unmount tidak stale
    const mediaRef = useRef<MediaItem[]>([]);

    const commitMedia = useCallback((next: MediaItem[]) => {
        mediaRef.current = next;
        setMedia(next);
    }, []);

    // Revoke semua object URL saat komponen di-unmount
    useEffect(() => {
        return () => {
            mediaRef.current.forEach((item) => URL.revokeObjectURL(item.previewUrl));
        };
    }, []);

    // Sinkronkan slide aktif + pause video saat pindah slide
    useEffect(() => {
        if (!api) return;

        const onSelect = () => {
            setCurrent(api.selectedScrollSnap());
            Object.values(videoRefs.current).forEach((video) => video?.pause());
        };

        onSelect();
        api.on("select", onSelect);
        api.on("reInit", onSelect);
        return () => {
            api.off("select", onSelect);
            api.off("reInit", onSelect);
        };
    }, [api]);

    const addFiles = useCallback(
        (files: FileList | File[] | null) => {
            if (!files || files.length === 0) return;

            const existing = mediaRef.current;
            const remainingSlots = MAX_FILES - existing.length;

            if (remainingSlots <= 0) {
                setError(`Maksimal ${MAX_FILES} media per postingan.`);
                return;
            }

            const accepted: MediaItem[] = [];
            let nextError: string | null = null;

            for (const file of Array.from(files)) {
                if (accepted.length >= remainingSlots) {
                    nextError = `Maksimal ${MAX_FILES} media per postingan.`;
                    break;
                }

                const isImage = file.type.startsWith("image/");
                const isVideo = file.type.startsWith("video/");

                if (!isImage && !isVideo) {
                    nextError = `File "${file.name}" tidak didukung. Hanya foto dan video.`;
                    continue;
                }

                if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                    nextError = `File "${file.name}" terlalu besar (maks ${MAX_FILE_SIZE_MB}MB).`;
                    continue;
                }

                accepted.push({
                    id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
                    file,
                    previewUrl: URL.createObjectURL(file),
                    type: isImage ? "IMAGE" : "VIDEO",
                });
            }

            setError(nextError);
            if (accepted.length === 0) return;

            commitMedia([...existing, ...accepted]);

            // Lompat ke media pertama yang baru ditambahkan
            const jumpTo = existing.length;
            setTimeout(() => api?.scrollTo(jumpTo), 50);
        },
        [api, commitMedia],
    );

    const removeMedia = (id: string) => {
        const target = mediaRef.current.find((m) => m.id === id);
        if (target) URL.revokeObjectURL(target.previewUrl);
        delete videoRefs.current[id];
        commitMedia(mediaRef.current.filter((m) => m.id !== id));
        setError(null);
    };

    const openPicker = () => fileInputRef.current?.click();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        addFiles(e.target.files);
        // reset supaya bisa pilih file yang sama lagi
        e.target.value = "";
    };

    // ===== Drag & drop =====
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        if (e.currentTarget.contains(e.relatedTarget as Node)) return;
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        addFiles(e.dataTransfer.files);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (media.length === 0 || isSubmitting) return;

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("caption", caption.trim());
            formData.append("commentStatus", commentStatus);
            media.forEach((item) => formData.append("media", item.file));

            await postsApi.client.create(formData);

            media.forEach((item) => URL.revokeObjectURL(item.previewUrl));
            commitMedia([]);
            setCaption("");
            setCommentStatus(DEFAULT_COMMENT_STATUS);
            setCurrent(0);

            toast.success("Postingan berhasil dibagikan");
            onSuccess?.();
        } catch (err) {
            toast.error(
                err instanceof Error ? err.message : "Terjadi kesalahan. Coba lagi.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };
    const hasMedia = media.length > 0;
    const canSubmit = hasMedia && !isSubmitting;

    return (
        <form
            onSubmit={handleSubmit}
            className={cn(
                "mx-auto flex w-full max-w-4xl flex-col bg-background",
                "md:my-6 md:overflow-hidden md:rounded-xl md:border md:border-border",
            )}
        >
            {/* ===== Header ===== */}
            <header className="sticky top-0 z-20 grid h-12 shrink-0 grid-cols-[1fr_auto_1fr] items-center border-b border-border bg-background/90 px-2 backdrop-blur">
                <div className="flex justify-start">
                    {onCancel && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9"
                            onClick={onCancel}
                            aria-label="Kembali"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    )}
                </div>

                <h1 className="text-base font-semibold">Buat postingan baru</h1>

                <div className="flex justify-end">
                    <Button
                        type="submit"
                        variant="ghost"
                        disabled={!canSubmit}
                        className="h-9 px-3 text-sm font-semibold text-primary hover:bg-transparent hover:text-primary/80"
                    >
                        {isSubmitting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            "Bagikan"
                        )}
                    </Button>
                </div>
            </header>

            <div className="flex flex-col md:flex-row">
                {/* ===== Kiri: media ===== */}
                <section
                    className="flex flex-col md:w-3/5 md:border-r md:border-border"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    {!hasMedia ? (
                        <div
                            role="button"
                            tabIndex={0}
                            onClick={openPicker}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    openPicker();
                                }
                            }}
                            className={cn(
                                "flex aspect-square w-full cursor-pointer flex-col items-center justify-center gap-4 bg-muted/30 px-6 text-center transition-colors",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                                isDragging && "bg-muted/70 ring-2 ring-inset ring-primary",
                            )}
                        >
                            <Images
                                className="h-16 w-16 text-foreground"
                                strokeWidth={1.25}
                            />
                            <div className="space-y-1">
                                <p className="text-lg font-light text-foreground">
                                    Seret foto dan video ke sini
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Maksimal {MAX_FILES} file, masing-masing hingga{" "}
                                    {MAX_FILE_SIZE_MB}MB
                                </p>
                            </div>
                            <Button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openPicker();
                                }}
                            >
                                Pilih dari perangkat
                            </Button>
                        </div>
                    ) : (
                        <>
                            {/* Preview utama */}
                            <div
                                className={cn(
                                    "relative w-full bg-muted/30",
                                    isDragging && "ring-2 ring-inset ring-primary",
                                )}
                            >
                                <Carousel setApi={setApi} className="w-full">
                                    <CarouselContent className="ml-0">
                                        {media.map((item) => (
                                            <CarouselItem key={item.id} className="pl-0">
                                                <div className="relative flex aspect-square w-full items-center justify-center bg-muted/30">
                                                    {item.type === "IMAGE" ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img
                                                            src={item.previewUrl}
                                                            alt={item.file.name}
                                                            className="h-full w-full object-contain"
                                                            draggable={false}
                                                        />
                                                    ) : (
                                                        <video
                                                            ref={(el) => {
                                                                videoRefs.current[item.id] = el;
                                                            }}
                                                            src={item.previewUrl}
                                                            controls
                                                            playsInline
                                                            preload="metadata"
                                                            className="h-full w-full object-contain"
                                                        />
                                                    )}
                                                </div>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>

                                    {media.length > 1 && (
                                        <>
                                            <CarouselPrevious className="left-2 hidden h-8 w-8 border-0 bg-background/80 backdrop-blur hover:bg-background md:inline-flex" />
                                            <CarouselNext className="right-2 hidden h-8 w-8 border-0 bg-background/80 backdrop-blur hover:bg-background md:inline-flex" />
                                        </>
                                    )}
                                </Carousel>

                                {/* Penghitung slide */}
                                {media.length > 1 && (
                                    <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-background/80 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur">
                                        {current + 1}/{media.length}
                                    </span>
                                )}

                                {/* Dots */}
                                {media.length > 1 && (
                                    <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
                                        {media.map((item, i) => (
                                            <span
                                                key={item.id}
                                                className={cn(
                                                    "h-1.5 w-1.5 rounded-full transition-colors",
                                                    i === current
                                                        ? "bg-primary"
                                                        : "bg-background/80",
                                                )}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Strip thumbnail */}
                            <div className="flex items-center gap-2 overflow-x-auto border-t border-border p-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                {media.map((item, i) => (
                                    <div key={item.id} className="relative shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => api?.scrollTo(i)}
                                            aria-label={`Lihat media ${i + 1}`}
                                            className={cn(
                                                "relative block h-16 w-16 overflow-hidden rounded-md border-2 bg-muted transition-opacity",
                                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                                i === current
                                                    ? "border-primary"
                                                    : "border-transparent opacity-60 hover:opacity-100",
                                            )}
                                        >
                                            {item.type === "IMAGE" ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={item.previewUrl}
                                                    alt=""
                                                    className="h-full w-full object-cover"
                                                    draggable={false}
                                                />
                                            ) : (
                                                <>
                                                    <video
                                                        src={item.previewUrl}
                                                        preload="metadata"
                                                        muted
                                                        playsInline
                                                        className="h-full w-full object-cover"
                                                    />
                                                    <span className="absolute inset-0 flex items-center justify-center bg-background/30">
                                                        <Play className="h-4 w-4 fill-foreground text-foreground" />
                                                    </span>
                                                </>
                                            )}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => removeMedia(item.id)}
                                            aria-label="Hapus media"
                                            className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm hover:bg-muted"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}

                                {media.length < MAX_FILES && (
                                    <button
                                        type="button"
                                        onClick={openPicker}
                                        aria-label="Tambah media"
                                        className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    >
                                        <Plus className="h-6 w-6" />
                                    </button>
                                )}
                            </div>
                        </>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={ACCEPTED_TYPES}
                        multiple
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </section>

                {/* ===== Kanan: caption & pengaturan ===== */}
                <section className="flex flex-col pb-6 md:w-2/5 md:pb-0">
                    {author && (
                        <div className="flex items-center gap-3 px-4 pt-4">
                            <Avatar className="h-8 w-8">
                                <AvatarImage
                                    src={resolvePublicMedia(author.avatarUrl || "")}
                                    alt={author.username}
                                />
                                <AvatarFallback className="text-xs">
                                    {author.username.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-semibold">{author.username}</span>
                        </div>
                    )}

                    <div className="px-4 pt-3">
                        <Label htmlFor="caption" className="sr-only">
                            Caption
                        </Label>
                        <Textarea
                            id="caption"
                            placeholder="Tulis keterangan..."
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            maxLength={MAX_CAPTION}
                            className="min-h-32 resize-none border-0 bg-transparent px-0 text-base shadow-none focus-visible:ring-0 md:min-h-56 md:text-sm"
                        />
                        <p className="pb-2 text-right text-xs text-muted-foreground">
                            {caption.length.toLocaleString("id-ID")}/
                            {MAX_CAPTION.toLocaleString("id-ID")}
                        </p>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between gap-6 px-5 py-3.5">
                        <Label className="shrink-0 text-sm font-normal">
                            Komentar
                        </Label>

                        <Select
                            value={commentStatus}
                            onValueChange={(v) => setCommentStatus(v as PostsCommentStatus)}
                        >
                            <SelectTrigger
                                className="
                h-9 w-auto min-w-[10rem] max-w-[15rem]
                border-0 bg-transparent
                px-3 text-sm
                shadow-none
                focus:ring-0
                focus:ring-offset-0
            "
                            >
                                <SelectValue placeholder="Pilih status komentar" />
                            </SelectTrigger>

                            <SelectContent align="end" className="min-w-[12rem]">
                                {COMMENT_STATUS_OPTIONS.map((opt) => (
                                    <SelectItem
                                        key={opt.value}
                                        value={opt.value}
                                        className="pr-9"
                                    >
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Separator />

                    {error && (
                        <div className="px-4 pt-4">
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        </div>
                    )}
                </section>
            </div>
        </form>
    );
}