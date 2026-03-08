import { notFound } from "next/navigation";
import Link from "next/link";
import fs from "node:fs";
import path from "node:path";
import dynamic from "next/dynamic";
import { discoverLocalPrototypes } from "@/lib/discovery";
import { DarkModeToggle } from "@/components/layout/dark-mode-toggle";
import { Icon } from "@/components/icons";
import type { PrototypeMeta } from "@/lib/types";

interface Props {
  params: Promise<{
    designer: string;
    prototype: string;
  }>;
}

export async function generateStaticParams() {
  const prototypes = discoverLocalPrototypes();
  return prototypes.map((p) => ({
    designer: p.designer,
    prototype: p.slug,
  }));
}

export const dynamicParams = true;

export default async function PrototypePage({ params }: Props) {
  const { designer, prototype: protoSlug } = await params;

  const protoDir = path.join(
    process.cwd(),
    "src",
    "prototypes",
    designer,
    protoSlug
  );

  if (!fs.existsSync(protoDir)) {
    notFound();
  }

  const PrototypeComponent = dynamic(
    () => import(`@/prototypes/${designer}/${protoSlug}/page`),
    {
      loading: () => (
        <div className="flex items-center justify-center h-64">
          <p className="text-text-secondary">Loading prototype...</p>
        </div>
      ),
    }
  );

  let meta: PrototypeMeta | null = null;
  const metaPath = path.join(protoDir, "meta.json");
  if (fs.existsSync(metaPath)) {
    try {
      meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
    } catch {
      /* ignore */
    }
  }

  return (
    <div>
      <nav className="flex items-center justify-between px-4 py-2 border-b border-border bg-bg">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            <Icon name="arrow-left" size={14} />
            Back
          </Link>
          {meta && (
            <span className="text-sm font-medium text-text-primary">
              {meta.title}
            </span>
          )}
        </div>
        <DarkModeToggle />
      </nav>
      <PrototypeComponent />
    </div>
  );
}
