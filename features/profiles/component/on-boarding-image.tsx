/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState } from "react";
import { ImageIcon, Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ImageUploadCardProps {
    id: string;
    label: string;
    description: string;
    error?: string;
    onChange: (file: File | null) => void;
}

export function ImageUploadCard({
    id,
    label,
    description,
    error,
    onChange,
}: ImageUploadCardProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const selectedFile = event.target.files?.[0];

        if (!selectedFile) {
            return;
        }

        if (!selectedFile.type.startsWith("image/")) {
            event.target.value = "";
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            if (typeof reader.result !== "string") {
                return;
            }

            setFile(selectedFile);
            setPreview(reader.result);
            onChange(selectedFile);
        };

        reader.readAsDataURL(selectedFile);
    };

    const handleRemove = () => {
        setFile(null);
        setPreview(null);
        onChange(null);

        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    const handleUploadClick = () => {
        inputRef.current?.click();
    };

    return (
        <Card className="overflow-hidden">
            <CardHeader>
                <CardTitle className="text-base">{label}</CardTitle>

                <CardDescription>
                    {description}
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="relative overflow-hidden rounded-lg border bg-muted">
                    {preview ? (
                        <>

                            <img
                                src={preview}
                                alt={`Preview ${label}`}
                                className="aspect-video w-full object-cover"
                            />

                            <Button
                                type="button"
                                variant="secondary"
                                size="icon"
                                className="absolute right-2 top-2"
                                onClick={handleRemove}
                                aria-label={`Hapus ${label}`}
                            >
                                <X />
                            </Button>
                        </>
                    ) : (
                        <button
                            type="button"
                            onClick={handleUploadClick}
                            className="flex aspect-video w-full flex-col items-center justify-center gap-3 transition-colors hover:bg-accent"
                        >
                            <div className="flex size-12 items-center justify-center rounded-full bg-background">
                                <ImageIcon className="size-6 text-muted-foreground" />
                            </div>

                            <div className="space-y-1 text-center">
                                <p className="text-sm font-medium">
                                    Pilih gambar
                                </p>

                                <p className="text-xs text-muted-foreground">
                                    JPG, PNG, atau WebP
                                </p>
                            </div>
                        </button>
                    )}
                </div>

                <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                        <Label
                            htmlFor={`${id}-file`}
                            className="sr-only"
                        >
                            {label}
                        </Label>

                        <Input
                            ref={inputRef}
                            id={`${id}-file`}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={handleFileChange}
                        />

                        {file ? (
                            <p className="truncate text-sm text-muted-foreground">
                                {file.name}
                            </p>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Belum ada gambar
                            </p>
                        )}
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleUploadClick}
                    >
                        <Upload />
                        {file ? "Ganti" : "Upload"}
                    </Button>
                </div>

                {error && (
                    <p className="text-sm text-destructive">
                        {error}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}