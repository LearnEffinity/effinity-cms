"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Button from "@/components/form/Button";
import { InputWithLabel } from "@/components/form/Input";

export default function TopicPage({ params }) {
  const supabase = createClient();
  const router = useRouter();
  const slug = params.slug;
  const [topic, setTopic] = useState({ name: "", description: "", slug: "" });
  const [modules, setModules] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchImageUrl = async (imagePath) => {
    const { data } = supabase.storage
      .from("module_images")
      .getPublicUrl(imagePath);

    return data.publicUrl;
  };

  useEffect(() => {
    async function fetchTopic() {
      try {
        const { data, error } = await supabase
          .from("topics")
          .select("name, description, slug")
          .eq("slug", slug)
          .single();
        if (error) throw error;
        setTopic(data);
      } catch (error) {
        console.error("Error fetching topic:", error);
      }
    }

    async function fetchModules() {
      try {
        const { data, error } = await supabase
          .from("modules")
          .select("*")
          .eq("topic", slug)
          .order("module_number", { ascending: true });
        if (error) throw error;

        const modulesWithImages = await Promise.all(
          data.map(async (module) => {
            if (module.image) {
              module.imageUrl = await fetchImageUrl(module.image);
            }
            return module;
          }),
        );

        setModules(modulesWithImages);
      } catch (error) {
        console.error("Error fetching modules:", error);
      }
    }

    fetchTopic();
    fetchModules();
  }, [slug]);

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
            <div key={module.id} className="rounded-lg bg-white p-6 shadow-md">
              {module.imageUrl && (
                <img
                  src={module.imageUrl}
                  alt={module.name}
                  className="mb-4 h-48 w-full rounded-t-lg object-cover"
                />
              )}
              <h3 className="mb-2 text-xl font-bold">
                Module {module.module_number}: {module.name}
              </h3>
              <p className="mb-4 text-gray-700">{module.description}</p>
              <div className="flex justify-end">
                <Button
                  onClick={() =>
                    router.push(`/topic/${slug}/${module.module_number}`)
                  }
                  size="sm"
                  variant="outline"
                  className="text-black"
                >
                  Edit Module
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
