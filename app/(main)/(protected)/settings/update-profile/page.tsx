import { SettingsPageHeader } from "@/features/settings/component/settings-page-header"
import { UpdateProfileForm } from "@/features/settings/component/settings-profile-update"

export default function UpdateProfilePage() {
    return (
        <>
            <SettingsPageHeader
                title="Update Profile"
                description="Ubah nama, bio, foto, dan visibilitas profil kamu."
            />
            <div className="w-full max-w-2xl p-4 md:p-8">
                <UpdateProfileForm />
            </div>
        </>
    )
}