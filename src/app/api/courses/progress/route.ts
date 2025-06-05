import { NextResponse } from 'next/server';
import { getAuthSession } from '../../../../lib/auth';
import { prisma } from '../../../../lib/db/prisma';

export async function POST(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId, stepId, completed } = await request.json();

    const progress = await prisma.courseProgress.upsert({
      where: {
        userId_courseId_stepId: {
          userId: session.user.id,
          courseId,
          stepId,
        },
      },
      update: {
        completed,
      },
      create: {
        userId: session.user.id,
        courseId,
        stepId,
        completed,
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID required' }, { status: 400 });
    }

    const progress = await prisma.courseProgress.findMany({
      where: {
        userId: session.user.id,
        courseId,
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
} 