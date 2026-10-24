"use client"
import { Button } from "@/components/ui/button";
import { Bell, Moon, Send, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

export function MobileNavbar() {
    const { theme, setTheme } = useTheme()
    const router = useRouter()
    return (
        <nav className="fixed inset-x-0 top-0 z-50 h-14 border-b bg-background">
            <div className="h-full items-center px-4 flex justify-between">
                <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    onClick={() =>
                        setTheme(theme === "dark" ? "light" : "dark")
                    }
                >
                    <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>

                <div className="flex gap-4">
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                        onClick={() => router.push("/notification")}
                    >
                        <Bell className="h-5! w-5!" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                        onClick={() => router.push("/notification")}
                    >
                        <Send className="h-5! w-5!" />
                    </Button>
                </div>
            </div>
        </nav>
    )
}