"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Button from "@/components/form/Button";
import { InputWithLabel } from "@/components/form/Input";

export default function EditModuleForm({ initialModule, initialImageUrl, slug, moduleNumber }) {
  const supabase = createClientComponentClient()
  const router = useRouter();

  const [name, setName] = useState(initialModule.name);
  const [description, setDescription] = useState(initialModule.description);
  const [difficulty, setDifficulty] = useState(initialModule.difficulty);
  const [length, setLength] = useState(initialModule.length);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [isLoading, setIsLoading] = useState(false);

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
      let imagePath = initialModule.image;
      if (image) {
        imagePath = await handleImageUpload(image);
      }

      const { data, error } = await supabase
        .from("modules")
        .update({
          name,
          description,
          difficulty,
          length,
          image: imagePath,
        })
        .eq("topic", slug)
        .eq("module_number", moduleNumber);

      if (error) {
        throw error;
      }

      router.push(`/topic/${slug}`);
    } catch (error) {
      console.error("Error saving module:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = name && description && difficulty && length;

  return (
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
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}