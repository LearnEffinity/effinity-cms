// app/topic/[slug]/TopicPageClient.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Button from "@/components/form/Button";
import { InputWithLabel } from "@/components/form/Input";
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
    <main className="flex min-h-screen bg-gray-100">
      <div className="flex-1 p-8">
        <div className="mb-8">
          {isEditing ? (
            <form onSubmit={handleEdit} className="space-y-4">
              <InputWithLabel
                label="Title"
                value={topic.name}
                onChange={(v) => setTopic({ ...topic, name: v })}
                required
              />
              <InputWithLabel
                label="Description"
                value={topic.description}
                onChange={(v) => setTopic({ ...topic, description: v })}
                required
              />
              <Button
                type="submit"
                disabled={isLoading}
                size="md"
                variant="primary"
              >
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </form>
          ) : (
            <div className="mx-auto flex flex-col justify-center ">
              <h1 className="mb-4 text-3xl font-bold ">{topic.name}</h1>
              <p className="mb-6 text-gray-700">{topic.description}</p>
              <Button
                onClick={() => setIsEditing(true)}
                className="w-85"
              >
                Edit Topic Name & Description
              </Button>
            </div>
          )}
        </div>

        <div className="mb-6 flex flex-col items-center justify-between">
          <h2 className="text-2xl font-semibold">Modules</h2>
          <Button
            onClick={() => router.push(`/topic/${slug}/create-module`)}
            size="md"
            variant="primary"
            className="w-60"
          >
            Create Module
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <ModuleCard key={module.id} module={module} slug={slug} />
          ))}
        </div>
      </div>
    </main>
  );
}