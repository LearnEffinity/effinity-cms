"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ModuleCard from "./card";

export default function TopicPageClient({ initialTopic, initialModules, slug }) {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [topic, setTopic] = useState(initialTopic);
  const [modules, setModules] = useState(initialModules);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from("topics")
        .update({ name: topic.name, description: topic.description })
        .eq("slug", slug);
      if (error) throw error;
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating topic:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-5xl">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">{topic.name}</CardTitle>
            <CardDescription>{topic.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <form onSubmit={handleEdit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={topic.name}
                    onChange={(e) => setTopic({ ...topic, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={topic.description}
                    onChange={(e) => setTopic({ ...topic, description: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save"}
                </Button>
              </form>
            ) : (
              <Button onClick={() => setIsEditing(true)} variant="outline">
                Edit Topic
              </Button>
            )}
          </CardContent>
        </Card>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Modules</h2>
          <Button
            onClick={() => router.push(`/${slug}/create-module`)}
            size="lg"
          >
            Create Module
          </Button>
        </div>

        <Separator className="my-6" />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <ModuleCard key={module.id} module={module} slug={slug} />
          ))}
        </div>
      </div>
    </main>
  );
}