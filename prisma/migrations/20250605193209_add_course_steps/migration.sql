-- CreateTable
CREATE TABLE "CourseStep" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "transcript" TEXT NOT NULL,
    "duration" TEXT,
    "order" INTEGER NOT NULL,

    CONSTRAINT "CourseStep_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CourseStep_courseId_idx" ON "CourseStep"("courseId");

-- AddForeignKey
ALTER TABLE "CourseStep" ADD CONSTRAINT "CourseStep_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
