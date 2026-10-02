
import { DetailProfileDTO } from "@/lib/type/profile";
import HomeLayout from "@/features/home/component/desktop/HomeLayout"
import { profileServerApi } from "@/features/profiles/api/profile.server";
import { redirect } from "next/navigation";

export default async function mainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    let profile: DetailProfileDTO | null = null

    try {
        profile = await profileServerApi.getMyProfile()

    } catch (_) {
        // dont do anything

    }

    if (profile?.user_status === "ON_BOARDING") {
        redirect("/on-boarding")
    }

    return (
        <div className="w-full min-h-screen">
            <HomeLayout >
                <main className="w-full h-full">
                    {children}
                </main>
            </HomeLayout>

        </div>
    )

}