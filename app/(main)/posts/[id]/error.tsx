"use client";

import { Button } from "@/components/ui/button";

export default function Error({
    reset,
}: {
    reset: () => void;
}) {
    return (
        <main className="flex min-h-screen items-center justify-center px-4">
            <div className="text-center">
                <h1 className="text-lg font-semibold">
                    Terjadi kesalahan
                </h1>

                <p className="mt-2 text-sm text-muted-foreground">
                    Postingan gagal ditampilkan.
                </p>

                <Button
                    className="mt-5"
                    onClick={reset}
                >
                    Coba lagi
                </Button>
            </div>
        </main>
    );
}