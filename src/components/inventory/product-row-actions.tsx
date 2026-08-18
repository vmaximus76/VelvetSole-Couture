"use client";

import { useState, useTransition } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { setProductPublished } from "@/app/actions/inventory";

export function ProductRowActions({ productId, published }: { productId: string; published: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleTogglePublished = () => {
    setError(null);
    startTransition(async () => {
      try {
        await setProductPublished(productId, !published);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not update product.");
      }
    });
  };

  return (
    <div className="flex items-center justify-end gap-2">
      {error && <span className="text-xs text-red-400">{error}</span>}
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon-sm" disabled={isPending}>
              <MoreHorizontal className="size-4" />
            </Button>
          }
        />
        <DropdownMenuContent align="end">
          <DropdownMenuItem disabled>Edit</DropdownMenuItem>
          <DropdownMenuItem onClick={handleTogglePublished} disabled={isPending}>
            {published ? "Unpublish" : "Publish"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
