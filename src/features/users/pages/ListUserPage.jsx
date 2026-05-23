import DataTable from "@/shared/components/DataTable";
import { userColumns } from "../table/userColummns.jsx";
import { users } from "../data/users.js";
import { Link } from "react-router-dom";
import { Button } from "@/shared";
import { useState } from "react";

export default function ListUserPage() {
    return (
        <div className="p-6">
            <h1 className="text-xl font-semibold mb-4">Usuarios</h1>

            <div className="flex gap-6 mb-7">
                <Link to="/dashboard">
                    <Button variant="primary" size="md">
                        Crear Usuario
                    </Button>
                </Link>
            </div>

            <DataTable data={users} columns={userColumns} />
        </div>
    );
}
