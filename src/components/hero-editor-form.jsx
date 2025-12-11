"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const heroSchema = z.object({
  avatar: z.string().optional(),
  fullName: z.string().min(2, "Name must be at least 2 characters").max(200),
  shortDescription: z.string().min(2).max(120, "Must be 120 characters or less"),
  longDescription: z.string().min(10, "Must be at least 10 characters").max(5000),
});

export default function HeroEditorForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const form = useForm({
    resolver: zodResolver(heroSchema),
    defaultValues: {
      avatar: "",
      fullName: "",
      shortDescription: "",
      longDescription: "",
    },
  });

  // Load current hero data
  useEffect(() => {
    async function loadHero() {
      try {
        const response = await fetch("/api/hero");
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Server returned non-JSON response");
        }

        const { data } = await response.json();
        
        if (data) {
          form.reset({
            avatar: data.avatar || "",
            fullName: data.fullName || "",
            shortDescription: data.shortDescription || "",
            longDescription: data.longDescription || "",
          });
          setAvatarPreview(data.avatar);
        }
      } catch (error) {
        console.error("Failed to load hero:", error);
        toast.error("Failed to load hero data: " + error.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadHero();
  }, [form]);

  // Handle avatar file selection
  function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 1024 * 1024) {
      toast.error("Image must be less than 1MB");
      return;
    }

    setAvatarFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  }

  async function onSubmit(values) {
    setIsSaving(true);
    
    try {
      const formData = new FormData();
      formData.append("avatar", values.avatar || "");
      formData.append("fullName", values.fullName);
      formData.append("shortDescription", values.shortDescription);
      formData.append("longDescription", values.longDescription);

      if (avatarFile) {
        formData.append("avatarFile", avatarFile);
      }

      console.log("Submitting to /api/hero...");

      const response = await fetch("/api/hero", {
        method: "PUT",
        body: formData,
      });

      console.log("Response status:", response.status);

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text.substring(0, 200));
        throw new Error("Server returned non-JSON response. Check server logs.");
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || "Failed to update hero");
      }

      const { data } = result;
      
      form.reset({
        avatar: data.avatar,
        fullName: data.fullName,
        shortDescription: data.shortDescription,
        longDescription: data.longDescription,
      });

      setAvatarPreview(data.avatar);
      setAvatarFile(null);
      
      toast.success("Hero section updated successfully!");
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(error.message || "Failed to update hero section");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Hero Section</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Avatar Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Avatar</label>
              
              {avatarPreview && (
                <div className="flex justify-center mb-4">
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-32 h-32 rounded-full object-cover border-2"
                  />
                </div>
              )}

              <Input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground">
                Max 1MB. Converts to data URL for storage.
              </p>
            </div>

            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shortDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Full Stack Developer" {...field} maxLength={120} />
                  </FormControl>
                  <FormDescription>
                    {field.value?.length || 0}/120 characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="longDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Long Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell your story..."
                      className="min-h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {field.value?.length || 0}/5000 characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}