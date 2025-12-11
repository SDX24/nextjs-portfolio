"use server";

import { neon } from "@neondatabase/serverless";
import { v4 as uuidv4 } from "uuid";

const sql = neon(process.env.NEON_DB_URL);

function mapProject(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    image: row.image,
    link: row.link,
    keywords: row.keywords ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function ensureProjectsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS projects (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      title text NOT NULL,
      description text NOT NULL,
      image text NOT NULL,
      link text NOT NULL,
      keywords jsonb NOT NULL DEFAULT '[]'::jsonb,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;
}

export async function seedProjectsTable() {
  const seed = [
    {
      title: "E-Commerce Platform",
      description: "Full-stack e-commerce site built with Next.js and Stripe",
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e5e7eb' width='400' height='300'/%3E%3Ctext x='50%' y='50%' font-size='20' fill='%236b7280' text-anchor='middle' dy='.3em'%3EE-Commerce%3C/text%3E%3C/svg%3E",
      link: "https://example.com",
      keywords: JSON.stringify(["Next.js", "Stripe", "React"]),
    },
    {
      title: "Task Management App",
      description: "Collaborative task manager with real-time updates",
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e5e7eb' width='400' height='300'/%3E%3Ctext x='50%' y='50%' font-size='20' fill='%236b7280' text-anchor='middle' dy='.3em'%3ETask Manager%3C/text%3E%3C/svg%3E",
      link: "https://example.com",
      keywords: JSON.stringify(["React", "Firebase", "Tailwind"]),
    },
    {
      title: "Portfolio Website",
      description: "Personal portfolio showcasing my projects and skills",
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e5e7eb' width='400' height='300'/%3E%3Ctext x='50%' y='50%' font-size='20' fill='%236b7280' text-anchor='middle' dy='.3em'%3EPortfolio%3C/text%3E%3C/svg%3E",
      link: "https://example.com",
      keywords: JSON.stringify(["Next.js", "Tailwind", "React"]),
    },
  ];

  for (const item of seed) {
    await sql`
      INSERT INTO projects (title, description, image, link, keywords)
      VALUES (${item.title}, ${item.description}, ${item.image}, ${item.link}, ${item.keywords}::jsonb)
      ON CONFLICT (id) DO NOTHING
    `;
  }
}

export async function fetchProjects() {
  const rows = await sql`SELECT * FROM projects ORDER BY created_at DESC`;
  return rows.map(mapProject);
}

export async function getProjectById(id) {
  const [row] = await sql`SELECT * FROM projects WHERE id = ${id} LIMIT 1`;
  return row ? mapProject(row) : null;
}

export async function insertProject(data) {
  const [row] = await sql`
    INSERT INTO projects (title, description, image, link, keywords)
    VALUES (${data.title}, ${data.description}, ${data.image}, ${data.link}, ${JSON.stringify(data.keywords || [])}::jsonb)
    RETURNING *
  `;
  return mapProject(row);
}

export async function updateProject(id, updates) {
  const sets = [];
  const params = [id];
  let paramCount = 2;

  if (updates.title !== undefined) {
    sets.push(`title = $${paramCount}`);
    params.push(updates.title);
    paramCount++;
  }
  if (updates.description !== undefined) {
    sets.push(`description = $${paramCount}`);
    params.push(updates.description);
    paramCount++;
  }
  if (updates.image !== undefined) {
    sets.push(`image = $${paramCount}`);
    params.push(updates.image);
    paramCount++;
  }
  if (updates.link !== undefined) {
    sets.push(`link = $${paramCount}`);
    params.push(updates.link);
    paramCount++;
  }
  if (updates.keywords !== undefined) {
    sets.push(`keywords = $${paramCount}::jsonb`);
    params.push(JSON.stringify(updates.keywords));
    paramCount++;
  }

  if (sets.length === 0) return null;

  sets.push('updated_at = now()');

  const query = `
    UPDATE projects
    SET ${sets.join(', ')}
    WHERE id = $1
    RETURNING *
  `;

  const [row] = await sql(query, params);
  return row ? mapProject(row) : null;
}

export async function deleteProject(id) {
  const [row] = await sql`DELETE FROM projects WHERE id = ${id} RETURNING *`;
  return row ? mapProject(row) : null;
}