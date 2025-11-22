import Link from "next/link";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createSlug } from "@/lib/utils";

export default async function ProjectsPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projects`, {
    cache: "no-store"
  });
  const { projects } = await res.json();

  return (
    <div className="container py-12 px-4">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          All Projects
        </h1>
        <p className="max-w-[900px] text-muted-foreground md:text-xl">
          Explore my complete portfolio of projects
        </p>
        <Button asChild>
          <Link href="/projects/new">Create New Project</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {projects.map(p => {
          const slug = createSlug(p.title);
            return (
              <Card key={slug} className="flex flex-col h-full group hover:scale-105 transition-transform">
                <CardHeader className="p-0">
                  <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      className="object-cover"
                      sizes="(max-width:768px)100vw,(max-width:1200px)50vw,33vw"
                    />
                  </div>
                </CardHeader>
                <CardContent className="flex-1 p-6">
                  <CardTitle className="text-xl mb-2">{p.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{p.description}</CardDescription>
                </CardContent>
                <CardFooter className="p-6 pt-0 flex gap-2">
                  <Button asChild size="sm" variant="secondary" className="flex-1">
                    <a href={p.link} target="_blank" rel="noreferrer">Open</a>
                  </Button>
                  <Button asChild size="sm" className="flex-1">
                    <Link href={`/projects/${slug}`}>Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            );
        })}
      </div>
    </div>
  );
}