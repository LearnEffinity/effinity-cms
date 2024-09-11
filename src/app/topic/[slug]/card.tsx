// app/topic/[slug]/ModuleCard.tsx
"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/form/Button";

export default function ModuleCard({ module, slug }) {
  const router = useRouter();

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
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
          onClick={() => router.push(`/topic/${slug}/${module.module_number}`)}
          size="sm"
          variant="outline"
        >
          Edit Module
        </Button>
      </div>
    </div>
  );
}