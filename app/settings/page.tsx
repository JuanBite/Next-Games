import SideBar from "@/components/SideBar";
import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation";
import { AccountSettings } from "@stackframe/stack";

export default async function SettingsPage() {
    const user = await stackServerApp.getUser();
    if (!user) redirect("/");

    return (
        <SideBar currentPath="/settings">
            <div className="w-full min-h-screen bg-base-300 p-6 lg:p-10">

                {/* HEADER */}
                <div className="mb-8">
                    <h1 className="text-3xl lg:text-4xl font-bold text-white">
                        Account Settings
                    </h1>
                    <p className="text-white/40 text-sm mt-1">
                        Manage your profile, security and preferences
                    </p>
                </div>

                {/* CONTENT */}
                <div className="max-w-4xl mx-auto bg-base-200/60 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg overflow-hidden">

                    {/* top accent bar */}
                    <div className="h-1 w-full bg-gradient-to-r from-purple-500 via-purple-500 to-purple-400" />

                    <div className="p-6 lg:p-10">
                        <AccountSettings />
                    </div>

                </div>

            </div>
        </SideBar>
    );
}