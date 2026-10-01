import type { Metadata } from "next";
import { AuthPage } from "@/features/auth/page/auth-page";

export const metadata: Metadata = {
  title: "dafatar— Cosplayin",
  description: "Gabung ke komunitas cosplay, dan pergi sama smaa ke event!",
};

export default function LoginPage() {
  return <AuthPage />;
}
