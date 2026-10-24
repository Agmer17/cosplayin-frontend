"use client";

import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import { Search } from "lucide-react";

type Props = {
    value: string;
    onChange: (value: string) => void;
};

export function ExploreSearchInput({
    value,
    onChange,
}: Props) {
    return (
        <InputGroup className="w-full">
            <InputGroupInput
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Cari sesuatu..."
                className="w-full px-4"
            />

            <InputGroupAddon>
                <Search className="size-5" />
            </InputGroupAddon>
        </InputGroup>
    );
}