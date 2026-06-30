import { Outlet } from "react-router-dom";
import heroBg from "@/assets/images/normal-background.png";
import { Header } from "@/shared";
import { useSessionExpiry } from "@/shared/hooks/useSessionExpiry";

export default function DashboardLayout() {
    useSessionExpiry();

    return (
        <div className="h-screen overflow-hidden flex flex-col">
            {/* Fondo con imagen */}
            <div
                className="fixed inset-0 -z-10 bg-cover bg-center"
                style={{backgroundImage: `url(${heroBg})`}}
            />
            <Header/>
            <main className="flex-1 overflow-y-auto">
                <Outlet/>
            </main>
        </div>
    );
}