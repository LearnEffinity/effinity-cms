"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Button from "@/components/form/Button";
import { InputWithLabel } from "@/components/form/Input";

import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

export default function CreateModule({ params }) {
  const supabase = createClient();
  const router = useRouter();
  const topic = params.slug;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [moduleNumber, setModuleNumber] = useState(1);
  const [difficulty, setDifficulty] = useState("");
  const [length, setLength] = useState("");
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [markdownJson, setMarkdownJson] = useState(null);

  const editor = useCreateBlockNote({});

  useEffect(() => {
    async function fetchModules() {
      try {
        const { data, error } = await supabase
          .from("modules")
          .select("module_number")
          .eq("topic", topic)
          .order("module_number", { ascending: false })
          .limit(1);
        if (error) throw error;
        const nextModuleNumber =
          data.length > 0 ? data[0].module_number + 1 : 1;
        setModuleNumber(nextModuleNumber);
      } catch (error) {
        console.error("Error fetching modules:", error);
      }
    }
    fetchModules();
  }, [topic]);

  const onChange = () => {
    console.log("editor.document", editor.document);
    const json = editor.document;
    setMarkdownJson(json);
  };

  const handleImageUpload = async (file) => {
    const { data, error } = await supabase.storage
      .from("module_images")
      .upload(`public/${file.name}`, file);

    if (error) {
      throw error;
    }

    return data.path;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("data", {
      name,
      description,
      moduleNumber,
      difficulty,
      length,
      markdownJson,
    });
    setIsLoading(true);

    try {
      const imagePath = image ? await handleImageUpload(image) : null;

      const { data, error } = await supabase.from("lessons").insert([
        {
          name,
          description,
          module_number: moduleNumber,
          difficulty,
          length,
          image: imagePath,
          markdown: markdownJson,
          topic,
        },
      ]);

      if (error) console.error("Error creating module:", error);

      router.push(`/topic/${topic}`);
    } catch (error) {
      console.error("Error creating module:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    name && description && moduleNumber && difficulty && length && markdownJson;

  return (
    <main className="flex min-h-screen bg-gray-100 p-8">
      <div className="w-1/2 pr-4">
        <div className="h-full rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-2xl font-bold">Markdown Editor</h2>
          <BlockNoteView editor={editor} onChange={onChange} />
        </div>
      </div>
      <div className="w-1/2 pl-4">
        <div className="h-full rounded-lg bg-white p-6 shadow-md">
          <h1 className="mb-6 text-center text-2xl font-bold">
            Create New Module for {topic} as Module {moduleNumber}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputWithLabel
              label="Module Name"
              value={name}
              onChange={(v) => setName(v)}
              required
            />
            <InputWithLabel
              label="Description"
              value={description}
              onChange={(v) => setDescription(v)}
              required
            />
            <InputWithLabel
              label="Module Number"
              value={moduleNumber}
              readOnly
              required
            />
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              >
                <option value="" disabled>
                  Select difficulty
                </option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </div>
            <InputWithLabel
              label="Length (in minutes)"
              value={length}
              onChange={(v) => setLength(v)}
              required
            />
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Image
              </label>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                className="mt-1 block w-full text-sm text-gray-500"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={!isFormValid || isLoading}
              size="md"
              variant="primary"
            >
              {isLoading ? "Creating..." : "Create Module"}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
