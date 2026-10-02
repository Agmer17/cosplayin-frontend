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
        <InputGroup>
            <InputGroupInput
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Cari sesuatu..."
            />

            <InputGroupAddon>
                <Search className="size-5" />
            </InputGroupAddon>
        </InputGroup>
    );
}