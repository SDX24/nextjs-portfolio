import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/db";
import EditProjectForm from "@/components/edit-project-form";

export default async function EditProjectPage({ params }) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  const { uuid } = await params;
  const project = await getProjectById(uuid);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Edit Project</h1>
        <EditProjectForm project={project} uuid={uuid} />
      </div>
    </div>
  );
}