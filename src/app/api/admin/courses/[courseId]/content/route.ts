import { NextRequest, NextResponse } from "next/server";

// For demonstration, use a simple in-memory store
const courseContentStore = new Map();

export async function GET(req: NextRequest, { params }) {
  const { courseId } = params;
  const content = courseContentStore.get(courseId) || { steps: [] };
  return NextResponse.json(content);
}

export async function POST(req: NextRequest, { params }) {
  const { courseId } = params;
  const { steps } = await req.json();
  courseContentStore.set(courseId, { steps });
  return NextResponse.json({ success: true });
}
