export async function POST(req) {
  try {
    const formData = await req.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const img = formData.get("img");
    const link = formData.get("link");
    const keywords = JSON.parse(formData.get("keywords") || "[]");

    const project = { title, description, img, link, keywords };
    
    console.log("New project received:", project);

    // TODO: validate with Zod server-side
    // TODO: persist to DB
    // TODO: revalidatePath("/projects")

    return Response.json({ ok: true, project }, { status: 201 });
  } catch (err) {
    console.error(err);
    return Response.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }
}