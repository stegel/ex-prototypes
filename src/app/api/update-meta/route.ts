import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import type { PrototypeMeta } from "@/lib/types";

async function updateViaGitHub(repoFilePath: string, content: string): Promise<void> {
  const token  = process.env.GITHUB_TOKEN;
  const repo   = process.env.GITHUB_REPO;   // "owner/repo"
  const branch = process.env.GITHUB_BRANCH ?? "main";

  if (!token || !repo) {
    throw new Error("GITHUB_TOKEN and GITHUB_REPO env vars are required in production");
  }

  const apiBase = `https://api.github.com/repos/${repo}/contents/${repoFilePath}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
  };

  // Step 1: GET current SHA (required for updates)
  const getRes = await fetch(`${apiBase}?ref=${branch}`, { headers });
  if (!getRes.ok) throw new Error(`GitHub GET failed: ${getRes.status}`);
  const { sha } = await getRes.json() as { sha: string };

  // Step 2: PUT updated content
  const putRes = await fetch(apiBase, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      message: `chore: update metadata for ${repoFilePath}`,
      content: Buffer.from(content).toString("base64"),
      sha,
      branch,
    }),
  });
  if (!putRes.ok) throw new Error(`GitHub PUT failed: ${putRes.status}`);
}

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

    const jsonContent = JSON.stringify(meta, null, 2) + "\n";

    if (process.env.NODE_ENV === "development") {
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

      fs.writeFileSync(metaPath, jsonContent);
      return NextResponse.json({ success: true, mode: "filesystem" });
    } else {
      const repoFilePath = `src/prototypes/${designer}/${protoSlug}/meta.json`;
      await updateViaGitHub(repoFilePath, jsonContent);
      return NextResponse.json({ success: true, mode: "github" });
    }
  } catch (error) {
    console.error("Failed to update meta.json:", error);
    return NextResponse.json(
      { error: "Failed to update metadata" },
      { status: 500 }
    );
  }
}
