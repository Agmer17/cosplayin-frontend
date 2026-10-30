"use client"

import { LocateFixed, Minus, Plus, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface MapControlsProps {
    onZoomIn: () => void
    onZoomOut: () => void
    onReset: () => void
    onLocate: () => void
    className?: string
}

export function MapControls({
    onZoomIn,
    onZoomOut,
    onReset,
    onLocate,
    className,
}: MapControlsProps) {
    return (
        <TooltipProvider delay={200}>
            <div
                className={cn(
                    "flex flex-col gap-2 rounded-xl bg-background/95 p-1.5 shadow-lg backdrop-blur-md",
                    className
                )}
            >
                <Tooltip>
                    <TooltipTrigger render={<Button
                        variant="ghost"
                        size="icon"
                        className="size-10 rounded-lg"
                        onClick={onLocate}
                    >
                        <LocateFixed className="size-5" />
                    </Button>}>

                    </TooltipTrigger>
                    <TooltipContent side="left">Lokasi saat ini</TooltipContent>
                </Tooltip>

                <div className="h-px bg-border" />

                <Tooltip>
                    <TooltipTrigger render={<Button
                        variant="ghost"
                        size="icon"
                        className="size-10 rounded-lg"
                        onClick={onZoomIn}
                    >
                        <Plus className="size-5" />
                    </Button>}>

                    </TooltipTrigger>
                    <TooltipContent side="left">Perbesar</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger render={<Button
                        variant="ghost"
                        size="icon"
                        className="size-10 rounded-lg"
                        onClick={onZoomOut}
                    >
                        <Minus className="size-5" />
                    </Button>}>

                    </TooltipTrigger>
                    <TooltipContent side="left">Perkecil</TooltipContent>
                </Tooltip>

                <div className="h-px bg-border" />

                <Tooltip>
                    <TooltipTrigger render={<Button
                        variant="ghost"
                        size="icon"
                        className="size-10 rounded-lg"
                        onClick={onReset}
                    >
                        <RotateCcw className="size-4" />
                    </Button>}>

                    </TooltipTrigger>
                    <TooltipContent side="left">Reset tampilan</TooltipContent>
                </Tooltip>
            </div>
        </TooltipProvider>
    )
}