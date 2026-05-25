import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthLayout, DashboardLayout } from "@/shared";
import { Login } from "@/features/auth";
import { UserPage, CreateUserPage, ListUserPage } from "@/features/users";
import { HomePage } from "@/features/home";
import { ConfigPage } from "@/features/config";
import { GroupsListPage, CreateGroupPage } from "@/features/groups";
import { ReturnableMaterialPage, ListReturnableMaterialPage, CreateReturnableMaterialPage } from "@/features/returnable-material";
import { BrandsPage, CreateBrandPage } from "@/features/brands";



const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/auth" replace />,
    },
    {
        path: "/auth",
        element: <AuthLayout />,
        children: [
            { index: true, element: <Login /> },
        ],
    },
    {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
            { index: true, element: <Navigate to="/dashboard/home" replace /> },
            { path: "home", element: <HomePage /> },
            { path: "userpage", element: <UserPage /> },
            { path: "userpage/create", element: <CreateUserPage /> },
            { path: "userpage/list", element: <ListUserPage /> },
            { path: "returnable-material", element: <ReturnableMaterialPage /> },
            { path: "returnable-material/list", element: <ListReturnableMaterialPage /> },
            { path: "returnable-material/create", element: <CreateReturnableMaterialPage /> },
            { path: "brands", element: <BrandsPage /> },
            // { path: "brands/create", element: <CreateBrandPage /> },
            { path: "config/brands", element: <CreateBrandPage /> },
            { path: "config", element: <ConfigPage /> },
            { path: "config/groups", element: <GroupsListPage /> },
            { path: "config/groups/create", element: <CreateGroupPage /> },
            // { path: "*", element: <Navigate to="/dashboard/home" replace /> },
        ],
    },
    {
        path: "*",
        // element: <Navigate to="/dashboard/home" replace />,
    },
]);

export default router;