/*
  Warnings:

  - You are about to alter the column `id` on the `Answer` table. The data in that column will be cast from `BigInt` to `String`. This cast may fail. Please make sure the data in the column can be cast.
  - Changed the type of `type` on the `Question` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Question" DROP COLUMN "type";
ALTER TABLE "Question" ADD COLUMN     "type" STRING NOT NULL;

-- DropEnum
DROP TYPE "QuestionType";

-- RedefineTables
CREATE TABLE "_prisma_new_Answer" (
    "id" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" STRING NOT NULL,
    "questionId" UUID NOT NULL,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);
DROP INDEX "Answer_title_key";
INSERT INTO "_prisma_new_Answer" ("createdAt","id","questionId","title","updatedAt") SELECT "createdAt","id","questionId","title","updatedAt" FROM "Answer";
DROP TABLE "Answer" CASCADE;
ALTER TABLE "_prisma_new_Answer" RENAME TO "Answer";
CREATE UNIQUE INDEX "Answer_title_key" ON "Answer"("title");
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
