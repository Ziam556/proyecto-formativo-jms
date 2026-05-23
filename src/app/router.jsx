import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthLayout, DashboardLayout } from "@/shared";
import { Login } from "@/features/auth";
import { CreateUserPage, ListUserPage } from "@/features/users";
import { HomePage } from "@/features/home";
import { ConfigPage } from "@/features/config";
import { GroupsListPage, CreateGroupPage } from "@/features/groups";
import { ReturnableMaterialPage, ListReturnableMaterialPage, CreateReturnableMaterialPage } from "@/features/returnable-material";



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
            { path: "UserList", element: <ListUserPage /> },
            { path: "returnable-material", element: <ReturnableMaterialPage /> },
            { path: "returnable-material/list", element: <ListReturnableMaterialPage /> },
            { path: "returnable-material/create", element: <CreateReturnableMaterialPage /> },
            { path: "config", element: <ConfigPage /> },
            { path: "config/groups", element: <GroupsListPage /> },
            { path: "config/groups/create", element: <CreateGroupPage /> },
        ],
    },
]);

export default router;