/*
  Warnings:

  - You are about to drop the `CourseStep` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CourseStep" DROP CONSTRAINT "CourseStep_courseId_fkey";

-- DropTable
DROP TABLE "CourseStep";
