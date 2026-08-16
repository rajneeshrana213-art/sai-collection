import { NextResponse } from "next/server";
import { ContactSubmissionSchema } from "@/lib/validations/contact.schema";
import { prisma } from "@/lib/db/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = ContactSubmissionSchema.parse(body);

    const submission = await prisma.contactSubmission.create({
      data: parsed,
    });

    return NextResponse.json({
      success: true,
      submissionId: submission.id,
      message: "Thank you for contacting Sai Collection! We will get back to you shortly.",
    }, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "Contact submission failed" }, { status: 400 });
  }
}
