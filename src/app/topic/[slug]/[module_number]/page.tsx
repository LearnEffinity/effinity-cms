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

export default function EditModule({ params }) {
  const supabase = createClient();
  const router = useRouter();
  const slug = params.slug;
  const moduleNumber = parseInt(params.module_number);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [length, setLength] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [markdownJson, setMarkdownJson] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const editor = useCreateBlockNote({});

  useEffect(() => {
    async function fetchModule() {
      try {
        const { data, error } = await supabase
          .from("modules")
          .select("*")
          .eq("topic", slug)
          .eq("module_number", moduleNumber)
          .single();

        if (error) {
          if (error.code === "PGRST116") {
            setIsEditMode(false);
            return;
          }
          throw error;
        }

        setIsEditMode(true);
        setName(data.name);
        setDescription(data.description);
        setDifficulty(data.difficulty);
        setLength(data.length);
        setMarkdownJson(data.markdown);
        if (data.image) {
          const publicUrl = await fetchImageUrl(data.image);
          setImageUrl(publicUrl);
        }

        editor.insertBlocks(data.markdown, editor.document[0].id, "before");
      } catch (error) {
        console.error("Error fetching module:", error);
      }
    }

    fetchModule();
  }, [slug, moduleNumber]);

  const fetchImageUrl = async (imagePath) => {
    const { data } = supabase.storage
      .from("module_images")
      .getPublicUrl(imagePath);

    return data.publicUrl;
  };

  const onChange = () => {
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
    setIsLoading(true);

    try {
      let imagePath = imageUrl;
      if (image) {
        imagePath = await handleImageUpload(image);
      }

      if (isEditMode) {
        const { data, error } = await supabase
          .from("modules")
          .update({
            name,
            description,
            difficulty,
            length,
            image: imagePath,
            markdown: markdownJson,
          })
          .eq("topic", slug)
          .eq("module_number", moduleNumber);

        if (error) {
          throw error;
        }
      } else {
        const { data, error } = await supabase.from("modules").insert([
          {
            name,
            description,
            module_number: moduleNumber,
            difficulty,
            length,
            image: imagePath,
            markdown: markdownJson,
            topic: slug,
          },
        ]);

        if (error) {
          throw error;
        }
      }

      router.push(`/topic/${slug}`);
    } catch (error) {
      console.error("Error saving module:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    name && description && difficulty && length && markdownJson;

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
            {isEditMode ? "Edit Module" : "Create New Module"} for {slug} as
            Module {moduleNumber}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputWithLabel
              label="Module Name"
              value={name}
              onChange={(v) => setName(v)}
            />
            <InputWithLabel
              label="Description"
              value={description}
              onChange={(v) => setDescription(v)}
            />
            <InputWithLabel
              label="Module Number"
              value={moduleNumber}
              readOnly
            />
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
            />
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Image
              </label>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                className="mt-1 block w-full text-sm text-gray-500"
              />
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Module Image"
                  className="mt-4 h-48 w-full object-cover"
                />
              )}
            </div>
            <Button
              type="submit"
              disabled={!isFormValid || isLoading}
              size="md"
              variant="primary"
            >
              {isLoading
                ? "Saving..."
                : isEditMode
                  ? "Save Changes"
                  : "Create Module"}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
