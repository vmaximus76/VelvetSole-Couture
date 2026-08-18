"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createProduct } from "@/app/actions/inventory";

const NO_DELIVERABLE = "__none__";

type BaseVideoOption = { id: string; title: string; s3Url: string };

function uploadWithProgress(url: string, file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url, true);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`Upload failed (${xhr.status})`));
    };
    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(file);
  });
}

export function ProductForm({ baseVideos }: { baseVideos: BaseVideoOption[] }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priceUsd, setPriceUsd] = useState("");
  const [baseVideoId, setBaseVideoId] = useState(NO_DELIVERABLE);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      let thumbnailKey: string | undefined;

      if (thumbnailFile) {
        const presignRes = await fetch("/api/uploads/presign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: thumbnailFile.name,
            contentType: thumbnailFile.type,
            category: "thumbnail",
          }),
        });
        if (!presignRes.ok) {
          throw new Error("Could not get an upload URL for the thumbnail.");
        }
        const { uploadUrl, key } = (await presignRes.json()) as { uploadUrl: string; key: string };
        await uploadWithProgress(uploadUrl, thumbnailFile);
        thumbnailKey = key;
      }

      const deliverableS3Key =
        baseVideoId === NO_DELIVERABLE ? undefined : baseVideos.find((v) => v.id === baseVideoId)?.s3Url;

      await createProduct({
        title,
        description,
        priceUsd: Number(priceUsd),
        deliverableS3Key,
        thumbnailKey,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create product. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <Card className="border-neutral-800 bg-neutral-950">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-neutral-300">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              disabled={submitting}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="border-neutral-800 bg-neutral-900 text-neutral-100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-neutral-300">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              disabled={submitting}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className="border-neutral-800 bg-neutral-900 text-neutral-100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price" className="text-neutral-300">
              Price (USD)
            </Label>
            <Input
              id="price"
              type="number"
              min="0.01"
              step="0.01"
              value={priceUsd}
              disabled={submitting}
              onChange={(e) => setPriceUsd(e.target.value)}
              required
              placeholder="49.99"
              className="border-neutral-800 bg-neutral-900 text-neutral-100"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-neutral-300">Deliverable asset</Label>
            <Select
              value={baseVideoId}
              onValueChange={(value) => setBaseVideoId(value ?? NO_DELIVERABLE)}
              disabled={submitting}
            >
              <SelectTrigger className="w-full border-neutral-800 bg-neutral-900 text-neutral-100">
                <SelectValue placeholder="Select an uploaded video" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_DELIVERABLE}>— None (add later) —</SelectItem>
                {baseVideos.map((video) => (
                  <SelectItem key={video.id} value={video.id}>
                    {video.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail" className="text-neutral-300">
              Thumbnail image
            </Label>
            <Input
              id="thumbnail"
              type="file"
              accept="image/*"
              disabled={submitting}
              onChange={(e) => setThumbnailFile(e.target.files?.[0] ?? null)}
              className="border-neutral-800 bg-neutral-900 text-neutral-100 file:text-neutral-300"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Creating…" : "Create Product"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
