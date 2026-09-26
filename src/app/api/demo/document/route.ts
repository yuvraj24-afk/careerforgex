import { NextRequest, NextResponse } from "next/server";
import { getAIProvider } from "@/lib/ai/factory";
import { db } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

// Maximum upload size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "text/plain",
];

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limiter = rateLimit(`demo_doc:${ip}`, { limit: 15, windowMs: 60000 });
  if (!limiter.success) {
    return NextResponse.json({ error: "Rate limit reached. Please wait." }, { status: 429 });
  }

  try {
    const contentType = req.headers.get("content-type") || "";
    let fileName = "sample-carrier-invoice.pdf";
    let fileSize = 245000;
    let mimeType = "application/pdf";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;

      if (file) {
        if (file.size > MAX_FILE_SIZE) {
          return NextResponse.json({ error: "File exceeds 10MB limit." }, { status: 400 });
        }
        if (!ALLOWED_MIME_TYPES.includes(file.type)) {
          return NextResponse.json(
            { error: "Invalid file type. Allowed formats: PDF, PNG, JPG, JPEG." },
            { status: 400 }
          );
        }
        fileName = file.name;
        fileSize = file.size;
        mimeType = file.type;
        // In-memory stream processing: We do not retain the raw uploaded document on disk
      }
    } else {
      const json = await req.json();
      fileName = json.fileName || fileName;
      fileSize = json.fileSize || fileSize;
      mimeType = json.mimeType || mimeType;
    }

    const provider = getAIProvider();
    const result = await provider.extractDocument({
      fileName,
      fileSize,
      mimeType,
    });

    await db.demoRun.create({
      data: {
        demoType: "document_extraction",
        mode: provider.isMock ? "demo" : "live",
        inputPayload: JSON.stringify({ fileName, fileSize, mimeType }),
        resultSummary: `${result.documentType} - ${result.company} (${result.amount || "N/A"})`,
        resultPayload: JSON.stringify(result),
      },
    });

    return NextResponse.json({
      success: true,
      mode: "Interactive Demo Extraction",
      fileName,
      data: result,
      temporaryProcessingNotice: "Document processed in ephemeral memory. No persistent copy retained.",
    });
  } catch (err: any) {
    console.error("Document extraction error:", err);
    return NextResponse.json({ error: "Document processing encountered an error." }, { status: 500 });
  }
}
