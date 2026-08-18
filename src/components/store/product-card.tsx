import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";

export function ProductCard({
  id,
  title,
  description,
  priceCents,
  thumbnailUrl,
}: {
  id: string;
  title: string;
  description: string;
  priceCents: number;
  thumbnailUrl: string | null;
}) {
  return (
    <Link href={`/store/${id}`} className="group block">
      <Card className="overflow-hidden border-neutral-800 bg-neutral-950 transition group-hover:border-neutral-700">
        <div className="aspect-[4/5] w-full bg-gradient-to-br from-neutral-900 via-neutral-950 to-black">
          {thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={thumbnailUrl} alt={title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-xs uppercase tracking-[0.25em] text-neutral-700">VelvetSole</span>
            </div>
          )}
        </div>
        <CardContent className="pt-4">
          <h3 className="text-sm font-light tracking-wide text-neutral-100">{title}</h3>
          <p className="mt-1 line-clamp-2 text-xs text-neutral-500">{description}</p>
        </CardContent>
        <CardFooter className="pt-0">
          <span className="text-sm text-neutral-300">{formatPrice(priceCents)}</span>
        </CardFooter>
      </Card>
    </Link>
  );
}
