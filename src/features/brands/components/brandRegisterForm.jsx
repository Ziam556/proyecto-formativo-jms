import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { SearchField, InputForList, Button, BrandTable } from "@/shared";

const INITIAL_BRANDS = [
    "Apple", "Samsung", "HP", "Dell", "Lenovo", "Asus", "Acer", "Sony",
    "LG", "Huawei", "Xiaomi", "Toshiba", "Panasonic", "Microsoft", "Logitech", "Epson",
    "Canon", "Brother", "Kingston", "Seagate", "Western Digital", "Intel", "AMD", "Nvidia",
    "Corsair", "Razer", "SteelSeries", "HyperX", "Gigabyte", "MSI", "Belkin", "TP-Link",
    "Netgear", "Cisco", "D-Link", "Motorola", "Nokia", "Philips", "Bose", "JBL",
    "Sennheiser", "Plantronics", "Jabra", "APC", "Eaton", "3M", "Targus", "Kensington",
    "Datalogic", "Zebra", "Honeywell", "Godex", "ViewSonic", "BenQ", "NEC", "Sharp",
    "Ricoh", "Kyocera", "Xerox",
];

const PAGE_SIZE = 24;

export default function BrandRegisterForm() {
    const navigate = useNavigate();
    const [brands, setBrands]   = useState(INITIAL_BRANDS);
    const [newName, setNewName] = useState("");
    const [search, setSearch]   = useState("");
    const [page, setPage]       = useState(1);

    const handleAdd = () => {
        if (!newName.trim()) return;
        setBrands((prev) => [...prev, newName.trim()]);
        setNewName("");
    };

    const filtered = useMemo(() => {
        if (!search.trim()) return brands;
        return brands.filter((b) =>
            b.toLowerCase().includes(search.toLowerCase())
        );
    }, [brands, search]);

    const total      = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const safePage   = Math.min(page, totalPages);
    const from       = (safePage - 1) * PAGE_SIZE;
    const current    = filtered.slice(from, from + PAGE_SIZE);

    const col1 = current.slice(0, 8);
    const col2 = current.slice(8, 16);
    const col3 = current.slice(16, 24);

    const navButtons = [
        { label: "|◀", action: () => setPage(1),                disabled: safePage === 1 },
        { label: "◀",  action: () => setPage((p) => p - 1),     disabled: safePage === 1 },
        { label: "▶",  action: () => setPage((p) => p + 1),     disabled: safePage === totalPages },
        { label: "▶|", action: () => setPage(totalPages),       disabled: safePage === totalPages },
    ];

    return (
        <div className="mt-8 border border-white bg-app-gradient min-h-screen w-full rounded-4xl flex">

            {/* panel izquierdo */}
            <div className="p-8 border border-white bg-brand place-self-start min-h-screen rounded-4xl">
                <ArrowLeft
                    className="text-white size-7 cursor-pointer"
                    onClick={() => navigate(-1)}
                />
                <div className="mt-16 text-white">
                    <strong>Agregar marcas</strong>
                </div>
                <div className="mt-4 flex flex-col gap-4">
                    <InputForList
                        placeholder="Escribe el nombre de la marca"
                        label="Nombre de la marca"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                    <Button onClick={handleAdd}>
                        <strong>Guardar</strong>
                    </Button>
                </div>
            </div>

            {/* panel derecho */}
            <div className="flex flex-col p-8 gap-4 flex-1">

                {/* buscador */}
                <SearchField
                    placeholder="Nombre marcas"
                    value={search}
                    onChange={(val) => { setSearch(val); setPage(1); }}
                    fullWidth
                />

                {/* 3 tablas */}
                <div className="flex gap-4">
                    <BrandTable brands={col1} />
                    <BrandTable brands={col2} />
                    <BrandTable brands={col3} />
                </div>

                {/* paginación */}
                <div className="flex items-center justify-center gap-3 mt-2">

                    <span className="text-white text-sm">Page</span>

                    <select className="rounded px-2 py-1 text-sm bg-white cursor-pointer">
                        <option>24</option>
                        <option>50</option>
                    </select>

                    <div className="flex gap-1">
                        {navButtons.map(({ label, action, disabled }) => (
                            <button
                                key={label}
                                onClick={action}
                                disabled={disabled}
                                className={`px-2 py-1 rounded text-xs font-semibold transition-colors
                                    ${disabled
                                        ? "bg-white/20 text-white/40 cursor-not-allowed"
                                        : "bg-white/75 text-gray-700 cursor-pointer hover:bg-white"
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    <span className="text-white text-sm">
                        {total === 0 ? "0" : `${from + 1} – ${Math.min(from + PAGE_SIZE, total)}`} de {total}
                    </span>

                </div>
            </div>
        </div>
    );
}