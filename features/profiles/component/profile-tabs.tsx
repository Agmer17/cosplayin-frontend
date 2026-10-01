"use client";

import { Grid3x3, Heart } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/lib/responsive/responsive_util";

type ProfileTab = "posts" | "likes";

type ProfileTabsProps = {
    activeTab: ProfileTab;
    onTabChange: (tab: ProfileTab) => void;
    showLikesTab?: boolean;
};

const activeTriggerClass =
    "data-[state=active]:bg-primary! data-[state=active]:text-primary-foreground! " +
    "data-active:bg-primary! data-active:text-primary-foreground! " +
    "dark:data-[state=active]:bg-primary! dark:data-active:bg-primary!";

export function ProfileTabs({
    activeTab,
    onTabChange,
    showLikesTab = true,
}: ProfileTabsProps) {
    return (
        <Tabs
            value={activeTab}
            onValueChange={(value) => onTabChange(value as ProfileTab)}
            className="flex w-full p-4 min-w-0 flex-col"
        >
            <TabsList variant="default" className="w-full">
                <TabsTrigger
                    value="posts"
                    aria-label="Posts"
                    className={activeTriggerClass}
                >
                    <Grid3x3 className="h-5! w-5! flex-1 font-bold" />
                </TabsTrigger>

                {showLikesTab && (
                    <TabsTrigger
                        value="likes"
                        aria-label="Likes"
                        className={activeTriggerClass}
                    >
                        <Heart className="h-5! w-5! flex-1 font-bold" />
                    </TabsTrigger>
                )}
            </TabsList>
        </Tabs>
    );
}