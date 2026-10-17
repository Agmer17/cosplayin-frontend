// onboarding-form.tsx  (ganti file yang kamu kirim)
"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    AtSign,
    Check,
    Loader2,
} from "lucide-react";
import { toast } from "sonner";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { ImageUploadWithCrop } from "./on-boarding-image"; // sesuaikan path
import { profileClientApi } from "../api/profile.client";

interface FieldErrors {
    username?: string;
    profilePicture?: string;
    bannerPicture?: string;
}

type UsernameCheck = {
    username: string;
    status: "available" | "taken" | "error";
};

const getLocalUsernameError = (value: string): string | undefined => {
    if (value.length < 4 || value.length > 255) {
        return "Username harus memiliki 4 sampai 255 karakter.";
    }
    if (!/^[a-zA-Z0-9._]+$/.test(value)) {
        return "Username hanya boleh berisi huruf, angka, titik, dan underscore.";
    }
    return undefined;
};

export function OnboardingForm() {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [bannerPicture, setBannerPicture] = useState<File | null>(null);

    const [errors, setErrors] = useState<FieldErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [usernameCheck, setUsernameCheck] = useState<UsernameCheck | null>(null);

    // ===== Username derived state =====
    const localUsernameError =
        username.length > 0 ? getLocalUsernameError(username) : undefined;

    const shouldCheck = username.length > 0 && !localUsernameError;

    const result =
        usernameCheck?.username === username ? usernameCheck.status : null;

    const isCheckingUsername = shouldCheck && result === null;

    const usernameApiError =
        result === "taken"
            ? "Username sudah digunakan."
            : result === "error"
                ? "Gagal mengecek ketersediaan username."
                : undefined;

    const displayedUsernameError =
        localUsernameError ?? usernameApiError ?? errors.username;

    const isUsernameAvailable =
        shouldCheck && result === "available" && !displayedUsernameError;

    const canSubmit = isUsernameAvailable && !isCheckingUsername;

    // Debounce cek username
    useEffect(() => {
        if (!shouldCheck) return;

        let cancelled = false;

        const timeoutId = setTimeout(async () => {
            try {
                const isTaken = await profileClientApi.isUsernameAvaible(username);
                if (cancelled) return;
                setUsernameCheck({
                    username,
                    status: isTaken ? "taken" : "available",
                });
            } catch {
                if (cancelled) return;
                setUsernameCheck({ username, status: "error" });
            }
        }, 450);

        return () => {
            cancelled = true;
            clearTimeout(timeoutId);
        };
    }, [username, shouldCheck]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!canSubmit) return;

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("username", username);

            if (profilePicture) {
                formData.append("profilePicture", profilePicture);
            }
            if (bannerPicture) {
                formData.append("bannerPicture", bannerPicture);
            }

            await profileClientApi.submitOnBoarding(formData);

            toast.success("Profil berhasil dilengkapi!");
            router.push("/my-profile");
            router.refresh();
        } catch (error) {
            const fieldErrors = extractFieldErrors(error);

            if (Object.keys(fieldErrors).length > 0) {
                setErrors(fieldErrors);
                return;
            }

            toast.error(
                getErrorMessage(error) ?? "Terjadi kesalahan saat menyimpan profil.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="w-full max-w-lg overflow-hidden">
            <CardHeader className="space-y-1 border-b pb-4">
                <CardTitle className="text-xl sm:text-2xl">Lengkapi profilmu</CardTitle>
                <CardDescription>
                    Username wajib diisi. Foto profil dan banner opsional — kamu bisa
                    mengubahnya kapan saja nanti.
                </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit} noValidate>
                <CardContent className="space-y-6 p-0">
                    {/* ===== Banner + Avatar (layout ala Twitter) ===== */}
                    <div className="relative">
                        {/* Banner */}
                        <div className="px-4 pt-4 sm:px-6">
                            <ImageUploadWithCrop
                                id="banner-picture"
                                aspect="banner"
                                value={bannerPicture}
                                onChange={setBannerPicture}
                                error={errors.bannerPicture}
                                shape="rounded"
                                label="Tambah banner"
                                className="w-full"
                            />
                        </div>

                        {/* Avatar overlapping banner */}
                        <div className="absolute -bottom-12 left-6 sm:left-8">
                            <div className="rounded-full border-4 border-background bg-background">
                                <ImageUploadWithCrop
                                    id="profile-picture"
                                    aspect="avatar"
                                    value={profilePicture}
                                    onChange={setProfilePicture}
                                    error={errors.profilePicture}
                                    shape="circle"
                                    label="Foto"
                                    className="size-24 sm:size-28"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Spacer karena avatar absolute */}
                    <div className="h-14" />

                    {/* ===== Username ===== */}
                    <div className="space-y-2 px-4 sm:px-6">
                        <Label htmlFor="username">Username</Label>

                        <InputGroup
                            className={
                                displayedUsernameError ? "border-destructive" : undefined
                            }
                        >
                            <InputGroupAddon>
                                <AtSign />
                            </InputGroupAddon>

                            <InputGroupInput
                                id="username"
                                value={username}
                                placeholder="username kamu"
                                autoComplete="username"
                                autoFocus
                                aria-invalid={Boolean(displayedUsernameError)}
                                onChange={(event) => {
                                    setUsername(event.target.value);
                                    setErrors((prev) => ({
                                        ...prev,
                                        username: undefined,
                                    }));
                                }}
                            />

                            {isCheckingUsername && (
                                <InputGroupAddon align="inline-end">
                                    <Loader2 className="size-4 animate-spin text-muted-foreground" />
                                </InputGroupAddon>
                            )}
                        </InputGroup>

                        {displayedUsernameError && (
                            <p className="text-sm text-destructive">
                                {displayedUsernameError}
                            </p>
                        )}

                        {isUsernameAvailable && (
                            <p className="text-sm text-green-600">Username tersedia.</p>
                        )}
                    </div>
                </CardContent>

                <CardFooter className="border-t p-4 sm:p-6">
                    <Button
                        type="submit"
                        disabled={isSubmitting || !canSubmit}
                        className="w-full"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="animate-spin" />
                                Menyimpan...
                            </>
                        ) : (
                            <>
                                <Check />
                                Simpan Profil
                            </>
                        )}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}

function extractFieldErrors(error: unknown): FieldErrors {
    if (!error || typeof error !== "object") return {};

    const data = error as Record<string, unknown>;
    const source =
        data.errors && typeof data.errors === "object"
            ? (data.errors as Record<string, unknown>)
            : data;

    const fieldErrors: FieldErrors = {};

    if (typeof source.username === "string") {
        fieldErrors.username = source.username;
    }
    if (typeof source.profilePicture === "string") {
        fieldErrors.profilePicture = source.profilePicture;
    }
    if (typeof source.bannerPicture === "string") {
        fieldErrors.bannerPicture = source.bannerPicture;
    }

    return fieldErrors;
}

function getErrorMessage(error: unknown): string | undefined {
    if (!error || typeof error !== "object") return undefined;
    const data = error as Record<string, unknown>;
    if (typeof data.message === "string") return data.message;
    if (typeof data.error === "string") return data.error;
    return undefined;
}