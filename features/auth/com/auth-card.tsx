import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OAuthButtons } from "@/features/auth/com/oauth-buttons";
import AuthUserAvatar from "./auth-avatar-user";

export function AuthCard() {
  return (
    <Card className="w-full max-w-sm border-border shadow-lg">
      <CardHeader className="items-center text-center space-y-4 pb-8">
        <span className="text-2xl font-bold text-primary">
          Cosplay.in
        </span>

        <div className="space-y-2">
          <CardTitle className="text-2xl">
            Cosplay lebih seru bareng komunitas
          </CardTitle>

          <CardDescription>
            Upload cosplaymu, cari teman baru, dan lihat apa yang lagi ramai di komunitas.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Avatar komunitas */}
        <div className="flex justify-center">
          <AuthUserAvatar />
        </div>

        <OAuthButtons />
      </CardContent>

      <CardFooter className="pt-6 bg-background">
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
      </CardFooter>
    </Card>
  );
}
