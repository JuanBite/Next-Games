"use client"
import { ArrowLeftIcon } from "@phosphor-icons/react"
import Link from "next/link"

export default function BackHomeButton()
{
    return (
        <div>
            <Link href="/" className="btn btn-default bg-white">
            <ArrowLeftIcon size={24}/>
            Go back Home
            </Link>
        </div>
    )
}