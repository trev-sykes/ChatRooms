-- DropForeignKey
ALTER TABLE "public"."MessageReceipt" DROP CONSTRAINT "MessageReceipt_messageId_fkey";

-- AddForeignKey
ALTER TABLE "public"."MessageReceipt" ADD CONSTRAINT "MessageReceipt_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "public"."Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;
