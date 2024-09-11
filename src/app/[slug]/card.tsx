"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ModuleCard({ module, slug }) {
  const router = useRouter();

  return (
    <Card className="flex flex-col h-full">
      {module.imageUrl && (
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
          <img
            src={module.imageUrl}
            alt={module.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant="secondary">Module {module.module_number}</Badge>
        </div>
        <CardTitle className="mt-2">{module.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground">{module.description}</p>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => router.push(`/${slug}/${module.module_number}`)}
          variant="outline"
          className="w-full"
        >
          Edit Module
        </Button>
      </CardFooter>
    </Card>
  );
}