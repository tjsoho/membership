import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/db/prisma";
import { PrismaClient } from "@prisma/client";

const typedPrisma = prisma as PrismaClient;

// GET: fetch all steps for a course
export async function GET(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  const { courseId } = params;
  const steps = await typedPrisma.courseStep.findMany({
    where: { courseId },
    orderBy: { order: "asc" },
  });
  return NextResponse.json({ steps });
}

// POST: replace all steps for a course
export async function POST(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  const { courseId } = params;
  const { steps } = await req.json();

  // Remove old steps
  await typedPrisma.courseStep.deleteMany({ where: { courseId } });

  // Create new steps
  const created = await typedPrisma.courseStep.createMany({
    data: (
      steps as Array<{
        title: string;
        videoUrl: string;
        transcript: string;
        duration?: string;
      }>
    ).map((step, i) => ({
      ...step,
      courseId,
      order: i,
    })),
  });

  return NextResponse.json({ success: true, count: created.count });
}
