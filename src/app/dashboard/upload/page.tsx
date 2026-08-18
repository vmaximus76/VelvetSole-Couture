import { redirect } from "next/navigation";
import { auth } from "../../../../auth";
import { VideoUploadForm } from "@/components/upload/video-upload-form";

const UPLOAD_ROLES = new Set(["CREATOR", "ADMIN"]);

export default async function UploadPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard/upload");
  }

  if (!UPLOAD_ROLES.has(session.user.role)) {
    redirect("/dashboard");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6 py-16">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Creator Studio</p>
        <h1 className="mt-2 text-2xl font-light tracking-wide text-neutral-100">New base footage</h1>
      </div>
      <VideoUploadForm />
    </main>
  );
}
