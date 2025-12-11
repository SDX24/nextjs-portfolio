/* eslint-disable @next/next/no-html-link-for-pages */
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createSlug } from "@/lib/utils";
import { notFound } from "next/navigation";

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;
  
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projects`, {
    cache: "no-store"
  });
  const { projects } = await res.json();
  
  const project = projects.find(p => createSlug(p.title) === slug);
  
  if (!project) {
    notFound();
  }

  return (
    <div className="container py-12 px-4 max-w-4xl">
      <Card>
        <CardHeader>
          <div className="relative w-full h-96 mb-6 rounded-lg overflow-hidden">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          <CardTitle className="text-4xl mb-4">{project.title}</CardTitle>
          <CardDescription className="text-lg">{project.description}</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {project.keywords.map((keyword) => (
                <Badge key={keyword} variant="secondary">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex gap-4">
            <Button asChild className="flex-1">
              <a href={project.link} target="_blank" rel="noreferrer">
                Visit Project
              </a>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <a href="/projects">Back to Projects</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}