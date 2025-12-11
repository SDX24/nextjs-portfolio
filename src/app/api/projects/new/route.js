import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { insertProject } from "@/lib/db";

const projectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  image: z.string().url(),
  link: z.string().url(),
  keywords: z.array(z.string()).optional(),
});

export async function POST(request) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      image: formData.get("img"), // ← Gets "img" from form but stores as "image"
      link: formData.get("link"),
      keywords: JSON.parse(formData.get("keywords") || "[]"),
    };

    const validated = projectSchema.parse(data);
    const project = await insertProject(validated);
    
    return NextResponse.json({ message: "Project created", data: project }, { status: 201 });
  } catch (error) {
    console.error("POST /api/projects/new error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}