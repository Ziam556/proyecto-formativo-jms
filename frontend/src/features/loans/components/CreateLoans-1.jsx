import { Input, DataTable, Button, Select } from "@/shared";
import { useState, useMemo } from "react";
import materialsTypes from "../../../../data/selects/materialsTypes.json";
import { Loans } from "../data/Loans.js";
import { loansColumns } from "../table/loansColumns.js";
import { ScanSearch, Info } from "lucide-react";

export default function CreateLoans1({ formData, onNext }) {
  const [filters, setFilters] = useState({
    materialPlate: "",
    materialSerial: "",
    elementName: "",
    materialsTypes: "",
  });

  const [rowSelection, setRowSelection] = useState({});

  const filtered = useMemo(() => {
    return Loans.filter((item) => {
      if (filters.elementName && !item.material.toLowerCase().includes(filters.elementName.toLowerCase())) return false;
      if (filters.materialsTypes && item.materialtype !== filters.materialsTypes) return false;
      return true;
    });
  }, [filters]);

  return (
    <>
      {/* HEADER */}
      <div className="flex items-center gap-2 mb-1">
        <ScanSearch size={24} className="text-black" />
        <h2 className="text-black font-bold text-lg">
          Búsqueda y selección de materiales
        </h2>
      </div>
      <p className="text-black/70 text-sm mb-6">
        Filtre los materiales y seleccione los que serán prestados
      </p>

      {/* FILTROS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Input
          label="Placa Sena"
          type="search"
          value={filters.materialPlate}
          onChange={(e) => setFilters((f) => ({ ...f, materialPlate: e.target.value }))}
          placeholder="Ingrese la placa SENA"
        />
        <Input
          label="Serial"
          type="search"
          value={filters.materialSerial}
          onChange={(e) => setFilters((f) => ({ ...f, materialSerial: e.target.value }))}
          placeholder="Ingrese el serial"
        />
        <Input
          label="Nombre del material"
          type="search"
          value={filters.elementName}
          onChange={(e) => setFilters((f) => ({ ...f, elementName: e.target.value }))}
          placeholder="Buscar material"
        />

        <Select
          label="Tipo de Material"
          name="materialsTypes"
          value={filters.materialsTypes}
          options={materialsTypes}
          onChange={(e) => setFilters((f) => ({ ...f, materialsTypes: e.target.value }))}
          placeholder="Selecciona el tipo de material"
        />
      </div>

      {/* TABLA */}
      <DataTable
        data={filtered}
        columns={loansColumns}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        initialPageSize={5}
      />

      {/* INFO */}
      <div className="
        flex items-center gap-2
        bg-cyan-900/30 rounded-lg
        px-4 py-3 mt-4 mb-6
        text-cyan-200 text-sm
      ">
        <Info size={15} />
        Seleccione uno o más materiales. La cantidad solo aplica para materiales de consumo.
      </div>

      {/* BOTÓN */}
      <div className="flex justify-end">
        <Button
          variant="primary"
          size="md"
          className="!min-w-0 px-12"
          onClick={() => onNext({ rowSelection })}
        >
          Siguiente
        </Button>
      </div>
    </>
  );
}
