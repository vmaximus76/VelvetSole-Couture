import { redirect } from "next/navigation";
import { auth } from "../../../../auth";
import { listDigitalModels } from "@/app/actions/digital-models";

export const metadata = { title: "Digital Models — VelvetSole Couture" };

const ALLOWED = new Set(["CREATOR", "ADMIN"]);

export default async function DigitalModelsPage() {
  const session = await auth();
  if (!session?.user || !ALLOWED.has(session.user.role)) redirect("/dashboard");

  const models = await listDigitalModels();

  return (
    <div className="px-8 py-12">
      <h1>Digital Models</h1>
      <p>{models.length} model(s) — UI pending mockup</p>
      <pre className="text-xs mt-4">{JSON.stringify(models, null, 2)}</pre>
    </div>
  );
}
