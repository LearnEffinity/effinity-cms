"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Button from "@/components/form/Button";
import { InputWithLabel } from "@/components/form/Input";

export default function TopicPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const [topic, setTopic] = useState({ name: "", description: "", slug: "" });
  const [modules, setModules] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const slug = params.slug;

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
        setModules(data);
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
    <main className="flex min-h-screen flex-col items-center bg-gray-100 p-8">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-md">
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
          <div>
            <h1 className="mb-4 text-3xl font-bold">{topic.name}</h1>
            <p className="mb-6 text-gray-700">{topic.description}</p>
            <Button
              onClick={() => setIsEditing(true)}
              size="md"
              variant="outline"
            >
              Edit
            </Button>
          </div>
        )}
        <h2 className="mb-4 mt-8 text-2xl font-semibold">Modules</h2>
        <ul className="space-y-2">
          {modules.map((module) => (
            <li key={module.id} className="rounded-lg bg-gray-100 p-4 shadow">
              {module.image && (
                <img
                  src={`https://${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${module.image}`}
                  alt={module.name}
                  className="h-48 w-full rounded-t-lg object-cover"
                />
              )}
              <h3 className="text-xl font-bold">{module.name}</h3>
              <p className="text-gray-700">{module.description}</p>
              <Button
                onClick={() =>
                  router.push(`/topic/${slug}/edit-module/${module.id}`)
                }
                size="sm"
                variant="outline"
                className="mt-4"
              >
                Edit Module
              </Button>
            </li>
          ))}
        </ul>
        <Button
          onClick={() => router.push(`/topic/${slug}/create-module`)}
          size="md"
          variant="primary"
          className="mt-6"
        >
          Create Module
        </Button>
      </div>
    </main>
  );
}
