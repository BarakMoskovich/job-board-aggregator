-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'USD';

-- AlterTable
ALTER TABLE "Preferences" ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'ILS';
