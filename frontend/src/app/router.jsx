import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthLayout, DashboardLayout, ProtectedRoute, PermissionRoute } from "@/shared";
import { Login, ForgotPasswordPage, ForceChangePasswordPage } from "@/features/auth";
import { UserPage, CreateUserPage, ListUserPage, ViewUserPage, EditUserPage, UserProfilePage } from "@/features/users";
import { HomePage } from "@/features/home";
import { ConfigPage } from "@/features/config";
import { GroupsListPage, CreateGroupPage, EditGroupPage, AddUsersToGroupPage } from "@/features/groups";
import { ReturnableMaterialPage, ListReturnableMaterialPage, CreateReturnableMaterialPage, EditReturnableMaterialPage, ViewReturnableMaterialPage } from "@/features/returnable-material";
import { ConsumableMaterialPage, ListConsumableMaterialPage, CreateConsumableMaterialPage, ViewConsumableMaterialPage, EditConsumableMaterialPage } from "@/features/consumable-material";
import { BrandsPage, CreateBrandPage } from "@/features/brands";
import { CategoriesPage, CreateCategoryPage } from "@/features/categories";
import { InventoriesPage, CreateInventoryPage } from "@/features/inventories";
import { LoansPage, CreateLoansPage, ListWeLendAssetsPage, ViewLoansPage, EditLoansPage, ReturnLoansPage } from "@/features/loans";
import { TasksPage, MisTareasPage } from "@/features/tasks";
import { QuotationsPage } from "@/features/quotations";

// Helpers de rutas protegidas:
// p(codename)  → requiere permiso específico del JWT (Administrador siempre pasa)
// adm(element) → exclusivo para Administrador, sin importar permisos asignados
const p   = (permission, element) => <PermissionRoute permission={permission}>{element}</PermissionRoute>;
const adm = (element)             => <PermissionRoute adminOnly>{element}</PermissionRoute>;

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
            { path: "change-password", element: <ForceChangePasswordPage /> },
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
            { path: "quotations",        element: <QuotationsPage /> },

            // ── Gestión de usuarios ───────────────────────────────────────────
            { path: "userpage",             element: p(["list_user","create_user","edit_user","toggle_user","report_user"], <UserPage />) },
            { path: "userpage/create",      element: p("create_user",  <CreateUserPage />) },
            { path: "userpage/list",        element: p("list_user",    <ListUserPage />) },
            { path: "userpage/:id/view",    element: p("list_user",    <ViewUserPage />) },
            { path: "userpage/edit",        element: p("edit_user",    <EditUserPage />) },

            // ── Material devolutivo ───────────────────────────────────────────
            { path: "returnable-material",           element: p(["list_returnable","create_returnable","edit_returnable","view_returnable","toggle_returnable","report_returnable","return_returnable"], <ReturnableMaterialPage />) },
            { path: "returnable-material/list",      element: p("list_returnable",   <ListReturnableMaterialPage />) },
            { path: "returnable-material/create",    element: p("create_returnable", <CreateReturnableMaterialPage />) },
            { path: "returnable-material/edit",      element: p("edit_returnable",   <EditReturnableMaterialPage />) },
            { path: "returnable-material/visualize", element: p("view_returnable",   <ViewReturnableMaterialPage />) },

            // ── Material consumible ───────────────────────────────────────────
            { path: "consumable-material",           element: p(["list_consumable","create_consumable","edit_consumable","view_consumable","toggle_consumable","report_consumable","return_consumable"], <ConsumableMaterialPage />) },
            { path: "consumable-material/create",    element: p("create_consumable", <CreateConsumableMaterialPage />) },
            { path: "consumable-material/list",      element: p("list_consumable",   <ListConsumableMaterialPage />) },
            { path: "consumable-material/visualize", element: p("view_consumable",   <ViewConsumableMaterialPage />) },
            { path: "consumable-material/edit",      element: p("edit_consumable",   <EditConsumableMaterialPage />) },

            // ── Préstamos ─────────────────────────────────────────────────────
            { path: "loans",            element: p(["list_loan","create_loan","edit_loan","view_loan","report_loan","return_returnable"], <LoansPage />) },
            { path: "loans/create",     element: p("create_loan",       <CreateLoansPage />) },
            { path: "loans/list",       element: p("list_loan",         <ListWeLendAssetsPage />) },
            { path: "loans/visualize",  element: p("view_loan",         <ViewLoansPage />) },
            { path: "loans/edit",       element: p("edit_loan",         <EditLoansPage />) },
            { path: "loans/return",     element: p("return_returnable", <ReturnLoansPage />) },

            // ── Configuración ─────────────────────────────────────────────────
            // Marcas: accesible con permiso de marcas (o admin)
            { path: "brands",        element: p(["list_brand","create_brand","edit_brand","toggle_brand","delete_brand"], <BrandsPage />) },
            { path: "config/brands", element: p(["list_brand","create_brand","edit_brand","toggle_brand","delete_brand"], <CreateBrandPage />) },
            // Categorías: admin
            { path: "categories",          element: adm(<CategoriesPage />) },
            { path: "config/categories",   element: adm(<CreateCategoryPage />) },
            // Inventarios: admin
            { path: "inventories",         element: adm(<InventoriesPage />) },
            { path: "config/inventories",  element: adm(<CreateInventoryPage />) },
            // Hub de configuración: admin O permisos de marcas
            { path: "config", element: p(["list_brand","create_brand","edit_brand","toggle_brand","delete_brand"], <ConfigPage />) },
            // Solo Administrador
            { path: "config/groups",                element: adm(<GroupsListPage />) },
            { path: "config/groups/create",         element: adm(<CreateGroupPage />) },
            { path: "config/groups/edit/:id",       element: adm(<EditGroupPage />) },
            { path: "config/groups/:id/add-users",  element: adm(<AddUsersToGroupPage />) },
            { path: "config/tasks",                 element: adm(<TasksPage />) },
        ],
    },
]);

export default router;
