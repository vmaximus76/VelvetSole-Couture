import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import { SiteNav } from "@/components/site/SiteNav";
import { GenerateForm } from "@/components/generate/GenerateForm";

export const metadata = {
  title: "Create — VelvetSole Couture",
};

export default async function GeneratePage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/generate");

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#ede9e4" }}>
      <SiteNav session={session} />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ height: 1, background: "#750851", width: "100%", maxWidth: 1300 }} />
      </div>
      <GenerateForm />
    </div>
  );
}
