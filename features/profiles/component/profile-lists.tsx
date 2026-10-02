/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";

import { DetailProfileDTO } from "@/lib/type/profile";
import { resolvePublicMedia } from "@/lib/ImageUrlResolver";

type Props = {
    users?: DetailProfileDTO[];
    currentProfile?: DetailProfileDTO | null
};


export function ProfileList({
    users,
    currentProfile
}: Props) {
    if (!users || users.length === 0) {
        return (
            <div className="py-20 text-center">
                Tidak ada pengguna ditemukan
            </div>
        );
    }



    const redirectUrl = (user: DetailProfileDTO, curr?: DetailProfileDTO | null) => {
        if (!curr) {
            return `/u/${user.username}`
        }


        if (user.id === curr.id) {
            return "/my-profile"
        }

        return `/u/${user.username}`


    }




    return (
        <div className="flex flex-col divide-y rounded-lg border">
            {users.map((user) => (
                <Link
                    key={user.id}
                    href={redirectUrl(user, currentProfile)}
                    className="flex items-center gap-3 p-4 transition-colors hover:bg-muted/50"
                >

                    <img
                        src={resolvePublicMedia(user.avatar_url)}
                        alt={user.display_name}
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                        referrerPolicy="no-referrer"
                    />

                    <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">
                            {user.display_name}
                        </p>

                        <p className="truncate text-sm text-muted-foreground">
                            @{user.username}
                        </p>
                    </div>
                </Link>
            ))}
        </div>
    );
}