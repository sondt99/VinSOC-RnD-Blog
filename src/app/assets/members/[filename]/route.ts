import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { MEMBER_ASSETS_DIR } from "@/lib/content/paths";

const MIME: Record<string, string> = {
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  // basic path traversal guard
  if (filename.includes("/") || filename.includes("..")) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const ext = path.extname(filename).toLowerCase();
  const contentType = MIME[ext];
  if (!contentType) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const filePath = path.join(MEMBER_ASSETS_DIR, filename);
  let buffer: Buffer;
  try {
    buffer = Buffer.from(await fs.readFile(filePath));
  } catch {
    return new NextResponse("Not Found", { status: 404 });
  }

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=604800, immutable",
    },
  });
}
