import { redirect } from "next/navigation";
import { auth } from "../../../../auth";
import { listDigitalModels } from "@/app/actions/digital-models";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Generate Poses — VelvetSole Couture" };

const ALLOWED = new Set(["CREATOR", "ADMIN"]);

export default async function GeneratePosesPage() {
  const session = await auth();
  if (!session?.user || !ALLOWED.has(session.user.role)) redirect("/dashboard");

  const tenant = await prisma.tenant.findUnique({
    where: { id: session.user.tenantId },
    select: { syntheticGenerationEnabled: true },
  });

  if (!tenant?.syntheticGenerationEnabled) {
    return (
      <div className="px-8 py-12">
        <p>Synthetic generation is not enabled for this account. Contact your administrator.</p>
      </div>
    );
  }

  const digitalModels = await listDigitalModels();

  return (
    <div className="px-8 py-12">
      <h1>Generate Poses</h1>
      <p>{digitalModels.length} digital model(s) available — UI pending mockup</p>
    </div>
  );
}
