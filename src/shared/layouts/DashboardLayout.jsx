import { Outlet } from "react-router-dom";
import heroBg from "@/assets/images/normal-background.png";
import { Navbar } from "@/shared";

export default function DashboardLayout() {
    return (
        <div>
             {/* Fondo con imagen */}
            <div
                className="absolute inset-0 -z-10 bg-cover bg-center"
                style={{backgroundImage: `url(${heroBg})`}}
            />
            <Navbar/>
            <main>
                <Outlet/>
            </main>
        </div>
    );
}