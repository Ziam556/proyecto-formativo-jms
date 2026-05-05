import { Outlet } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import heroBg from "@/assets/images/normal-background.png";
import { ArrowBigLeftDash } from "lucide-react";
import { IconButton } from "@/shared";
import { Navbar } from "@/shared";

export default function MainLayout() {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen text-text-primary">
            <div
                style={{ 
                    backgroundImage: `url(${heroBg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center center",
                    backgroundRepeat: "no-repeat",
                    backgroundAttachment: "fixed",
                    position: "fixed",
                    inset: 0,
                    zIndex: -10
                }}
            />
            <Link to="/auth">
                <IconButton onClick={() => navigate("/auth")}>
                    <ArrowBigLeftDash />
                </IconButton>
            </Link>
            <Navbar />
            <main>
                <Outlet />
            </main>
        </div>
    );
}