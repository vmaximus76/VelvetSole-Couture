import { auth } from "../../../../auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ViewerClient } from "@/components/viewer/ViewerClient";

export const metadata = {
  title: "Studio — VelvetSole Couture",
};

export default async function ViewerPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/library");

  const { jobId } = await params;

  const job = await prisma.generationJob.findFirst({
    where: { id: jobId, userId: session.user.id },
    select: { id: true, status: true, resultS3Url: true, outputType: true, prompt: true },
  });

  if (!job) notFound();

  return (
    <ViewerClient
      jobId={job.id}
      initialStatus={job.status}
      initialResultUrl={job.resultS3Url}
      outputType={job.outputType}
      prompt={job.prompt}
    />
  );
}
