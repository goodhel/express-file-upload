/*
  Warnings:

  - Added the required column `file_id` to the `d_work_order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `d_work_order` ADD COLUMN `file_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `d_work_order` ADD CONSTRAINT `d_work_order_file_id_fkey` FOREIGN KEY (`file_id`) REFERENCES `d_file_upload`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
