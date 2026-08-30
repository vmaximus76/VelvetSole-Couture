import { redirect } from "next/navigation";
import { auth } from "../../../auth";
import { prisma } from "@/lib/prisma";
import { SiteNav } from "@/components/site/SiteNav";
import { StudioHub } from "@/components/studio/StudioHub";

export const dynamic = "force-dynamic";
export const metadata = { title: "Studio — VelvetSole Couture" };

export default async function StudioPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/studio");

  const [models, recentJobs] = await Promise.all([
    prisma.digitalModel.findMany({
      where: { tenantId: session.user.tenantId },
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, identityAssetKey: true },
    }),
    prisma.generationJob.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        status: true,
        outputType: true,
        resultS3Url: true,
        prompt: true,
        createdAt: true,
      },
    }),
  ]);

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#ede9e4" }}>
      <SiteNav session={session} />
      <StudioHub
        models={models}
        recentJobs={recentJobs.map((j) => ({
          ...j,
          createdAt: j.createdAt.toISOString(),
        }))}
        userName={session.user.name ?? null}
      />
    </div>
  );
}
