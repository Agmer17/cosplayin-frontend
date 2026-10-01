import { profileServerApi } from "@/features/profiles/api/profile.server";
import { redirect } from "next/navigation";


interface protectedLayerProps {
    children: React.ReactNode
}
export default function Layout({ children }: protectedLayerProps) {

    try {
        const profile = profileServerApi.getMyProfile()
        if (profile == null) {
            redirect("/auth")
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
        redirect("/auth")
    }



    return (
        <>
            {children}
        </>
    )

}