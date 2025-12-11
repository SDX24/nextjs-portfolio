"use server";

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.NEON_DB_URL);

const HERO_PLACEHOLDER_AVATAR = "data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAACADs=";

const defaultHeroContent = {
  avatar: HERO_PLACEHOLDER_AVATAR,
  fullName: "Stefan Dorosh",
  shortDescription: "Full Stack Web Developer",
  longDescription: "Welcome to my portfolio! I'm a passionate developer with expertise in building modern web applications. I love creating innovative solutions and bringing ideas to life through code.",
};

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

function mapHeroRow(row) {
  return {
    id: row.id,
    avatar: row.avatar || HERO_PLACEHOLDER_AVATAR,
    fullName: row.full_name,
    shortDescription: row.short_description,
    longDescription: row.long_description,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

// Project functions
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
  const rows = await sql`SELECT * FROM projects WHERE id = ${id}`;
  return rows.length > 0 ? mapProject(rows[0]) : null;
}

export async function insertProject(data) {
  const rows = await sql`
    INSERT INTO projects (title, description, image, link, keywords)
    VALUES (${data.title}, ${data.description}, ${data.image}, ${data.link}, ${JSON.stringify(data.keywords || [])}::jsonb)
    RETURNING *
  `;
  return mapProject(rows[0]);
}

export async function updateProject(id, updates) {
  // Build the update dynamically
  const current = await getProjectById(id);
  if (!current) return null;

  const newData = {
    title: updates.title ?? current.title,
    description: updates.description ?? current.description,
    image: updates.image ?? current.image,
    link: updates.link ?? current.link,
    keywords: updates.keywords ?? current.keywords,
  };

  const rows = await sql`
    UPDATE projects
    SET title = ${newData.title},
        description = ${newData.description},
        image = ${newData.image},
        link = ${newData.link},
        keywords = ${JSON.stringify(newData.keywords)}::jsonb,
        updated_at = now()
    WHERE id = ${id}
    RETURNING *
  `;

  return rows.length > 0 ? mapProject(rows[0]) : null;
}

export async function deleteProject(id) {
  const rows = await sql`DELETE FROM projects WHERE id = ${id} RETURNING *`;
  return rows.length > 0 ? mapProject(rows[0]) : null;
}

// Hero functions
export async function ensureHeroTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS hero (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      avatar text NOT NULL DEFAULT '',
      full_name text NOT NULL,
      short_description text NOT NULL CHECK (char_length(short_description) <= 120),
      long_description text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;

  const rows = await sql`SELECT COUNT(*)::int as count FROM hero`;
  const count = rows[0]?.count || 0;

  if (count === 0) {
    await sql`
      INSERT INTO hero (avatar, full_name, short_description, long_description)
      VALUES (
        ${defaultHeroContent.avatar},
        ${defaultHeroContent.fullName},
        ${defaultHeroContent.shortDescription},
        ${defaultHeroContent.longDescription}
      )
    `;
  }
}

export async function getHero() {
  await ensureHeroTable();
  
  const rows = await sql`
    SELECT id, avatar, full_name, short_description, long_description,
           created_at as "createdAt", updated_at as "updatedAt"
    FROM hero
    ORDER BY created_at ASC
    LIMIT 1
  `;

  if (rows.length === 0) {
    return { ...defaultHeroContent, id: null, createdAt: null, updatedAt: null };
  }

  return mapHeroRow(rows[0]);
}

export async function upsertHero(updates = {}) {
  await ensureHeroTable();
  const current = await getHero();

  const merged = {
    avatar: updates.avatar ?? current?.avatar ?? defaultHeroContent.avatar,
    fullName: updates.fullName ?? current?.fullName ?? defaultHeroContent.fullName,
    shortDescription: updates.shortDescription ?? current?.shortDescription ?? defaultHeroContent.shortDescription,
    longDescription: updates.longDescription ?? current?.longDescription ?? defaultHeroContent.longDescription,
  };

  if (!current?.id) {
    const rows = await sql`
      INSERT INTO hero (avatar, full_name, short_description, long_description)
      VALUES (${merged.avatar}, ${merged.fullName}, ${merged.shortDescription}, ${merged.longDescription})
      RETURNING id, avatar, full_name, short_description, long_description,
                created_at as "createdAt", updated_at as "updatedAt"
    `;
    return mapHeroRow(rows[0]);
  }

  const rows = await sql`
    UPDATE hero
    SET avatar = ${merged.avatar},
        full_name = ${merged.fullName},
        short_description = ${merged.shortDescription},
        long_description = ${merged.longDescription},
        updated_at = now()
    WHERE id = ${current.id}
    RETURNING id, avatar, full_name, short_description, long_description,
              created_at as "createdAt", updated_at as "updatedAt"
  `;

  return mapHeroRow(rows[0]);
}