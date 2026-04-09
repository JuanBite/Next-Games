import { PrismaClient } from '../src/generated/prisma'
import { PrismaNeon } from '@prisma/adapter-neon'
import SearchInput from '@/components/SearchInput'
import Pagination from '@/components/Pagination'

import CreateConsoleModal from "@/components/modals/CreateConsoleModal"
import EditConsoleButton from "@/components/modals/EditConsoleButton"
import DeleteConsoleButton from "@/components/modals/DeleteConsoleButton"

const prisma = new PrismaClient({
    adapter: new PrismaNeon({
        connectionString: process.env.DATABASE_URL!
    })
})

const PER_PAGE = 12

export default async function ConsolesInfo({
    searchParams,
}: {
    searchParams?: {
        q?: string;
        page?: string;
    };
}) {
    const q = searchParams?.q ?? ""
    const page = searchParams?.page ?? "1"

    const search = q
    const currentPage = Number(page) || 1

    const where = search
        ? {
            OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { manufacturer: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ],
        }
        : {}

    const [consoles, total] = await Promise.all([
        prisma.console.findMany({
            where,
            skip: (currentPage - 1) * PER_PAGE,
            take: PER_PAGE,
        }),
        prisma.console.count({ where }),
    ])

    const totalPages = Math.ceil(total / PER_PAGE)

    return (
        <div className="p-6">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold text-white">Consoles</h1>
                    <SearchInput />
                </div>

                <CreateConsoleModal />
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {consoles.map((console) => (
                    <div
                        key={console.id}
                        className="relative rounded-2xl overflow-hidden shadow-lg cursor-pointer group"
                    >
                        {/* Imagen */}
                        <img
                            src={"img/" + console.image}
                            alt={console.name}
                            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                        />

                        {/* Overlay dinámico */}
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/60 transition-all duration-500" />

                        {/* Acciones */}


                        {/* Badge */}
                        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
                            🎮 {console.manufacturer}
                        </div>

                        {/* Nombre (sube) */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 transition-transform duration-500 group-hover:-translate-y-28">
                            <h2 className="text-white text-lg font-bold drop-shadow">
                                {console.name}
                            </h2>
                        </div>

                        {/* Info expandida */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full transition-transform duration-500 group-hover:translate-y-0">
                            <p className="text-white text-sm mb-1">
                                👨‍💻 {console.manufacturer}
                            </p>
                            <p className="text-white text-sm line-clamp-2">
                                {console.description}
                            </p>
                            <div className="flex gap-2 mt-2 justify-between">
                                <EditConsoleButton consoleRecord={console} />
                                <DeleteConsoleButton
                                    consoleId={console.id}
                                    consoleName={console.name}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* PAGINACIÓN */}
            <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
    )
}