"use client"

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
} from "recharts"

interface Props {
    games: any[]
    consoles: any[]
}

const COLORS = ["#a855f7", "#22c55e", "#3b82f6", "#f97316", "#ef4444"]

export default function DashboardCharts({ games, consoles }: Props) {

    const gamesByConsole = consoles.map((c) => ({
        name: c.name,
        games: c.games.length,
    }))

    const genreMap: Record<string, number> = {}

    games.forEach((g) => {
        genreMap[g.genre] = (genreMap[g.genre] || 0) + 1
    })

    const genreData = Object.keys(genreMap).map((key) => ({
        name: key,
        value: genreMap[key],
    }))

    const totalGames = games.length
    const avgPrice =
        games.reduce((acc, g) => acc + g.price, 0) / (games.length || 1)

    return (
        <div className="p-6 space-y-10">

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <div className="bg-base-200/60 backdrop-blur-md border border-white/10 p-5 rounded-2xl shadow-lg hover:scale-[1.02] transition">
                    <p className="text-sm opacity-70">Total Games</p>
                    <p className="text-3xl font-bold text-purple-400">{totalGames}</p>
                </div>

                <div className="bg-base-200/60 backdrop-blur-md border border-white/10 p-5 rounded-2xl shadow-lg hover:scale-[1.02] transition">
                    <p className="text-sm opacity-70">Games Average Price</p>
                    <p className="text-3xl font-bold text-green-400">
                        ${avgPrice.toFixed(2)}
                    </p>
                </div>

                <div className="bg-base-200/60 backdrop-blur-md border border-white/10 p-5 rounded-2xl shadow-lg hover:scale-[1.02] transition">
                    <p className="text-sm opacity-70">Consoles</p>
                    <p className="text-3xl font-bold text-blue-400">
                        {consoles.length}
                    </p>
                </div>

            </div>

            {/* CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* BAR CHART */}
                <div className="bg-base-200/60 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-lg transition">
                    <h2 className="mb-4 font-semibold text-lg text-white">
                        Games per Console
                    </h2>

                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={gamesByConsole}>
                                <XAxis dataKey="name" tick={{ fill: "#aaa" }} />
                                <YAxis tick={{ fill: "#aaa" }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#1f1f2e",
                                        border: "1px solid #333",
                                        borderRadius: "10px",
                                    }}
                                />
                                <Bar
                                    dataKey="games"
                                    fill="#a855f7"
                                    radius={[8, 8, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* PIE CHART */}
                <div className="bg-base-200/60 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-lg transition">
                    <h2 className="mb-4 font-semibold text-lg text-white">
                        Genres Distribution
                    </h2>

                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={genreData}
                                    dataKey="value"
                                    nameKey="name"
                                    outerRadius={110}
                                    label
                                >
                                    {genreData.map((_, index) => (
                                        <Cell
                                            key={index}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>

                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#1f1f2e",
                                        border: "1px solid #333",
                                        borderRadius: "10px",
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    )
}