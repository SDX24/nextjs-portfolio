"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import ProjectFilter from "@/components/project-filter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isSignedIn } = useUser();

  useEffect(() => {
    async function loadProjects() {
      try {
        const response = await fetch("/api/projects");
        const data = await response.json();
        setProjects(data.projects || []);
      } catch (error) {
        console.error("Failed to load projects:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadProjects();
  }, []);

  if (isLoading) {
    return <div className="container py-12 text-center">Loading projects...</div>;
  }

  return (
    <div className="container py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">All Projects</h1>
          <p className="text-muted-foreground">
            Browse through {projects.length} projects
          </p>
        </div>
        {isSignedIn && (
          <Button asChild>
            <Link href="/projects/new">Add New Project</Link>
          </Button>
        )}
      </div>

      <ProjectFilter projects={projects}>
        {(filteredProjects) => (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="flex flex-col h-full">
                <CardHeader className="p-0">
                  <div className="relative w-full aspect-video overflow-hidden rounded-t-lg">
                    <img
                      src={project.image || "https://placehold.co/400x300"}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://placehold.co/400x300";
                      }}
                    />
                  </div>
                </CardHeader>

                <CardContent className="flex-1 p-6">
                  <CardTitle className="text-xl mb-2">{project.title}</CardTitle>
                  <CardDescription className="text-base mb-4">
                    {project.description}
                  </CardDescription>
                  
                  {/* Display tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.keywords?.map((keyword) => (
                      <span
                        key={keyword}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="p-6 pt-0 flex gap-2">
                  <Button asChild variant="default" className="flex-1">
                    <Link href={`/projects/${project.id}`}>View Project</Link>
                  </Button>
                  
                  {isSignedIn && (
                    <Button asChild variant="outline" className="flex-1">
                      <Link href={`/projects/${project.id}/edit`}>Edit</Link>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </ProjectFilter>
    </div>
  );
}