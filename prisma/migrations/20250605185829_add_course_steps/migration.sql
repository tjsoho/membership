-- DropIndex
DROP INDEX "CourseAccess_userId_courseId_key";

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

-- AddForeignKey
ALTER TABLE "CourseStep" ADD CONSTRAINT "CourseStep_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
