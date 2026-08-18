"use client";

import { useState, useCallback, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { createBaseVideo } from "@/app/actions/videos";

type Status = "idle" | "uploading" | "saving" | "success" | "error";

function uploadWithProgress(url: string, file: File, onProgress: (pct: number) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url, true);
    xhr.setRequestHeader("Content-Type", file.type);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`Upload failed (${xhr.status})`));
      }
    };

    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(file);
  });
}

export function VideoUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [performerName, setPerformerName] = useState("");
  const [documentId2257, setDocumentId2257] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setFile(null);
    setTitle("");
    setPerformerName("");
    setDocumentId2257("");
    setStatus("idle");
    setProgress(0);
    setError(null);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!file) {
      setError("Select a video file to upload.");
      return;
    }

    try {
      setStatus("uploading");
      setProgress(0);

      const presignRes = await fetch("/api/uploads/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, contentType: file.type }),
      });

      if (!presignRes.ok) {
        throw new Error("Could not get an upload URL. Check your permissions and try again.");
      }

      const { uploadUrl, key } = (await presignRes.json()) as { uploadUrl: string; key: string };

      await uploadWithProgress(uploadUrl, file, setProgress);

      setStatus("saving");
      await createBaseVideo({
        title,
        performerName,
        documentId2257,
        s3Url: key,
      });

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong during upload.");
    }
  };

  const isBusy = status === "uploading" || status === "saving";

  if (status === "success") {
    return (
      <Card className="border-neutral-800 bg-neutral-950">
        <CardHeader>
          <CardTitle className="font-light tracking-wide text-neutral-100">Upload complete</CardTitle>
          <CardDescription className="text-neutral-400">
            &ldquo;{title}&rdquo; has been added to your base footage library.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={reset} className="border-neutral-700 text-neutral-100">
            Upload another
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-neutral-800 bg-neutral-950">
      <CardHeader>
        <CardTitle className="font-light tracking-wide text-neutral-100">Upload base footage</CardTitle>
        <CardDescription className="text-neutral-400">
          Raw footage uploads directly to secure storage. Metadata below is required for the compliance
          record before this asset can be processed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="file" className="text-neutral-300">
              Video file
            </Label>
            <Input
              id="file"
              type="file"
              accept="video/*"
              disabled={isBusy}
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="border-neutral-800 bg-neutral-900 text-neutral-100 file:text-neutral-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title" className="text-neutral-300">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              disabled={isBusy}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="border-neutral-800 bg-neutral-900 text-neutral-100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="performerName" className="text-neutral-300">
              Performer name
            </Label>
            <Input
              id="performerName"
              value={performerName}
              disabled={isBusy}
              onChange={(e) => setPerformerName(e.target.value)}
              required
              className="border-neutral-800 bg-neutral-900 text-neutral-100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="documentId2257" className="text-neutral-300">
              2257 document ID
            </Label>
            <Input
              id="documentId2257"
              value={documentId2257}
              disabled={isBusy}
              onChange={(e) => setDocumentId2257(e.target.value)}
              required
              placeholder="Reference ID from the compliance vault"
              className="border-neutral-800 bg-neutral-900 text-neutral-100"
            />
          </div>

          {isBusy && (
            <div className="space-y-2">
              <Progress value={status === "saving" ? 100 : progress} />
              <p className="text-xs text-neutral-500">
                {status === "uploading" ? `Uploading — ${progress}%` : "Saving record…"}
              </p>
            </div>
          )}

          {error && <p className="text-sm text-red-400">{error}</p>}

          <Button type="submit" disabled={isBusy} className="w-full">
            {isBusy ? "Uploading…" : "Upload"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
