"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ProjectPreviewCard({ projects = [], count = 3 }) {
  const { isSignedIn } = useUser();
  const displayedProjects = projects.slice(0, count);

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Featured Projects
          </h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl">
            Check out some of my recent work
          </p>
        </div>

        {displayedProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No projects yet.</p>
            {isSignedIn && (
              <Button asChild>
                <Link href="/projects/new">Create Your First Project</Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {displayedProjects.map((project) => (
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
                    {project.keywords?.slice(0, 3).map((keyword) => (
                      <Badge key={keyword} variant="secondary" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                    {project.keywords?.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.keywords.length - 3}
                      </Badge>
                    )}
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

        {projects.length > count && (
          <div className="text-center mt-8">
            <Button asChild variant="outline" size="lg">
              <Link href="/projects">View All Projects →</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}