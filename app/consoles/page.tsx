import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation";
import SideBar from "@/components/SideBar";
import ConsolesInfo from "@/components/ConsolesInfo";

export default async function ConsolesPage({
    searchParams,
}: {
    searchParams?: {
        q?: string;
        page?: string;
    };
}) {
    const user = await stackServerApp.getUser();
    if (!user) {
        redirect("/");
    }

    return (
        <SideBar currentPath="/consoles">
            <ConsolesInfo searchParams={searchParams} />
        </SideBar>
    );
}