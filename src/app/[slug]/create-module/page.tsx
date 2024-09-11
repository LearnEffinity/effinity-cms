"use client";

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function CreateModule({ params }) {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const topic = params.slug;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    difficulty: '',
    length: '',
    image: null,
    module_number: '',
  });

  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const fetchNextModuleNumber = async () => {
      const { data, error } = await supabase
        .from('modules')
        .select('module_number')
        .eq('topic', topic)
        .order('module_number', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching next module number:', error);
        return;
      }

      const nextModuleNumber = data.length > 0 ? data[0].module_number + 1 : 1;
      setFormData(prev => ({ ...prev, module_number: nextModuleNumber }));
    };

    fetchNextModuleNumber();
  }, [topic]);

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

  const handleDifficultyChange = (value) => {
    setFormData(prev => ({ ...prev, difficulty: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    const { name, description, difficulty, length, image, module_number } = formData;

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
        module_number,
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

    router.push(`/${topic}`);
  };

  return (
    <div className="container mx-auto py-10">
      <Card className='border-none'>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Create New Module for {topic} as Module {formData.module_number}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Module Name</Label>
              <Input
                id="name"
                name="name"
                required
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                required
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="module_number">Module Number</Label>
              <Input
                id="module_number"
                name="module_number"
                value={formData.module_number}
                readOnly
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select onValueChange={handleDifficultyChange} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="length">Length (in minutes)</Label>
              <Input
                id="length"
                name="length"
                type="number"
                required
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">Image</Label>
              <Input
                id="image"
                type="file"
                name="image"
                required
                onChange={handleInputChange}
              />
            </div>
            
            <Button
              type="submit"
              disabled={!isFormValid}
              className="w-full"
            >
              Create Module
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}