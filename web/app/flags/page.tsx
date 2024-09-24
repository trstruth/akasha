// app/page.tsx

import Link from 'next/link';

interface Flag {
  id: string;
  name: string;
  enabled: boolean;
  defaultValue: boolean | string;
  type: 'bool' | 'string';
}

export default async function HomePage() {
  const res = await fetch('http://localhost:3000/api/flags');
  const data = await res.json();

  if (!res.ok) {
    return <div>Error: {data.error}</div>;
  }

  const flags: Flag[] = data.flags;

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Flags</h1>
      <Link href="/flags/new">
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Create New Flag
        </button>
      </Link>
      <ul className="mt-4">
        {flags.map((flag) => (
          <li key={flag.id} className="border-b py-2">
            <Link href={`/flags/${flag.id}`} className="text-blue-600">
              {flag.name} ({flag.type})
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
