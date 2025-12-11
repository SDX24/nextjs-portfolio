import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { getHero, upsertHero } from "@/lib/db";

const heroSchema = z.object({
  avatar: z.string().optional(),
  fullName: z.string().min(2).max(200),
  shortDescription: z.string().min(2).max(120),
  longDescription: z.string().min(10).max(5000),
});

// GET /api/hero - Public endpoint
export async function GET() {
  try {
    const hero = await getHero();
    return NextResponse.json({ data: hero });
  } catch (error) {
    console.error("GET /api/hero error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/hero - Protected endpoint
export async function PUT(request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "You must be logged in to edit the hero section" }, 
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const avatarFile = formData.get("avatarFile");
    
    let avatarDataUrl = formData.get("avatar") || "";

    // Convert uploaded file to data URL
    if (avatarFile && avatarFile.size > 0) {
      try {
        const arrayBuffer = await avatarFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = buffer.toString('base64');
        const mimeType = avatarFile.type || 'image/png';
        avatarDataUrl = `data:${mimeType};base64,${base64}`;
      } catch (fileError) {
        console.error("Error processing avatar file:", fileError);
        return NextResponse.json(
          { error: "Failed to process avatar file" }, 
          { status: 400 }
        );
      }
    }

    const payload = {
      avatar: avatarDataUrl || undefined,
      fullName: formData.get("fullName"),
      shortDescription: formData.get("shortDescription"),
      longDescription: formData.get("longDescription"),
    };

    console.log("Validating payload:", { 
      ...payload, 
      avatar: payload.avatar ? `${payload.avatar.substring(0, 30)}...` : 'none' 
    });

    const validated = heroSchema.parse(payload);
    const hero = await upsertHero(validated);

    return NextResponse.json({ message: "Hero updated", data: hero }, { status: 200 });
  } catch (error) {
    console.error("PUT /api/hero error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors }, 
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || "Internal server error" }, 
      { status: 500 }
    );
  }
}