import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthLayout, DashboardLayout, ProtectedRoute, RoleRoute } from "@/shared";
import { Login, ForgotPasswordPage } from "@/features/auth";
import { UserPage, CreateUserPage, ListUserPage, ViewUserPage, EditUserPage, UserProfilePage } from "@/features/users";
import { HomePage } from "@/features/home";
import { ConfigPage } from "@/features/config";
import { GroupsListPage, CreateGroupPage, EditGroupPage, AddUsersToGroupPage } from "@/features/groups";
import { ReturnableMaterialPage, ListReturnableMaterialPage, CreateReturnableMaterialPage, EditReturnableMaterialPage, ViewReturnableMaterialPage } from "@/features/returnable-material";
import { ConsumableMaterialPage, ListConsumableMaterialPage, CreateConsumableMaterialPage, ViewConsumableMaterialPage, EditConsumableMaterialPage } from "@/features/consumable-material";
import { BrandsPage, CreateBrandPage } from "@/features/brands";
import { LoansPage, CreateLoansPage, ListWeLendAssetsPage, ViewLoansPage, EditLoansPage, ReturnLoansPage } from "@/features/loans";
import { TasksPage, MisTareasPage } from "@/features/tasks";

// Permisos por módulo:
// Admin  → todo
// Inst   → material devolutivo/consumible + préstamos (crear, editar, ver)
// Inv    → solo visualización (list + visualize)

const ADMIN_ONLY  = ["Admin"];
const STAFF       = ["Admin", "Inst"];       // Admin + Instructor
const ALL_USERS   = ["Admin", "Inst", "Inv"]; // todos los roles

const r = (roles, element) => <RoleRoute roles={roles}>{element}</RoleRoute>;

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
            { path: "forgot-password", element: <ForgotPasswordPage /> },
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
            { path: "home",              element: <HomePage /> },
            { path: "userpage/profile",  element: <UserProfilePage /> },
            { path: "mis-tareas",        element: <MisTareasPage /> },

            // ── Gestión de usuarios (solo Admin) ─────────────────────────────
            { path: "userpage",             element: r(ADMIN_ONLY, <UserPage />) },
            { path: "userpage/create",      element: r(ADMIN_ONLY, <CreateUserPage />) },
            { path: "userpage/list",        element: r(ADMIN_ONLY, <ListUserPage />) },
            { path: "userpage/:id/view",    element: r(ADMIN_ONLY, <ViewUserPage />) },
            { path: "userpage/edit",        element: r(ADMIN_ONLY, <EditUserPage />) },

            // ── Material devolutivo ───────────────────────────────────────────
            { path: "returnable-material",          element: r(STAFF,     <ReturnableMaterialPage />) },
            { path: "returnable-material/list",     element: r(ALL_USERS, <ListReturnableMaterialPage />) },
            { path: "returnable-material/create",   element: r(STAFF,     <CreateReturnableMaterialPage />) },
            { path: "returnable-material/edit",     element: r(STAFF,     <EditReturnableMaterialPage />) },
            { path: "returnable-material/visualize",element: r(ALL_USERS, <ViewReturnableMaterialPage />) },

            // ── Material consumible ───────────────────────────────────────────
            { path: "consumable-material",          element: r(STAFF,     <ConsumableMaterialPage />) },
            { path: "consumable-material/create",   element: r(STAFF,     <CreateConsumableMaterialPage />) },
            { path: "consumable-material/list",     element: r(ALL_USERS, <ListConsumableMaterialPage />) },
            { path: "consumable-material/visualize",element: r(ALL_USERS, <ViewConsumableMaterialPage />) },
            { path: "consumable-material/edit",     element: r(STAFF,     <EditConsumableMaterialPage />) },

            // ── Préstamos ─────────────────────────────────────────────────────
            { path: "loans",            element: r(STAFF,     <LoansPage />) },
            { path: "loans/create",     element: r(STAFF,     <CreateLoansPage />) },
            { path: "loans/list",       element: r(ALL_USERS, <ListWeLendAssetsPage />) },
            { path: "loans/visualize",  element: r(ALL_USERS, <ViewLoansPage />) },
            { path: "loans/edit",       element: r(STAFF,     <EditLoansPage />) },
            { path: "loans/return",     element: r(STAFF,     <ReturnLoansPage />) },

            // ── Configuración (solo Admin) ────────────────────────────────────
            { path: "brands",                        element: r(ADMIN_ONLY, <BrandsPage />) },
            { path: "config/brands",                 element: r(ADMIN_ONLY, <CreateBrandPage />) },
            { path: "config",                        element: r(ADMIN_ONLY, <ConfigPage />) },
            { path: "config/groups",                 element: r(ADMIN_ONLY, <GroupsListPage />) },
            { path: "config/groups/create",          element: r(ADMIN_ONLY, <CreateGroupPage />) },
            { path: "config/groups/edit/:id",        element: r(ADMIN_ONLY, <EditGroupPage />) },
            { path: "config/groups/:id/add-users",   element: r(ADMIN_ONLY, <AddUsersToGroupPage />) },
            { path: "config/tasks",                  element: r(ADMIN_ONLY, <TasksPage />) },
        ],
    },
]);

export default router;
