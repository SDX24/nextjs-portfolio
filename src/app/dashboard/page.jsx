import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { fetchProjects } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

export default async function DashboardPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();
  const projects = await fetchProjects();

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Welcome, {user?.firstName || user?.emailAddresses[0]?.emailAddress}!
        </p>
        
        <div className="grid gap-6">
          <div className="p-6 border rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Your Projects ({projects.length})</h2>
              <Button asChild>
                <Link href="/projects/new">Add New Project</Link>
              </Button>
            </div>
            
            {projects.length === 0 ? (
              <p className="text-muted-foreground">No projects yet. Create your first project!</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <Card key={project.id}>
                    <CardHeader>
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-40 object-cover rounded-t-lg mb-2"
                      />
                      <CardTitle>{project.title}</CardTitle>
                      <CardDescription>{project.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="flex gap-2">
                      <Button asChild variant="outline" size="sm" className="flex-1">
                        <Link href={`/projects/${project.id}`}>View</Link>
                      </Button>
                      <Button asChild size="sm" className="flex-1">
                        <Link href={`/projects/${project.id}/edit`}>Edit</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}