// app/settings/update-username/page.tsx
import { SettingsPageHeader } from "@/features/settings/component/settings-page-header"
import { UpdateUsernameForm } from "@/features/settings/component/update-username-form"

export default function UpdateUsernamePage() {
    return (
        <>
            <SettingsPageHeader
                title="Update Username"
                description="Username dipakai sebagai identitas unik akun kamu."
            />
            <div className="w-full max-w-2xl p-4 md:p-8">
                <UpdateUsernameForm />
            </div>
        </>
    )
}