"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const newProjectSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters" }).max(200),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }).max(500),
  img: z.string().url({ message: "Must be a valid URL" }),
  link: z.string().url({ message: "Must be a valid URL" }),
  keywords: z.array(z.string()).min(1, { message: "Add at least one keyword" }),
});

export default function NewPage() {
  const [draftKeyword, setDraftKeyword] = useState("");
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(newProjectSchema),
    defaultValues: {
      title: "",
      description: "",
      img: "https://placehold.co/300.png",
      link: "",
      keywords: [],
    },
  });

  async function onSubmit(values) {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('img', values.img);
    formData.append('link', values.link);
    formData.append('keywords', JSON.stringify(values.keywords));

    try {
      const response = await fetch('/api/projects/new', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Project created:', data);
        alert('Project created successfully!');
        router.push('/projects');
      } else {
        const error = await response.json();
        console.error('Error:', error);
        alert('Failed to create project');
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error occurred');
    }
  }

  return (
    <div className="container py-12 px-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Create New Project</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="My Awesome Project" {...field} />
                    </FormControl>
                    <FormDescription>
                      The title of your project.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="A brief description of your project" {...field} />
                    </FormControl>
                    <FormDescription>
                      A brief description of your project.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="img"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.png" {...field} />
                    </FormControl>
                    <FormDescription>
                      The thumbnail image URL for your project.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Link</FormLabel>
                    <FormControl>
                      <Input placeholder="https://your-project.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      The live link to your project.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="keywords"
                render={({ field }) => {
                  const currentKeywords = field.value ?? [];

                  const handleAddKeyword = () => {
                    const value = draftKeyword.trim();
                    if (!value || currentKeywords.includes(value)) return;

                    const updated = [...currentKeywords, value];
                    field.onChange(updated);
                    setDraftKeyword("");
                  };

                  const handleRemoveKeyword = (keyword) => {
                    const updated = currentKeywords.filter((k) => k !== keyword);
                    field.onChange(updated);
                  };

                  const handleKeyDown = (event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleAddKeyword();
                    }
                  };

                  return (
                    <FormItem>
                      <FormLabel>Keywords</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input
                            value={draftKeyword}
                            onChange={(e) => setDraftKeyword(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Add a keyword and press Enter"
                          />
                          <Button type="button" onClick={handleAddKeyword}>
                            Add
                          </Button>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Tag your project so its easier to filter later.
                      </FormDescription>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {currentKeywords.map((keyword) => (
                          <Badge
                            key={keyword}
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            {keyword}
                            <button
                              type="button"
                              className="ml-1 text-xs hover:text-destructive"
                              onClick={() => handleRemoveKeyword(keyword)}
                              aria-label={`Remove ${keyword}`}
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <Button type="submit" className="w-full">Create Project</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}