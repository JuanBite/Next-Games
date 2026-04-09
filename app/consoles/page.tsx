import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation"
import SideBar from "@/components/SideBar";
import ConsolesInfo from "@/components/ConsolesInfo"

// games/page.tsx
export default async function ConsolesPage({ searchParams } : { searchParams: Promise<{q?: string}> }) {
    const user = await stackServerApp.getUser();
    if(!user) {
        redirect('/');
    }

    return (
        <div>
            <SideBar currentPath={'/consoles'}>
                <ConsolesInfo searchParams={searchParams} />
            </SideBar>
        </div>
    );
}