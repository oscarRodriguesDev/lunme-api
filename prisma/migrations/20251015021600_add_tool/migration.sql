/*
  Warnings:

  - Added the required column `tool` to the `model_doc` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "model_doc" ADD COLUMN     "tool" TEXT NOT NULL;
