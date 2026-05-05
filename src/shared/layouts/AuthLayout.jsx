import { Outlet } from "react-router-dom";
import heroBg from "@/assets/images/background-login.png";
import { Login } from "@/features/auth"

export default function MainLayout () {
    return(
        <div className="relative min-h-screen text-text-primary">
            {/* Fondo con imagen */}
            <div
                className="absolute inset-0 -z-10 bg-cover bg-center"
                style={{backgroundImage: `url(${heroBg})`}}
            />

            <main>
                <Login/>
                <Outlet/>
            </main>
        </div>
    );
} 