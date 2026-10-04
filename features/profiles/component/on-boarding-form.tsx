"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    ArrowRight,
    AtSign,
    Check,
    ImageIcon,
    Loader2,
    UserRound,
    type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

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

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

import { ImageUploadCard } from "./on-boarding-image";
import { profileClientApi } from "../api/profile.client";

interface FieldErrors {
    username?: string;
    profilePicture?: string;
    bannerPicture?: string;
}

interface Step {
    title: string;
    description: string;
    icon: LucideIcon;
    optional: boolean;
}

type UsernameCheck = {
    username: string; // username yang dicek, untuk mencegah race condition
    status: "available" | "taken" | "error";
};

const STEPS: Step[] = [
    {
        title: "Pilih username",
        description: "Ini nama unik kamu yang akan dilihat orang lain.",
        icon: AtSign,
        optional: false,
    },
    {
        title: "Tambah foto profil",
        description: "Foto ini tampil sebagai avatar di profil dan postinganmu.",
        icon: UserRound,
        optional: true,
    },
    {
        title: "Tambah banner profil",
        description: "Banner tampil di bagian atas halaman profilmu.",
        icon: ImageIcon,
        optional: true,
    },
];

const LAST_STEP = STEPS.length - 1;

// Validasi format username di sisi client
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

    const [step, setStep] = useState(0);
    const [username, setUsername] = useState("");
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [bannerPicture, setBannerPicture] = useState<File | null>(null);

    const [errors, setErrors] = useState<FieldErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Hasil cek ketersediaan username terakhir dari BE
    const [usernameCheck, setUsernameCheck] = useState<UsernameCheck | null>(null);

    const current = STEPS[step];
    const StepIcon = current.icon;
    const isLastStep = step === LAST_STEP;

    // ===== Derived state username (bukan state, dihitung tiap render) =====
    const localUsernameError =
        username.length > 0 ? getLocalUsernameError(username) : undefined;

    const shouldCheck = username.length > 0 && !localUsernameError;

    // Hasil cek hanya dipakai kalau memang untuk username yang sekarang
    const result =
        usernameCheck?.username === username ? usernameCheck.status : null;

    const isCheckingUsername = shouldCheck && result === null;

    const usernameApiError =
        result === "taken"
            ? "Username sudah digunakan."
            : result === "error"
                ? "Gagal mengecek ketersediaan username."
                : undefined;

    // Error yang ditampilkan: format lokal -> hasil cek BE -> error dari submit
    const displayedUsernameError =
        localUsernameError ?? usernameApiError ?? errors.username;

    const isUsernameAvailable =
        shouldCheck && result === "available" && !displayedUsernameError;

    const canGoNextFromUsername = isUsernameAvailable && !isCheckingUsername;

    // Debounce + cek ke BE. setState hanya di dalam callback async.
    useEffect(() => {
        if (!shouldCheck) return;

        let cancelled = false;

        const timeoutId = setTimeout(async () => {
            try {
                // BE: true = username SUDAH dipakai
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

    const goNext = () => {
        if (step === 0 && !canGoNextFromUsername) return;

        setStep((value) => Math.min(value + 1, LAST_STEP));
    };

    const goBack = () => {
        setStep((value) => Math.max(value - 1, 0));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Enter di step awal = lanjut, bukan kirim form
        if (!isLastStep) {
            goNext();
            return;
        }

        // Final guard
        if (!canGoNextFromUsername) {
            setStep(0);
            return;
        }

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
                // Lompat ke step pertama yang punya error
                if (fieldErrors.username) setStep(0);
                else if (fieldErrors.profilePicture) setStep(1);
                else if (fieldErrors.bannerPicture) setStep(2);
                return;
            }

            toast.error(
                getErrorMessage(error) ??
                "Terjadi kesalahan saat menyimpan profil.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="w-full overflow-hidden">
            <CardHeader className="space-y-4 border-b">
                <div className="flex items-center justify-between gap-3">
                    <Badge variant="secondary">
                        Langkah {step + 1} dari {STEPS.length}
                    </Badge>

                    {current.optional && (
                        <span className="text-xs text-muted-foreground">
                            Opsional
                        </span>
                    )}
                </div>

                <Progress value={((step + 1) / STEPS.length) * 100} />

                <div className="flex items-start gap-4">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <StepIcon className="size-5" />
                    </div>

                    <div className="min-w-0 space-y-1">
                        <CardTitle className="text-xl sm:text-2xl">
                            {current.title}
                        </CardTitle>

                        <CardDescription>{current.description}</CardDescription>
                    </div>
                </div>
            </CardHeader>

            <form onSubmit={handleSubmit} noValidate>
                {/*
                  Semua step tetap ter-mount dan hanya disembunyikan dengan
                  `hidden`, supaya preview gambar di ImageUploadCard tidak
                  hilang saat user pindah step / kembali.
                */}
                <CardContent className="p-4 sm:p-6 lg:p-8">
                    <div className={cn("space-y-2", step !== 0 && "hidden")}>
                        <Label htmlFor="username">Username</Label>

                        <InputGroup
                            className={
                                displayedUsernameError
                                    ? "border-destructive"
                                    : undefined
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
                                    // Hapus error username dari submit sebelumnya
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
                            <p className="text-sm text-green-600">
                                Username tersedia.
                            </p>
                        )}
                    </div>

                    <div className={cn(step !== 1 && "hidden")}>
                        <ImageUploadCard
                            id="profile-picture"
                            label="Foto Profil"
                            description="Foto yang akan digunakan sebagai avatar profil."
                            error={errors.profilePicture}
                            onChange={setProfilePicture}
                        />
                    </div>

                    <div className={cn(step !== 2 && "hidden")}>
                        <ImageUploadCard
                            id="banner-picture"
                            label="Banner Profil"
                            description="Gambar banner yang tampil di bagian atas profil."
                            error={errors.bannerPicture}
                            onChange={setBannerPicture}
                        />
                    </div>
                </CardContent>

                <CardFooter className="flex-col-reverse gap-2 border-t p-4 sm:flex-row sm:justify-between sm:p-6">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={goBack}
                        disabled={step === 0 || isSubmitting}
                        className="w-full sm:w-auto"
                    >
                        <ArrowLeft />
                        Kembali
                    </Button>

                    <div className="flex w-full flex-col-reverse gap-2 sm:w-auto sm:flex-row">
                        {current.optional && !isLastStep && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={goNext}
                                className="w-full sm:w-auto"
                            >
                                Lewati
                            </Button>
                        )}

                        <Button
                            type="submit"
                            disabled={
                                isSubmitting ||
                                (step === 0 && !canGoNextFromUsername)
                            }
                            className="w-full sm:w-auto"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="animate-spin" />
                                    Menyimpan...
                                </>
                            ) : isLastStep ? (
                                <>
                                    <Check />
                                    Simpan Profil
                                </>
                            ) : (
                                <>
                                    Lanjut
                                    <ArrowRight />
                                </>
                            )}
                        </Button>
                    </div>
                </CardFooter>
            </form>
        </Card>
    );
}

function extractFieldErrors(error: unknown): FieldErrors {
    if (!error || typeof error !== "object") {
        return {};
    }

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
    if (!error || typeof error !== "object") {
        return undefined;
    }

    const data = error as Record<string, unknown>;

    if (typeof data.message === "string") {
        return data.message;
    }

    if (typeof data.error === "string") {
        return data.error;
    }

    return undefined;
}