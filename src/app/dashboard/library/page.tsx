import { redirect } from "next/navigation";
import { auth } from "../../../../auth";
import { prisma } from "@/lib/prisma";
import { TestResendButton } from "@/components/dashboard/test-resend-button";

export const metadata = { title: "Asset Library — VelvetSole Couture" };

const ALLOWED = new Set(["CREATOR", "ADMIN"]);

export default async function DashboardLibraryPage() {
  const session = await auth();
  if (!session?.user || !ALLOWED.has(session.user.role)) redirect("/dashboard");

  const videos = await prisma.baseVideo.findMany({
    where: { tenantId: session.user.tenantId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="px-8 py-12 space-y-10">

      {/* Header */}
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <p className="text-[10px] font-montserrat uppercase tracking-[0.4em] text-zinc-500">
            Creator Studio
          </p>
          <h1 className="text-2xl font-montserrat font-light tracking-wide text-white">
            Asset Library
          </h1>
          <div className="h-px w-10" style={{ backgroundColor: "#7F2A3C" }} />
        </div>
        <TestResendButton />
      </div>

      {/* Grid */}
      {videos.length === 0 ? (
        <p className="text-sm font-opensans text-zinc-600">
          No base videos uploaded yet. Head to Upload Studio to add your first asset.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {videos.map((video) => {
            const hasS3 = Boolean(video.s3Url);
            return (
              <div
                key={video.id}
                className="border border-zinc-800 bg-zinc-900/40 p-6 space-y-5 hover:border-zinc-700 transition-colors"
              >
                {/* S3 status indicator */}
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-montserrat uppercase tracking-[0.35em] text-zinc-600">
                    Base Asset
                  </span>
                  <span
                    className="flex items-center gap-1.5 text-[9px] font-montserrat uppercase tracking-widest"
                    style={{ color: hasS3 ? "#7F2A3C" : "#52525b" }}
                  >
                    <span
                      className="inline-block h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: hasS3 ? "#7F2A3C" : "#52525b" }}
                    />
                    {hasS3 ? "S3 Linked" : "Pending Upload"}
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-sm font-montserrat text-white leading-snug">
                    {video.title}
                  </h3>
                  <p className="mt-1 text-xs font-opensans text-zinc-500">
                    {video.performerName}
                  </p>
                </div>

                {/* Compliance row */}
                <div className="border-t border-zinc-800/60 pt-4 space-y-1">
                  <p className="text-[9px] font-montserrat uppercase tracking-[0.3em] text-zinc-600">
                    2257 Document ID
                  </p>
                  <p className="text-xs font-montserrat tabular-nums tracking-widest text-zinc-400 truncate">
                    {video.documentId2257}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
