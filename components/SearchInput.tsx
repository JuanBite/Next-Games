'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function SearchInput() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [search, setSearch] = useState(searchParams.get('q') || '')

    useEffect(() => {
        const timeout = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString())
            if (search) {
                params.set('q', search)
            } else {
                params.delete('q')
            }
            params.delete('page')
            router.push(`?${params.toString()}`)
            router.refresh()
        }, 400)
        return () => clearTimeout(timeout)
    }, [search])

    return (
        <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[#2a2d35] text-white placeholder-gray-500 border border-[#3a3d45] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-purple-500 transition-colors w-64"
        />
    )
}