// components/onboarding-image-upload.tsx  (atau image-upload-with-crop.tsx)
"use client"

import { useRef, useState } from "react"
import { Camera, ImageIcon, X } from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ImageCropDialog, type CropAspect } from "@/components/image/ImageCropping"

interface ImageUploadWithCropProps {
    id: string;
    aspect: CropAspect;
    /** File hasil crop (sudah jadi File) */
    value: File | null;
    onChange: (file: File | null) => void;
    error?: string;
    /** Untuk avatar biasanya lingkaran, banner rectangular */
    className?: string;
    /** Preview shape */
    shape?: "circle" | "rounded";
    label?: string;
    /** Max size in MB */
    maxSizeMB?: number;
}

const ACCEPTED = "image/jpeg,image/png,image/webp,image/gif"

export function ImageUploadWithCrop({
    id,
    aspect,
    value,
    onChange,
    error,
    className,
    shape = "rounded",
    label,
    maxSizeMB = 5,
}: ImageUploadWithCropProps) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [pendingFile, setPendingFile] = useState<File | null>(null)
    const [cropOpen, setCropOpen] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    // Sync preview dari value
    // (bisa diganti useEffect jika value berubah dari luar)
    if (value && !previewUrl) {
        // fallback — idealnya pakai useEffect
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Reset input supaya bisa pilih file yang sama lagi
        e.target.value = ""

        if (!file.type.startsWith("image/")) {
            toast.error("File harus berupa gambar.")
            return
        }

        if (file.size > maxSizeMB * 1024 * 1024) {
            toast.error(`Ukuran gambar maksimal ${maxSizeMB}MB.`)
            return
        }

        setPendingFile(file)
        setCropOpen(true)
    }

    const handleCropComplete = (cropped: File) => {
        // Revoke previous preview
        if (previewUrl) URL.revokeObjectURL(previewUrl)

        const url = URL.createObjectURL(cropped)
        setPreviewUrl(url)
        onChange(cropped)
        setPendingFile(null)
    }

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (previewUrl) URL.revokeObjectURL(previewUrl)
        setPreviewUrl(null)
        onChange(null)
    }

    const openFilePicker = () => {
        inputRef.current?.click()
    }

    // Jika value sudah ada tapi preview belum (misal setelah re-render)
    const displayUrl = previewUrl ?? (value ? URL.createObjectURL(value) : null)

    return (
        <>
            <div className={cn("relative", className)}>
                <input
                    ref={inputRef}
                    id={id}
                    type="file"
                    accept={ACCEPTED}
                    className="sr-only"
                    onChange={handleFileSelect}
                />

                <button
                    type="button"
                    onClick={openFilePicker}
                    className={cn(
                        "group relative flex w-full items-center justify-center overflow-hidden border-2 border-dashed border-muted-foreground/25 bg-muted/40 transition hover:border-primary/50 hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        shape === "circle" ? "aspect-square rounded-full" : "aspect-[3/1] rounded-xl",
                        error && "border-destructive",
                        displayUrl && "border-solid border-border",
                    )}
                >
                    {displayUrl ? (
                        <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={displayUrl}
                                alt={label ?? "Preview"}
                                className={cn(
                                    "h-full w-full object-cover",
                                    shape === "circle" ? "rounded-full" : "rounded-xl",
                                )}
                            />
                            {/* Overlay saat hover */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                                <Camera className="size-6 text-white" />
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center gap-2 p-4 text-muted-foreground">
                            {aspect === "avatar" ? (
                                <Camera className="size-8" />
                            ) : (
                                <ImageIcon className="size-8" />
                            )}
                            <span className="text-xs font-medium">
                                {label ?? (aspect === "avatar" ? "Tambah foto" : "Tambah banner")}
                            </span>
                        </div>
                    )}
                </button>

                {/* Tombol hapus */}
                {displayUrl && (
                    <Button
                        type="button"
                        size="icon"
                        variant="secondary"
                        className="absolute -right-2 -top-2 size-7 rounded-full shadow"
                        onClick={handleRemove}
                    >
                        <X className="size-3.5" />
                    </Button>
                )}
            </div>

            {error && <p className="mt-1.5 text-sm text-destructive">{error}</p>}

            <ImageCropDialog
                open={cropOpen}
                onOpenChange={setCropOpen}
                imageFile={pendingFile}
                aspect={aspect}
                onCropComplete={handleCropComplete}
            />
        </>
    )
}