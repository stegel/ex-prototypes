import fs from "node:fs";
import path from "node:path";
import type { PrototypeMeta, Prototype } from "./types";

const PROTOTYPES_DIR = path.join(process.cwd(), "src", "prototypes");

function readMeta(dirPath: string): PrototypeMeta | null {
  const metaPath = path.join(dirPath, "meta.json");
  if (!fs.existsSync(metaPath)) return null;

  try {
    const raw = fs.readFileSync(metaPath, "utf-8");
    return JSON.parse(raw) as PrototypeMeta;
  } catch {
    console.warn(`Failed to parse meta.json at ${metaPath}`);
    return null;
  }
}

export function discoverLocalPrototypes(): Prototype[] {
  const prototypes: Prototype[] = [];
  if (!fs.existsSync(PROTOTYPES_DIR)) return prototypes;

  const designerDirs = fs.readdirSync(PROTOTYPES_DIR, { withFileTypes: true });

  for (const designerEntry of designerDirs) {
    if (!designerEntry.isDirectory()) continue;
    if (designerEntry.name.startsWith("_")) continue;

    const designerPath = path.join(PROTOTYPES_DIR, designerEntry.name);
    const prototypeDirs = fs.readdirSync(designerPath, {
      withFileTypes: true,
    });

    for (const protoEntry of prototypeDirs) {
      if (!protoEntry.isDirectory()) continue;
      if (protoEntry.name.startsWith("_")) continue;

      const protoPath = path.join(designerPath, protoEntry.name);
      const meta = readMeta(protoPath);

      if (meta) {
        prototypes.push({
          meta,
          designer: designerEntry.name,
          slug: protoEntry.name,
          path: `/prototypes/${designerEntry.name}/${protoEntry.name}`,
          type: "local",
        });
      }
    }
  }

  return prototypes;
}
