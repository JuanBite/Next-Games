import { PrismaClient, Prisma } from '../src/generated/prisma'
import { PrismaNeon } from '@prisma/adapter-neon'
import SearchInput from '@/components/SearchInput'
import Pagination from '@/components/Pagination'

import CreateGameModal from "@/components/modals/CreateGameModal"
import EditGameButton from "@/components/modals/EditGameButton"
import DeleteGameButton from "@/components/modals/DeleteGameButton"

const prisma = new PrismaClient({
    adapter: new PrismaNeon({
        connectionString: process.env.DATABASE_URL!
    })
})

const PER_PAGE = 12

export default async function GamesInfo({
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

    const skip = (currentPage - 1) * PER_PAGE

    // 🔎 filtro por precio
    const priceFilter =
        !isNaN(Number(search)) && search !== ''
            ? { price: { equals: Number(search) } }
            : {}

    const where: Prisma.GameWhereInput = search
        ? {
            OR: [
                {
                    price: {
                        equals: Number(search),
                    },
                },
                {
                    title: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    genre: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    developer: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    console: {
                        is: {
                            name: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                    },
                },
            ],
        }
        : {};

    const [games, total, consoles] = await Promise.all([
        prisma.game.findMany({
            where,
            include: { console: true },
            skip,
            take: PER_PAGE,
            orderBy: { id: "asc" },
        }),
        prisma.game.count({ where }),
        prisma.console.findMany({ orderBy: { name: "asc" } }),
    ])

    const totalPages = Math.ceil(total / PER_PAGE)

    return (
        <div className="p-6">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold text-white">Games</h1>
                    <SearchInput />
                </div>

                <CreateGameModal consoles={consoles} />
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {games.map((game) => (
                    <div
                        key={game.id}
                        className="relative rounded-2xl overflow-hidden shadow-lg cursor-pointer group"
                    >
                        {/* Imagen */}
                        <img
                            src={"img/" + game.cover}
                            alt={game.title}
                            className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110"
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/60 transition-all duration-500" />

                        {/* Acciones */}
                        <div className="absolute top-3 right-3 flex gap-2">
                            <span className="badge badge-accent">
                                ${game.price}
                            </span>
                        </div>

                        {/* Badge consola */}
                        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
                            🎮 {game.console.name}
                        </div>

                        {/* Título */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 transition-transform duration-500 group-hover:-translate-y-28">
                            <h2 className="text-white text-lg font-bold drop-shadow">
                                {game.title}
                            </h2>
                        </div>

                        {/* Info expandida */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full transition-transform duration-500 group-hover:translate-y-0">
                            <p className="text-white text-sm mb-1">
                                👨‍💻 {game.developer}
                            </p>

                            <p className="text-white text-sm mb-2 line-clamp-2">
                                {game.description}
                            </p>
                            <div className="flex gap-2 mt-2 justify-between">
                                <EditGameButton game={game} consoles={consoles} />
                                <DeleteGameButton gameId={game.id} gameTitle={game.title} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* PAGINACIÓN */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={total}
                itemsPerPage={PER_PAGE}
            />
        </div>
    )
}