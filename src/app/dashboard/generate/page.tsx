import { redirect } from "next/navigation";
import { Toaster } from "sonner";
import { auth } from "../../../../auth";
import { prisma } from "@/lib/prisma";
import { GenerateForm } from "@/components/dashboard/generate-form";

export const metadata = {
  title: "Generate — VelvetSole Couture",
};

export default async function GeneratePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const allowed = session.user.role === "CREATOR" || session.user.role === "ADMIN";
  if (!allowed) redirect("/dashboard");

  const videos = await prisma.baseVideo.findMany({
    where: { tenantId: session.user.tenantId },
    select: { id: true, title: true, performerName: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <Toaster
        position="bottom-right"
        theme="dark"
        toastOptions={{
          style: { background: "#1a1a1a", border: "1px solid #2b2b2b", color: "#ffffff" },
        }}
      />

      <div className="min-h-screen bg-[#2b2b2b] px-6 py-12">
        <div className="max-w-lg mx-auto space-y-10">

          {/* Header */}
          <div className="space-y-2">
            <p className="text-[10px] font-montserrat uppercase tracking-[0.4em] text-white/30">
              AI Pipeline
            </p>
            <h1 className="text-2xl font-montserrat font-light tracking-wide text-white">
              Generate Variant
            </h1>
            <div className="h-px w-12" style={{ backgroundColor: "#7F2A3C" }} />
          </div>

          {/* Form */}
          <GenerateForm videos={videos} />

        </div>
      </div>
    </>
  );
}
