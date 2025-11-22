"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

export default function ProjectNotFound() {
  const params = useParams();
  const slug = params?.slug || "unknown";

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
            <span className="text-4xl">404</span>
          </div>
          <CardTitle className="text-2xl">Project Not Found</CardTitle>
          <CardDescription className="text-base mt-2">
            The project <span className="font-semibold">{slug}</span> doesnt exist in our portfolio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center">
            This project may have been removed or the URL might be incorrect.
          </p>
        </CardContent>
        <CardFooter className="flex gap-2 justify-center">
          <Button asChild variant="outline">
            <Link href="/projects">View All Projects</Link>
          </Button>
          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}