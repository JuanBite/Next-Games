import { PrismaClient } from "@/src/generated/prisma"
import { PrismaNeon } from "@prisma/adapter-neon"
import { redirect } from "next/navigation"
import { stackServerApp } from "@/stack/server"
import SideBar from "@/components/SideBar"
import DashboardCharts from "@/components/dashboard/DashboardCharts"

const prisma = new PrismaClient({
    adapter: new PrismaNeon({
        connectionString: process.env.DATABASE_URL!,
    }),
})

export default async function DashboardPage() {
    const user = await stackServerApp.getUser()
    if (!user) redirect("/")

    const [games, consoles] = await Promise.all([
        prisma.game.findMany({
            include: { console: true },
        }),
        prisma.console.findMany({
            include: { games: true },
        }),
    ])

    return (
        <SideBar currentPath="/dashboard">
            <DashboardCharts games={games} consoles={consoles} />
        </SideBar>
    )
}