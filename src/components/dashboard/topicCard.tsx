import Link from "next/link";

function TopicCard({ name, description, slug }) {
  return (
    <div className="rounded-lg border p-4 shadow-md transition-shadow duration-200 hover:shadow-lg">
      <h2 className="text-xl font-semibold">{name}</h2>
      <p className="text-gray-700">{description}</p>
      <div className="mt-4 flex gap-4">
        <Link href={`/topic/${slug}`} passHref>
          Add/Edit Modules
        </Link>
        <Link href={`/topic/${slug}/edit`} passHref>
          Edit Topic Info
        </Link>
      </div>
    </div>
  );
}

function CreateTopicCard() {
  return (
    <div className="rounded-lg border p-4 shadow-md transition-shadow duration-200 hover:shadow-lg">
      <h2 className="text-xl font-semibold">Create New Topic</h2>
      <Link href="/topic/create" passHref>
        Create
      </Link>
    </div>
  );
}

export { TopicCard, CreateTopicCard };
