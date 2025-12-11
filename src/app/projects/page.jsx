"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import ProjectPreviewCard from "@/components/project-preview-card";
import { Button } from "@/components/ui/button";
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
        console.log("Projects from API:", data.projects); // Debug log
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
    <div className="container py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">All Projects</h1>
        {isSignedIn && (
          <Button asChild>
            <Link href="/projects/new">Add New Project</Link>
          </Button>
        )}
      </div>
      
      <ProjectPreviewCard projects={projects} count={projects.length} />
    </div>
  );
}