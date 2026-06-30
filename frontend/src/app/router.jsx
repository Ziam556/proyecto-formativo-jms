import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthLayout, DashboardLayout, ProtectedRoute, AdminRoute } from "@/shared";
import { Login } from "@/features/auth";
import { UserPage, CreateUserPage, ListUserPage, ViewUserPage, EditUserPage, UserProfilePage } from "@/features/users";
import { HomePage } from "@/features/home";
import { ConfigPage } from "@/features/config";
import { GroupsListPage, CreateGroupPage, EditGroupPage, AddUsersToGroupPage } from "@/features/groups";
import { ReturnableMaterialPage, ListReturnableMaterialPage, CreateReturnableMaterialPage, EditReturnableMaterialPage, ViewReturnableMaterialPage } from "@/features/returnable-material";
import { ConsumableMaterialPage, ListConsumableMaterialPage, CreateConsumableMaterialPage, ViewConsumableMaterialPage, EditConsumableMaterialPage } from "@/features/consumable-material";
import { BrandsPage, CreateBrandPage } from "@/features/brands";
import { ListPermissionsPage, CreatePermissionPage, EditPermissionPage } from "@/features/permissions";
import { LoansPage, CreateLoansPage, ListWeLendAssetsPage, ViewLoansPage, EditLoansPage, ReturnLoansPage } from "@/features/loans";
import { TasksPage, MisTareasPage } from "@/features/tasks";

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
        element: (
            <ProtectedRoute>
                <DashboardLayout />
            </ProtectedRoute>
        ),
        children: [
            { index: true, element: <Navigate to="/dashboard/home" replace /> },
            { path: "home", element: <HomePage /> },
            { path: "userpage", element: <UserPage /> },
            { path: "userpage/create", element: <CreateUserPage /> },
            { path: "userpage/list", element: <ListUserPage /> },
            { path: "userpage/:id/view", element: <ViewUserPage /> },
            { path: "userpage/edit", element: <EditUserPage /> },
            { path: "userpage/profile", element: <UserProfilePage /> },
            { path: "returnable-material", element: <ReturnableMaterialPage /> },
            { path: "returnable-material/list", element: <ListReturnableMaterialPage /> },
            { path: "returnable-material/create", element: <CreateReturnableMaterialPage /> },
            { path: "returnable-material/edit", element: <EditReturnableMaterialPage /> },
            { path: "returnable-material/visualize", element: <ViewReturnableMaterialPage /> },
            { path: "consumable-material", element: <ConsumableMaterialPage /> },
            { path: "consumable-material/create", element: <CreateConsumableMaterialPage /> },
            { path: "consumable-material/list", element: <ListConsumableMaterialPage /> },
            { path: "consumable-material/visualize", element: <ViewConsumableMaterialPage /> },
            { path: "consumable-material/edit", element: <EditConsumableMaterialPage /> },
            { path: "loans", element: <LoansPage /> },
            { path: "loans/create", element: <CreateLoansPage /> },
            { path: "loans/list", element: <ListWeLendAssetsPage /> },
            { path: "loans/visualize", element: <ViewLoansPage /> },
            { path: "loans/edit", element: <EditLoansPage /> },
            { path: "loans/return", element: <ReturnLoansPage /> },
            { path: "brands", element: <BrandsPage /> },
            { path: "config/brands", element: <CreateBrandPage /> },
            { path: "config", element: <ConfigPage /> },
            { path: "config/groups", element: <GroupsListPage /> },
            { path: "config/groups/create", element: <CreateGroupPage /> },
            { path: "config/groups/edit/:id", element: <EditGroupPage /> },
            { path: "config/groups/:id/add-users", element: <AddUsersToGroupPage /> },
            { path: "config/tasks", element: <TasksPage /> },
            { path: "mis-tareas", element: <MisTareasPage /> },
            {
                path: "config/permissions",
                element: <AdminRoute />,
                children: [
                    { index: true, element: <ListPermissionsPage /> },
                    { path: "create", element: <CreatePermissionPage /> },
                    { path: "edit/:id", element: <EditPermissionPage /> },
                ],
            },
        ],
    },
]);

export default router;
