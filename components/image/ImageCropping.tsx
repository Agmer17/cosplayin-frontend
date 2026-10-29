// components/image-crop-dialog.tsx
"use client"

import { useCallback, useState } from "react"
import Cropper, { Area, Point } from "react-easy-crop"
import { Loader2, ZoomIn, ZoomOut } from "lucide-react"
import { toast } from "sonner"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

export type CropAspect = "avatar" | "banner";

interface ImageCropDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** File yang baru dipilih user */
    imageFile: File | null;
    /** "avatar" = 1:1, "banner" = 3:1 (mirip Twitter) */
    aspect: CropAspect;
    onCropComplete: (croppedFile: File) => void;
    title?: string;
    description?: string;
}

const ASPECT_MAP: Record<CropAspect, number> = {
    avatar: 1,
    banner: 3 / 1,
}

/**
 * Membuat canvas dari area crop, lalu convert ke File.
 * Quality JPEG 0.92 agar hasil tetap bagus tapi ukurannya wajar.
 */
async function getCroppedImg(
    imageSrc: string,
    pixelCrop: Area,
    fileName: string,
    mimeType: string = "image/jpeg",
): Promise<File> {
    const image = await createImage(imageSrc)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    if (!ctx) {
        throw new Error("Canvas context tidak tersedia")
    }

    // Output size — avatar 400x400, banner 1500x500 (rasio 3:1)
    const outputWidth = pixelCrop.width > 1500 ? 1500 : Math.round(pixelCrop.width)
    const outputHeight = Math.round(outputWidth * (pixelCrop.height / pixelCrop.width))

    canvas.width = outputWidth
    canvas.height = outputHeight

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        outputWidth,
        outputHeight,
    )

    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    reject(new Error("Gagal membuat blob"))
                    return
                }
                const file = new File([blob], fileName, {
                    type: mimeType,
                    lastModified: Date.now(),
                })
                resolve(file)
            },
            mimeType,
            0.92,
        )
    })
}

function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.addEventListener("load", () => resolve(img))
        img.addEventListener("error", (e) => reject(e))
        img.setAttribute("crossOrigin", "anonymous")
        img.src = url
    })
}

export function ImageCropDialog({
    open,
    onOpenChange,
    imageFile,
    aspect,
    onCropComplete,
    title,
    description,
}: ImageCropDialogProps) {
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)

    const imageUrl = imageFile ? URL.createObjectURL(imageFile) : null

    const onCropChange = useCallback((location: Point) => {
        setCrop(location)
    }, [])

    const onZoomChange = useCallback((value: number) => {
        setZoom(value)
    }, [])

    const onCropCompleteInternal = useCallback(
        (_: Area, croppedAreaPixels: Area) => {
            setCroppedAreaPixels(croppedAreaPixels)
        },
        [],
    )

    const handleConfirm = async () => {
        if (!imageUrl || !croppedAreaPixels || !imageFile) return

        setIsProcessing(true)
        try {
            const extension = imageFile.name.split(".").pop() || "jpg"
            const baseName = imageFile.name.replace(/\.[^/.]+$/, "")
            const croppedFile = await getCroppedImg(
                imageUrl,
                croppedAreaPixels,
                `${baseName}-cropped.${extension}`,
                imageFile.type.startsWith("image/") ? imageFile.type : "image/jpeg",
            )

            onCropComplete(croppedFile)
            onOpenChange(false)

            // Reset state
            setCrop({ x: 0, y: 0 })
            setZoom(1)
            setCroppedAreaPixels(null)
        } catch (err) {
            console.error(err)
            toast.error("Gagal memotong gambar. Coba lagi.")
        } finally {
            setIsProcessing(false)
        }
    }

    const handleClose = (nextOpen: boolean) => {
        if (!nextOpen) {
            setCrop({ x: 0, y: 0 })
            setZoom(1)
            setCroppedAreaPixels(null)
        }
        onOpenChange(nextOpen)
    }

    // Cleanup object URL
    // (biasanya dipanggil saat unmount / file berubah)
    // Kita biarkan browser handle, atau bisa pakai useEffect cleanup jika mau lebih ketat.

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-lg gap-0 overflow-hidden p-0 sm:max-w-xl">
                <DialogHeader className="border-b px-6 py-4">
                    <DialogTitle>
                        {title ?? (aspect === "avatar" ? "Sesuaikan foto profil" : "Sesuaikan banner")}
                    </DialogTitle>
                    {description && (
                        <DialogDescription>{description}</DialogDescription>
                    )}
                </DialogHeader>

                <div className="relative h-72 w-full bg-muted sm:h-80">
                    {imageUrl && (
                        <Cropper
                            image={imageUrl}
                            crop={crop}
                            zoom={zoom}
                            aspect={ASPECT_MAP[aspect]}
                            onCropChange={onCropChange}
                            onZoomChange={onZoomChange}
                            onCropComplete={onCropCompleteInternal}
                            showGrid={aspect === "avatar"}
                            objectFit="contain"
                            classes={{
                                containerClassName: "rounded-none",
                            }}
                        />
                    )}
                </div>

                {/* Zoom control */}
                <div className="flex items-center gap-3 border-t px-6 py-4">
                    <ZoomOut className="size-4 shrink-0 text-muted-foreground" />

                    <Slider
                        value={[zoom]}
                        min={1}
                        max={3}
                        step={0.05}
                        onValueChange={(value) => {
                            setZoom(Array.isArray(value) ? value[0] : value)
                        }}
                        className="flex-1"
                    />

                    <ZoomIn className="size-4 shrink-0 text-muted-foreground" />
                </div>

                <DialogFooter className="border-t px-6 py-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleClose(false)}
                        disabled={isProcessing}
                    >
                        Batal
                    </Button>
                    <Button
                        type="button"
                        onClick={handleConfirm}
                        disabled={isProcessing || !croppedAreaPixels}
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="size-4 animate-spin" />
                                Memproses...
                            </>
                        ) : (
                            "Terapkan"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}