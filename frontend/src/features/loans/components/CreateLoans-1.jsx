import { InputForList, DataTable, Button } from "@/shared";
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
        <InputForList
          label="Placa Sena"
          type="search"
          value={filters.materialPlate}
          onChange={(e) => setFilters((f) => ({ ...f, materialPlate: e.target.value }))}
          placeholder="Ingrese la placa SENA"
        />
        <InputForList
          label="Serial"
          type="search"
          value={filters.materialSerial}
          onChange={(e) => setFilters((f) => ({ ...f, materialSerial: e.target.value }))}
          placeholder="Ingrese el serial"
        />
        <InputForList
          label="Nombre del material"
          type="search"
          value={filters.elementName}
          onChange={(e) => setFilters((f) => ({ ...f, elementName: e.target.value }))}
          placeholder="Buscar material"
        />

        {/* SELECT TIPO */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-black">
            Tipo de Material
          </label>
          <select
            value={filters.materialsTypes}
            onChange={(e) => setFilters((f) => ({ ...f, materialsTypes: e.target.value }))}
            className="
              w-full h-[56px]
              rounded-md
              border border-black/20
              px-3 text-sm text-black
              bg-[rgba(217,217,217,0.54)]
              outline-none
              backdrop-blur-sm
            "
          >
            <option value="">Selecciona el tipo de material</option>
            {materialsTypes.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </div>
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
