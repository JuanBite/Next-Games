/*
  Warnings:

  - You are about to drop the `Consoles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Games` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Games" DROP CONSTRAINT "Games_console_id_fkey";

-- DropTable
DROP TABLE "Consoles";

-- DropTable
DROP TABLE "Games";

-- CreateTable
CREATE TABLE "Console" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL DEFAULT 'no-image.png',
    "releasedate" TIMESTAMP(3) NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Console_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "cover" TEXT NOT NULL DEFAULT 'no-cover.png',
    "developer" TEXT NOT NULL,
    "releasedate" TIMESTAMP(3) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "genre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "console_id" INTEGER NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Console_name_key" ON "Console"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Game_title_key" ON "Game"("title");

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_console_id_fkey" FOREIGN KEY ("console_id") REFERENCES "Console"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
