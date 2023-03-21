/*
  Warnings:

  - Added the required column `fake_data` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Schedule` ADD COLUMN `fake_data` BOOLEAN NOT NULL;
