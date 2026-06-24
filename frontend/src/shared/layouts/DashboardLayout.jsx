import { Outlet } from "react-router-dom";
import heroBg from "@/assets/images/normal-background.png";
import { Header } from "@/shared";

export default function DashboardLayout() {
    return (
        <div className="relative min-h-screen">
             {/* Fondo con imagen */}
            <div
                className="fixed inset-0 -z-10 bg-cover bg-center"
                style={{backgroundImage: `url(${heroBg})`}}
            />
            <Header/>
            <main>
                <Outlet/>
            </main>
        </div>
    );
}