import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { apiError, apiSuccess, HTTP_STATUS } from "@/types/api";
import { MAX_FILE_SIZE, ACCEPTED_IMAGE_TYPES } from "@/lib/constants";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        apiError("Unauthorized"),
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        apiError("No file provided"),
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    // Validate file type
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json(
        apiError("Invalid file type. Only JPEG, PNG, and WebP are allowed."),
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        apiError("File too large. Maximum size is 5MB."),
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    // Generate unique filename
    const ext = file.name.split(".").pop() ?? "jpg";
    const filename = `${userId}-${Date.now()}.${ext}`;
    const filepath = join(uploadsDir, filename);

    // Write file to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    const url = `/uploads/${filename}`;

    return NextResponse.json(
      apiSuccess({ url }),
      { status: HTTP_STATUS.CREATED }
    );
  } catch (error) {
    console.error("[UPLOAD_POST]", error);
    return NextResponse.json(
      apiError("Failed to upload file"),
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}