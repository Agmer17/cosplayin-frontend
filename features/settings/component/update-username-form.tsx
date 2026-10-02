// components/settings/update-username-form.tsx
"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateUsername } from "../api/settings.client"
import { useAuthStore } from "@/lib/store/auth-store"

const USERNAME_MIN = 4
const USERNAME_MAX = 255
const USERNAME_REGEX = /^[a-zA-Z0-9._]+$/

function validateUsername(value: string): string | null {
    if (value.length < USERNAME_MIN || value.length > USERNAME_MAX) {
        return `Username harus ${USERNAME_MIN}-${USERNAME_MAX} karakter.`
    }
    if (!USERNAME_REGEX.test(value)) {
        return "Username hanya boleh berisi huruf, angka, titik, dan underscore."
    }
    return null
}

export function UpdateUsernameForm() {
    const user = useAuthStore((state) => state.user)
    const setUser = useAuthStore((state) => state.setUser)

    const [username, setUsername] = useState(user?.username ?? "")
    const [touched, setTouched] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)

    if (!user) {
        return <p className="text-sm text-muted-foreground">Memuat profil...</p>
    }

    const validationError = validateUsername(username)
    const showError = touched && validationError
    const unchanged = username === user.username

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!user) return
        setTouched(true)
        if (validationError || unchanged) return

        setSubmitting(true)
        setStatus(null)
        try {
            const result = await updateUsername(username)
            setUser({ ...user, username: result.username }) // invalidate / refresh zustand
            setStatus({ type: "success", message: "Username berhasil diperbarui." })
        } catch (err) {
            setStatus({
                type: "error",
                message: err instanceof Error ? err.message : "Gagal memperbarui username.",
            })
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">
                        @
                    </span>
                    <Input
                        id="username"
                        value={username}
                        maxLength={USERNAME_MAX}
                        autoComplete="off"
                        autoCapitalize="none"
                        spellCheck={false}
                        aria-invalid={!!showError}
                        className="pl-7"
                        onChange={(e) => {
                            setUsername(e.target.value)
                            setTouched(true)
                            setStatus(null)
                        }}
                    />
                </div>
                {showError ? (
                    <p className="text-sm text-destructive">{validationError}</p>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        {USERNAME_MIN}-{USERNAME_MAX} karakter. Huruf, angka, titik, dan underscore.
                    </p>
                )}
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

            <Button
                type="submit"
                disabled={submitting || unchanged || !!validationError}
                className="w-full md:w-auto"
            >
                {submitting ? "Menyimpan..." : "Simpan username"}
            </Button>
        </form>
    )
}