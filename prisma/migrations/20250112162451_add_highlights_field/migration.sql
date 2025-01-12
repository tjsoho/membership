-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "highlights" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "whatYouWillLearn" TEXT[] DEFAULT ARRAY[]::TEXT[];
