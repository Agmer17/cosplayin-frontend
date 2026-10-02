"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type ExploreTab = "posts" | "users";

type Props = {
    value: ExploreTab;
    onChange: (tab: ExploreTab) => void;
};

export function ExploreTabs({
    value,
    onChange,
}: Props) {
    return (
        <Tabs
            value={value}
            onValueChange={(v) =>
                onChange(v as ExploreTab)
            }
        >
            <TabsList className="w-full">
                <TabsTrigger value="posts">
                    Postingan
                </TabsTrigger>

                <TabsTrigger value="users">
                    Pengguna
                </TabsTrigger>
            </TabsList>
        </Tabs>
    );
}