"use client";
import { Suspense, useState } from 'react';

export const dynamic = "force-dynamic"; // skip static prerender

function SearchUI() {
  const [q, setQ] = useState('macbook');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    const r = await fetch(`/api/ebay/search?q=${encodeURIComponent(q)}`);
    const j = await r.json();
    setItems(j.itemSummaries || []);
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">FlipFinder – eBay Live Search</h1>
      <div className="flex gap-2 mb-6">
        <input
          className="flex-1 border p-2 rounded"
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search eBay..."
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={run}
        >
          Search
        </button>
      </div>

      {loading && <p>Loading…</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((it: any) => (
          <a
            key={it.itemId}
            href={it.itemWebUrl}
            target="_blank"
            className="border rounded p-4 hover:shadow transition"
          >
            {it.image?.imageUrl && (
              <img
                src={it.image.imageUrl}
                alt={it.title}
                className="h-40 object-contain mb-2 w-full"
              />
            )}
            <h2 className="font-semibold line-clamp-2">{it.title}</h2>
            <p className="text-sm text-gray-500">{it.condition}</p>
            {it.price && (
              <p className="font-bold">
                {it.price.value} {it.price.currency}
              </p>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<p className="p-6">Loading…</p>}>
      <SearchUI />
    </Suspense>
  );
} 