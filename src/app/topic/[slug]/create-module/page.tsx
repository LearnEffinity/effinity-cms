"use client";

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Button from "@/components/form/Button";
import { InputWithLabel } from "@/components/form/Input";

export default function CreateModule({ params, nextModuleNumber }) {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const topic = params.slug;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    difficulty: '',
    length: '',
    image: null,
  });

  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const { name, description, difficulty, length, image } = formData;
    setIsFormValid(name && description && difficulty && length && image);
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    const { name, description, difficulty, length, image } = formData;

    let imagePath = null;
    if (image) {
      const { data, error } = await supabase.storage
        .from("module_images")
        .upload(`public/${image.name}`, image);

      if (error) {
        console.error("Error uploading image:", error);
        return;
      }
      imagePath = data.path;
    }

    const { data, error } = await supabase.from("modules").insert([
      {
        name,
        description,
        module_number: nextModuleNumber,
        difficulty,
        length,
        image: imagePath,
        topic,
      },
    ]);

    if (error) {
      console.error("Error creating module:", error);
      return;
    }

    router.push(`/topic/${topic}`);
  };

  return (
    <main className="flex min-h-screen bg-gray-100 p-8">
      <div className="w-full pl-4">
        <div className="h-full rounded-lg bg-white p-6 shadow-md">
          <h1 className="mb-6 text-center text-2xl font-bold">
            Create New Module for {topic} as Module {nextModuleNumber}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputWithLabel
              name="name"
              label="Module Name"
              required
              onChange={handleInputChange}
            />
            <InputWithLabel
              name="description"
              label="Description"
              required
              onChange={handleInputChange}
            />
            <InputWithLabel
              name="module_number"
              label="Module Number"
              value={nextModuleNumber}
              readOnly
              required
            />
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Difficulty
              </label>
              <select
                name="difficulty"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
                onChange={handleInputChange}
              >
                <option value="" disabled selected>Select difficulty</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </div>
            <InputWithLabel
              name="length"
              label="Length (in minutes)"
              required
              onChange={handleInputChange}
            />
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Image
              </label>
              <input
                type="file"
                name="image"
                className="mt-1 block w-full text-sm text-gray-500"
                required
                onChange={handleInputChange}
              />
            </div>
            <Button
              type="submit"
              size="md"
              variant="primary"
              disabled={!isFormValid}
            >
              Create Module
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}