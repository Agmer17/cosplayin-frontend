"use client";
import Image from "next/image";
import { AuthCard } from "@/features/auth/com/auth-card";
import { MobileAuthDrawer } from "@/features/auth/com/mobile-auth-drawer";
import { useIsMobile } from "@/lib/responsive/responsive_util";

const AUTH_ARTWORK_SRC = "/assets/image/artwork.jpg";

export function AuthPage() {

  const isMobile = useIsMobile();
  return (
    <main className="h-dvh w-full overflow-hidden bg-background">
      <div className="hidden h-full md:flex">
        <div className="relative h-full w-1/2">
          <Image
            src={AUTH_ARTWORK_SRC}
            alt="Cosplayers showcasing costumes at a Cosplayin community event"
            fill
            priority
            sizes="50vw"
            className="object-cover"
          />
        </div>

        <div className="flex h-full w-1/2 items-center justify-center p-10">
          <AuthCard />
        </div>
      </div>

      <div className="relative h-full md:hidden">
        <Image
          src={AUTH_ARTWORK_SRC}
          alt="Cosplayers showcasing costumes at a Cosplayin community event"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <MobileAuthDrawer open={isMobile} />
      </div>
    </main>
  );
}
