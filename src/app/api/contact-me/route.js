import { Resend } from "resend";
import { z } from "zod";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getHero, upsertHero } from "@/lib/db";

const resend = new Resend(process.env.RESEND_API_KEY);

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10).max(1000),
});

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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/hero - Protected endpoint
export async function PUT(request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { message: "You must be logged in to edit the hero section" },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const avatarFile = formData.get("avatarFile");

    let avatarDataUrl = formData.get("avatar") || "";

    // Convert uploaded file to data URL
    if (avatarFile && typeof avatarFile.arrayBuffer === "function") {
      const arrayBuffer = await avatarFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString("base64");
      const mimeType = avatarFile.type || "image/png";
      avatarDataUrl = `data:${mimeType};base64,${base64}`;
    }

    const payload = {
      avatar: avatarDataUrl,
      fullName: formData.get("fullName"),
      shortDescription: formData.get("shortDescription"),
      longDescription: formData.get("longDescription"),
    };

    const validated = heroSchema.parse(payload);
    const hero = await upsertHero(validated);

    return NextResponse.json({ message: "Hero updated", data: hero }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");

    // Server-side validation
    const validationResult = contactSchema.safeParse({ name, email, message });

    if (!validationResult.success) {
      return Response.json(
        { ok: false, message: "Invalid input data", errors: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM,
      to: process.env.RESEND_TO,
      subject: `Portfolio Contact: Message from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
      replyTo: email,
    });

    if (error) {
      console.error("Resend error:", error);
      return Response.json(
        { ok: false, message: "Failed to send email" },
        { status: 500 }
      );
    }

    console.log("Email sent successfully:", data);
    return Response.json({ ok: true, message: "Email sent successfully" }, { status: 200 });
  } catch (err) {
    console.error("Contact API error:", err);
    return Response.json(
      { ok: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}