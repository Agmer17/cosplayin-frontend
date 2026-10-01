"use client"

import FeedPage from "@/features/posts/component/FeedPage";
import { useAuthStore } from "@/lib/store/auth-store";

export default function Home() {
  const authData = useAuthStore((state) => state.user)

  return (
    <div className=" w-full flex flex-col flex-1 items-center justify-center font-sans bg-background">
      <FeedPage currentUser={authData} />
    </div>
  );
}
