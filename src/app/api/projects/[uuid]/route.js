import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { getProjectById, updateProject, deleteProject } from "@/lib/db";

const projectSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  image: z.string().url().optional(),
  link: z.string().url().optional(),
  keywords: z.array(z.string()).optional(),
});

export async function GET(request, { params }) {
  try {
    const { uuid } = await params;
    const project = await getProjectById(uuid);
    
    if (!project) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    
    return NextResponse.json({ data: project });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { uuid } = await params;
    const body = await request.json();
    const validated = projectSchema.parse(body);
    const updated = await updateProject(uuid, validated);
    
    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Project updated", data: updated });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { uuid } = await params;
    const deleted = await deleteProject(uuid);
    
    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Project deleted", data: deleted });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}