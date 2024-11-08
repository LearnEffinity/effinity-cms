"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { deleteModule } from "./actions";

export default function ModuleCard({ module, slug }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    console.log("Deleting module:", module, slug);
    try {
      const result = await deleteModule(slug, module.module_number);
      if (result.success) {
        router.refresh();
      } else {
        console.error("Error deleting module:", result.error);
      }
    } catch (error) {
      console.error("Error deleting module:", error);
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="space-y-4">
      {showConfirm && (
        <Alert variant="destructive">
          <AlertTitle>Confirm Deletion</AlertTitle>
          <AlertDescription>
            <p className="mb-4">
              Are you sure you want to delete this module and all its associated lessons?
              This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

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
        <CardFooter className="flex gap-2">
          <Button
            onClick={() => router.push(`/${slug}/${module.module_number}`)}
            variant="outline"
            className="flex-1"
          >
            Edit Module
          </Button>
          <Button
            onClick={() => setShowConfirm(true)}
            variant="destructive"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}