import { NextResponse } from "next/server";
import { fetchProjects } from "@/lib/db";

// GET /api/projects
export async function GET() {
  try {
    const projects = await fetchProjects();
    return NextResponse.json({ projects });
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
