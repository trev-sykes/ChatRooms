-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "isDiscoverable" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "lastSeen" TIMESTAMP(3);
