import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

function TopicCard({ name, description, slug }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href={`/topic/${slug}`}>Add/Edit Modules</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href={`/topic/${slug}/edit`}>Edit Topic Info</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function CreateTopicCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Topic</CardTitle>
      </CardHeader>
      <CardFooter>
        <Button asChild>
          <Link href="/topic/create">Create</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export { TopicCard, CreateTopicCard };