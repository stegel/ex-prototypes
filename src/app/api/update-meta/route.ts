import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import type { PrototypeMeta } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { designer, protoSlug, meta } = body as {
      designer: string;
      protoSlug: string;
      meta: PrototypeMeta;
    };

    if (!designer || !protoSlug || !meta) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const metaPath = path.join(
      process.cwd(),
      "src",
      "prototypes",
      designer,
      protoSlug,
      "meta.json"
    );

    if (!fs.existsSync(metaPath)) {
      return NextResponse.json(
        { error: "Prototype not found" },
        { status: 404 }
      );
    }

    fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2) + "\n");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update meta.json:", error);
    return NextResponse.json(
      { error: "Failed to update metadata" },
      { status: 500 }
    );
  }
}
