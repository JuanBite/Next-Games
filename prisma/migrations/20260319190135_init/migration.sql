/*
  Warnings:

  - You are about to drop the `Console` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Game` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_console_id_fkey";

-- DropTable
DROP TABLE "Console";

-- DropTable
DROP TABLE "Game";

-- CreateTable
CREATE TABLE "Consoles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL DEFAULT 'no-image.png',
    "releasedate" TIMESTAMP(3) NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Consoles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Games" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "developer" TEXT NOT NULL,
    "releasedate" TIMESTAMP(3) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "genre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "console_id" INTEGER NOT NULL,

    CONSTRAINT "Games_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Consoles_name_key" ON "Consoles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Games_title_key" ON "Games"("title");

-- AddForeignKey
ALTER TABLE "Games" ADD CONSTRAINT "Games_console_id_fkey" FOREIGN KEY ("console_id") REFERENCES "Consoles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
