"use client";

import { Button } from "@/components/ui/button";
import {
  DiscordIcon,
  GoogleIcon,
} from "@/components/provider-icons/provider-icons";
import { AUTH_DISCORD_LOGIN, AUTH_GOOGLE_LOGIN } from "../api/auth";

function handleGoogleSignIn() {
  window.location.href = AUTH_GOOGLE_LOGIN;
}

function handleDiscordSignIn() {
  window.location.href = AUTH_DISCORD_LOGIN;
}

interface OAuthButtonsProps {
  className?: string;
}

export function OAuthButtons({ className }: OAuthButtonsProps) {
  return (
    <div className={className}>
      <div className="flex flex-col gap-3">
        <Button
          type="button"
          size="lg"
          className="h-12 w-full justify-center gap-3 text-base"
          onClick={handleGoogleSignIn}
        >
          <GoogleIcon className="size-5 shrink-0" />
          Continue with Google
        </Button>

        <Button
          type="button"
          size="lg"
          variant="secondary"
          className="h-12 w-full justify-center gap-3 text-base"
          onClick={handleDiscordSignIn}
        >
          <DiscordIcon className="size-5 shrink-0" />
          Continue with Discord
        </Button>
      </div>
    </div>
  );
}