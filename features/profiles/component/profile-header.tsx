import type { ReactNode } from "react";

import { Lock } from "lucide-react";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import type { DetailProfileDTO } from "@/lib/type/profile";
import { UserRole, UserStatus } from "@/lib/type/user";
import { resolvePublicMedia } from "@/lib/ImageUrlResolver";

type ProfileHeaderProps = {
    profile: DetailProfileDTO;
    actions?: ReactNode;
};

const ROLE_LABEL: Partial<Record<UserRole, string>> = {
    [UserRole.ADMIN]: "Admin",
    [UserRole.MODERATOR]: "Moderator",
    [UserRole.VENDOR]: "Vendor",
};

const RESTRICTED_STATUS_LABEL: Partial<Record<UserStatus, string>> = {
    [UserStatus.BANNED]: "Banned",
    [UserStatus.SUSPENDED]: "Suspended",
};

const compactNumber = new Intl.NumberFormat("id-ID", {
    notation: "compact",
    maximumFractionDigits: 1,
});

function formatCount(value: number | null | undefined) {
    return compactNumber.format(value ?? 0);
}

export function ProfileHeader({
    profile,
    actions,
}: ProfileHeaderProps) {
    const roleLabel = ROLE_LABEL[profile.user_role];
    const restrictedLabel = RESTRICTED_STATUS_LABEL[profile.user_status];

    return (
        <header className="w-full">
            {/* Banner */}
            <div className="aspect-3/1 w-full overflow-hidden bg-primary/10 md:rounded-b-xl">
                {profile.banner_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={resolvePublicMedia(profile.banner_url)}
                        alt={`Banner ${profile.display_name}`}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="h-full w-full bg-accent" />
                )}
            </div>

            {/* Profile content */}
            <div className="px-4">
                {/* Avatar + actions */}
                <div className="flex items-end justify-between">
                    <Avatar
                        className="
                            -mt-10 h-20 w-20
                            border-4 border-background
                            md:-mt-16 md:h-32 md:w-32
                        "
                    >
                        <AvatarImage
                            src={resolvePublicMedia(profile.avatar_url)}
                            alt={profile.display_name}
                        />

                        <AvatarFallback className="text-2xl font-semibold">
                            {profile.display_name
                                .charAt(0)
                                .toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    {actions && (
                        <div className="flex items-center gap-2 pb-1">
                            {actions}
                        </div>
                    )}
                </div>

                {/* Identity */}
                <div className="mt-3">
                    <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-xl font-bold leading-tight md:text-2xl">
                            {profile.display_name}
                        </h1>

                        {profile.visibility === "PRIVATE" && (
                            <Lock
                                className="h-4 w-4 text-muted-foreground"
                                aria-label="Akun privat"
                            />
                        )}

                        {roleLabel && (
                            <Badge variant="secondary">
                                {roleLabel}
                            </Badge>
                        )}

                        {restrictedLabel && (
                            <Badge variant="destructive">
                                {restrictedLabel}
                            </Badge>
                        )}
                    </div>

                    <p className="mt-0.5 text-sm text-muted-foreground">
                        @{profile.username}
                    </p>
                </div>

                {/* Bio */}
                {profile.bio && (
                    <p className="mt-3 max-w-prose whitespace-pre-line text-sm leading-relaxed md:text-base">
                        {profile.bio}
                    </p>
                )}

                {/* Stats */}
                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 pb-4 text-sm">
                    <ProfileStat
                        value={0}
                        label="Following"
                    />

                    <ProfileStat
                        value={0}
                        label="Followers"
                    />
                </div>
            </div>
        </header>
    );
}

function ProfileStat({
    value,
    label,
}: {
    value: number | null | undefined;
    label: string;
}) {
    return (
        <span className="flex items-center gap-1.5">
            <strong className="font-semibold text-foreground">
                {formatCount(value)}
            </strong>

            <span className="text-muted-foreground">
                {label}
            </span>
        </span>
    );
}

export function ProfileHeaderSkeleton() {
    return (
        <div aria-hidden className="w-full">
            {/* Banner */}
            <Skeleton className="aspect-[3/1] w-full rounded-none md:rounded-b-xl" />

            <div className="px-4">
                {/* Avatar + action */}
                <div className="flex items-end justify-between">
                    <Skeleton
                        className="
                            -mt-10 h-20 w-20 rounded-full
                            border-4 border-background
                            md:-mt-16 md:h-32 md:w-32
                        "
                    />

                    <Skeleton className="mb-1 h-9 w-28 rounded-full" />
                </div>

                {/* Identity */}
                <div className="mt-3 space-y-2">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-24" />
                </div>

                {/* Bio */}
                <div className="mt-3 space-y-2">
                    <Skeleton className="h-4 w-full max-w-md" />
                    <Skeleton className="h-4 w-2/3 max-w-sm" />
                </div>

                {/* Stats */}
                <div className="mt-4 flex gap-5 pb-4">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                </div>
            </div>
        </div>
    );
}