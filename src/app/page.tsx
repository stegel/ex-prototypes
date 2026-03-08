import Link from "next/link";
import { discoverLocalPrototypes } from "@/lib/discovery";
import { DarkModeToggle } from "@/components/layout/dark-mode-toggle";
import { formatDate, displayName } from "@/lib/utils";

export default function HomePage() {
  const prototypes = discoverLocalPrototypes();

  const grouped = new Map<string, typeof prototypes>();
  for (const p of prototypes) {
    if (!grouped.has(p.designer)) grouped.set(p.designer, []);
    grouped.get(p.designer)!.push(p);
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <header className="mb-10 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Prototypes
          </h1>
          <p className="text-text-secondary text-lg">
            Local preview of your prototypes.
          </p>
        </div>
        <DarkModeToggle />
      </header>

      {prototypes.length === 0 ? (
        <div className="text-center py-20 text-text-tertiary">
          <p className="text-lg mb-2">No prototypes yet.</p>
          <p className="text-sm">
            Run{" "}
            <code className="bg-bg-tertiary px-2 py-1 rounded text-text-secondary font-mono">
              npm run new &quot;My Prototype&quot;
            </code>{" "}
            to create your first one.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {Array.from(grouped.entries()).map(([designer, items]) => (
            <section key={designer}>
              <h2 className="text-lg font-semibold text-text-primary mb-4">
                {displayName(designer)}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {items.map((p) => (
                  <Link
                    key={p.slug}
                    href={p.path}
                    className="block rounded-lg border border-border bg-bg p-5 shadow-card hover:shadow-card-hover transition-shadow"
                  >
                    <h3 className="font-medium text-text-primary mb-1">
                      {p.meta.title}
                    </h3>
                    <p className="text-sm text-text-secondary mb-3 line-clamp-2">
                      {p.meta.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-text-tertiary">
                      <span>{formatDate(p.meta.date)}</span>
                      {p.meta.status && (
                        <span className="inline-flex items-center rounded-full bg-bg-tertiary px-2 py-0.5">
                          {p.meta.status}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
