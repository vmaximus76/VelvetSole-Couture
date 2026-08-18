import { redirect } from "next/navigation";
import { auth } from "../../../auth";
import { prisma } from "@/lib/prisma";
import { createPlaybackUrl } from "@/lib/s3";

export default async function LibraryPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/library");
  }

  const purchases = await prisma.purchase.findMany({
    where: { userId: session.user.id },
    include: { product: true },
    distinct: ["productId"],
    orderBy: { createdAt: "desc" },
  });

  const items = await Promise.all(
    purchases.map(async (purchase) => ({
      purchase,
      playbackUrl: purchase.product.deliverableS3Key
        ? await createPlaybackUrl(purchase.product.deliverableS3Key)
        : null,
    })),
  );

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">VelvetSole Couture</p>
          <h1 className="mt-2 text-3xl font-light tracking-wide text-neutral-100">Your Library</h1>
        </div>

        {items.length === 0 ? (
          <p className="text-sm text-neutral-500">
            Nothing purchased yet — browse the collection to get started.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            {items.map(({ purchase, playbackUrl }) => (
              <div
                key={purchase.id}
                className="overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900/40"
              >
                {playbackUrl ? (
                  <video
                    controls
                    controlsList="nodownload"
                    disablePictureInPicture
                    className="w-full bg-black"
                    src={playbackUrl}
                    poster={purchase.product.thumbnailUrl ?? undefined}
                  />
                ) : (
                  <div className="flex aspect-video w-full items-center justify-center bg-black">
                    <span className="text-xs uppercase tracking-[0.25em] text-neutral-700">
                      Deliverable pending
                    </span>
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-sm font-light tracking-wide text-neutral-100">
                    {purchase.product.title}
                  </h3>
                  <p className="mt-1 text-xs text-neutral-500">{purchase.product.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
