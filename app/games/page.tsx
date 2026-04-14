import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation";
import SideBar from "@/components/SideBar";
import GamesInfo from "@/components/GamesInfo";

type SearchParams = {
    q?: string;
    page?: string;
};

export default async function GamesPage({
    searchParams,
}: {
    searchParams?: Promise<SearchParams>;
}) {
    const user = await stackServerApp.getUser();
    if (!user) {
        redirect("/");
    }

    const resolvedParams = await searchParams;

    return (
        <SideBar currentPath="/games">
            <GamesInfo searchParams={resolvedParams} />
        </SideBar>
    );
}