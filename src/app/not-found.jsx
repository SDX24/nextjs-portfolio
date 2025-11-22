import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function NotFound({ message = "The page you're looking for doesn't exist." }) {
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
            <span className="text-4xl">404</span>
          </div>
          <CardTitle className="text-2xl">Page Not Found</CardTitle>
          <CardDescription className="text-base mt-2">
            {message}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}