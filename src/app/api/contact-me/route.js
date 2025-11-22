import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10).max(1000),
});

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

export function GET() {
  return Response.json({ error: "Method Not Allowed" }, { status: 405 });
}