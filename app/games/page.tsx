import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation"
import SideBar from "@/components/SideBar";
import GamesInfo from "@/components/GamesInfo"

// games/page.tsx
export default async function GamesPage({ searchParams } : { searchParams: Promise<{q?: string}> }) {
    const user = await stackServerApp.getUser();
    if(!user) {
        redirect('/');
    }

    return (
        <div>
            <SideBar currentPath={'/games'}>
                <GamesInfo searchParams={searchParams} />
            </SideBar>
        </div>
    );
}