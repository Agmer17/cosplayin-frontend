// components/settings/update-profile-form.tsx
"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Camera, Check } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { updateProfile, type Gender } from "../api/settings.client"
import { useAuthStore } from "@/lib/store/auth-store"
import type { DetailProfileDTO } from "@/lib/type/profile"
import { resolvePublicMedia } from "@/lib/ImageUrlResolver"

const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // asumsi 5MB, samakan dengan limit BE


function useImagePicker() {
    const [picked, setPicked] = useState<{ file: File; url: string } | null>(null)
    const urlRef = useRef<string | null>(null)

    const set = useCallback((file: File | null) => {
        if (urlRef.current) URL.revokeObjectURL(urlRef.current)
        urlRef.current = file ? URL.createObjectURL(file) : null
        setPicked(file && urlRef.current ? { file, url: urlRef.current } : null)
    }, [])

    useEffect(() => {
        return () => {
            if (urlRef.current) URL.revokeObjectURL(urlRef.current)
        }
    }, [])

    return { file: picked?.file ?? null, url: picked?.url ?? null, set }
}

function validateImage(file: File): string | null {
    if (!file.type.startsWith("image/")) return "File harus berupa gambar."
    if (file.size > MAX_IMAGE_SIZE) return "Ukuran gambar maksimal 5MB."
    return null
}

export function UpdateProfileForm() {
    const profile = useAuthStore((state) => state.user)
    if (!profile) {
        return <p className="text-sm text-muted-foreground">Memuat profil...</p>
    }
    return <ProfileForm profile={profile} />
}

function ProfileForm({ profile }: { profile: DetailProfileDTO }) {
    const setUser = useAuthStore((state) => state.setUser)

    const [displayName, setDisplayName] = useState(profile.display_name)
    const [bio, setBio] = useState(profile.bio ?? "")
    const [isPrivate, setIsPrivate] = useState(profile.visibility === "PRIVATE")
    const [gender, setGender] = useState<Gender | "">("")
    const [submitting, setSubmitting] = useState(false)
    const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)

    const avatarInputRef = useRef<HTMLInputElement>(null)
    const bannerInputRef = useRef<HTMLInputElement>(null)
    const avatar = useImagePicker()
    const banner = useImagePicker()

    // hapus: avatarFile, bannerFile, avatarPreview, bannerPreview
    const bannerSrc = banner.url ?? resolvePublicMedia(profile.banner_url || "")

    function pickImage(file: File | undefined, picker: ReturnType<typeof useImagePicker>) {
        if (!file) return
        const error = validateImage(file)
        if (error) {
            setStatus({ type: "error", message: error })
            return
        }
        setStatus(null)
        picker.set(file)
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!displayName.trim()) {
            setStatus({ type: "error", message: "Display name tidak boleh kosong." })
            return
        }

        setSubmitting(true)
        setStatus(null)
        try {
            const updated = await updateProfile(
                {
                    displayName: displayName.trim(),
                    bio: bio.trim(),
                    visibility: isPrivate ? "PRIVATE" : "PUBLIC",
                    gender: gender || undefined,
                    avatar: avatar.file,
                    banner: banner.file,
                },
                profile
            )
            setUser(updated)
            avatar.set(null)
            banner.set(null)
            setStatus({ type: "success", message: "Profil berhasil diperbarui." })
        } catch (err) {
            setStatus({
                type: "error",
                message: err instanceof Error ? err.message : "Gagal memperbarui profil.",
            })
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            {/* Banner */}
            <div className="space-y-2">
                <Label>Banner</Label>
                <button
                    type="button"
                    onClick={() => bannerInputRef.current?.click()}
                    className="group relative flex aspect-3/1 w-full items-center justify-center overflow-hidden rounded-lg border bg-muted"
                >
                    {bannerSrc && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={bannerSrc} alt="Banner" className="size-full object-cover" />
                    )}
                    <span className="absolute inset-0 flex items-center justify-center gap-2 bg-background/60 text-sm opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                        <Camera className="size-4" /> Ganti banner
                    </span>
                </button>
                <input
                    ref={bannerInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => pickImage(e.target.files?.[0], banner)}
                />
            </div>

            {/* Avatar */}
            <div className="flex items-center gap-4 rounded-lg border bg-card p-4 text-card-foreground">
                <Avatar className="size-16">
                    <AvatarImage src={avatar.url ?? resolvePublicMedia(profile.avatar_url)} alt={profile.display_name} />
                    <AvatarFallback>{profile.display_name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{profile.username}</p>
                    <p className="truncate text-sm text-muted-foreground">{profile.display_name}</p>
                </div>
                <Button type="button" variant="secondary" size="sm" onClick={() => avatarInputRef.current?.click()}>
                    Ganti foto
                </Button>
                <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => pickImage(e.target.files?.[0], avatar)}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="displayName">Display name</Label>
                <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" rows={4} value={bio} onChange={(e) => setBio(e.target.value)} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={gender} onValueChange={(v) => setGender(v as Gender)}>
                    <SelectTrigger id="gender" className="w-full">
                        <SelectValue placeholder="Pilih gender" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label htmlFor="private">Private account</Label>
                    <p className="text-sm text-muted-foreground">
                        Hanya follower yang disetujui yang bisa melihat postingan kamu.
                    </p>
                </div>
                <Switch id="private" checked={isPrivate} onCheckedChange={setIsPrivate} />
            </div>

            {status && (
                <p
                    role="status"
                    className={
                        status.type === "error"
                            ? "text-sm text-destructive"
                            : "flex items-center gap-1 text-sm text-muted-foreground"
                    }
                >
                    {status.type === "success" && <Check className="size-4" />}
                    {status.message}
                </p>
            )}

            <Button type="submit" disabled={submitting} className="w-full md:w-auto">
                {submitting ? "Menyimpan..." : "Simpan perubahan"}
            </Button>
        </form>
    )
}