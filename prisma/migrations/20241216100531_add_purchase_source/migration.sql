-- This is an empty migration.

-- Add purchaseSource column to Purchase table
ALTER TABLE "Purchase" 
ADD COLUMN "purchaseSource" TEXT NOT NULL DEFAULT 'INTERNAL';