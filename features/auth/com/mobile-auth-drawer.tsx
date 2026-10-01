
'use-client';

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { OAuthButtons } from "@/features/auth/com/oauth-buttons";
import AuthUserAvatar from "./auth-avatar-user";

interface MobileAuthDrawerProps {
  open: boolean;
}


export function MobileAuthDrawer({ open }: MobileAuthDrawerProps) {
  return (
    <Drawer open={open} modal={false}>
      <DrawerContent className="border-border bg-card/95 backdrop-blur-sm h-[50%]">

        <div className="mx-auto w-full max-w-sm px-6 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] flex flex-col h-full justify-between">
          <DrawerHeader className="items-center gap-1 px-0 text-center">
            <span className="text-base font-semibold tracking-tight text-primary">
              Cosplayin
            </span>
            <DrawerTitle className="text-xl">
              Cosplay lebih seru kalo bareng-bareng
            </DrawerTitle>
            <DrawerDescription className="text-balance">
              Upload cosplaymu, cari teman baru, dan lihat apa yang lagi ramai di komunitas.
            </DrawerDescription>
          </DrawerHeader>

          <AuthUserAvatar />
          <OAuthButtons className="mt-2" />
        </div>
        <DrawerFooter>
          <p className="text-center text-xs text-muted-foreground">
            Dengan melanjutkan, kamu menyetujui{" "}
            <a
              href="/terms"
              className="underline underline-offset-4 hover:text-foreground"
            >
              Ketentuan Layanan
            </a>{" "}
            dan{" "}
            <a
              href="/privacy"
              className="underline underline-offset-4 hover:text-foreground"
            >
              Kebijakan Privasi
            </a>
            .
          </p>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
