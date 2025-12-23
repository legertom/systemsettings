import Link from "next/link";
import { listScenarios } from "@/lib/scenarioStore";

export default async function Home() {
  const scenarios = await listScenarios();
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-xl font-semibold">Training scenarios</h1>
      <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
        Pick a scenario to practice editing system settings. There’s no grading
        or time limit—click Save to get gentle guidance and see what’s left.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {scenarios.map((s) => (
          <Link
            key={s.id}
            href={`/s/${encodeURIComponent(s.id)}`}
            className="rounded-lg border border-zinc-200 bg-white p-4 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
          >
            <div className="text-sm font-semibold">{s.title}</div>
            {s.description ? (
              <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{s.description}</div>
            ) : null}
            <div className="mt-3 text-xs font-medium text-zinc-900">
              Open →
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
