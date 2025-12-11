import { NextResponse } from "next/server";
import { fetchProjects } from "@/lib/db";

// GET /api/projects
export async function GET() {
  try {
    const projects = await fetchProjects();
    return NextResponse.json({ projects });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
