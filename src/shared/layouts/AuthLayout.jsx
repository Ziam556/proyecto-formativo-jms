import { Outlet } from "react-router-dom";
import heroBg from "@/assets/images/background-login.png";

export default function AuthLayout() {
    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundImage: `url(${heroBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <Outlet />
        </div>
    );
}