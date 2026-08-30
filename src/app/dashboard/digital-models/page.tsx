import { redirect } from "next/navigation";
import { auth } from "../../../../auth";
import { listDigitalModels } from "@/app/actions/digital-models";
import { DigitalModelsClient } from "@/components/digital-models/DigitalModelsClient";

export const metadata = { title: "Digital Models — VelvetSole Couture" };

const ALLOWED = new Set(["CREATOR", "ADMIN"]);

export default async function DigitalModelsPage() {
  const session = await auth();
  if (!session?.user || !ALLOWED.has(session.user.role)) redirect("/dashboard");

  const models = await listDigitalModels();

  return <DigitalModelsClient initialModels={models} />;
}
