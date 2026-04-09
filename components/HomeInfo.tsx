"use client"

import Link from "next/link"
import { KeyIcon, UserPlusIcon } from "@phosphor-icons/react"

export default function HomeInfo() {
    return (
        <div className="hero min-h-screen relative overflow-hidden">
            <div className="absolute inset-0 bg-[url(/img/home.png)] bg-cover bg-center blur-sm scale-110 -z-10" />

            <div className="hero-overlay"></div>
            <div className="hero-content text-neutral-content text-center">
                <div className="max-w-md">
                    <img src="img/logo.png" alt="" />
                    <h1 className="mb-5 text-5xl font-bold">Hello Next JS</h1>
                    <p className="mb-5">
                        Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
                        quasi. In deleniti eaque aut repudiandae et a id nisi.
                    </p>
                    <Link href="handler/sign-in" className="btn btn-primary m-2"> <KeyIcon size={24} />Sign In</Link>
                    <Link href="handler/sign-up" className="btn btn-accent"> <UserPlusIcon size={24} />Sign Up</Link>

                </div>
            </div>
        </div>

    )

}


