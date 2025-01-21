/*
  Warnings:

  - Added the required column `user_id` to the `savePost` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "savePost" ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "savePost" ADD CONSTRAINT "savePost_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "People"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
