'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export default function Pagination({ currentPage, totalPages }: { currentPage: number, totalPages: number }) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const goToPage = (page: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('page', String(page))
        router.push(`?${params.toString()}`)
        router.refresh()
    }

    if (totalPages <= 1) return null

    return (
        <div className="flex justify-center gap-2 mt-10 flex-wrap">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-all
                        ${page === currentPage
                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                            : 'bg-[#2a2d35] text-gray-400 border border-[#3a3d45] hover:border-purple-500 hover:text-white'
                        }`}
                >
                    {page}
                </button>
            ))}
        </div>
    )
}