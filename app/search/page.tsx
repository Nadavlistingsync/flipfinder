"use client";
import { Suspense } from "react";
import SearchUI from "./SearchUI";

export const dynamic = "force-dynamic"; // prevents static prerendering

export default function SearchPage() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <SearchUI />
    </Suspense>
  );
} 