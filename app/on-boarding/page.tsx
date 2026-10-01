import { OnboardingForm } from "@/features/profiles/component/on-boarding-form";

export default function SubmitOnBoardingPage() {
    return (
        <main className="min-h-dvh w-full bg-background">
            <div className="mx-auto flex min-h-dvh w-full max-w-5xl items-center justify-center p-4 sm:p-6 lg:p-8">
                <OnboardingForm />
            </div>
        </main>
    );
}