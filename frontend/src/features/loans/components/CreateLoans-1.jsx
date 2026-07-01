import { Input, DataTable, Button, Select } from "@/shared";
import { alertWarning } from "@/shared";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import materialsTypes from "../../../../data/selects/materialsTypes.json";
import { loansColumns } from "../table/loansColumns.js";
import { ScanSearch, Info } from "lucide-react";

export default function CreateLoans1({ materials = [], formData, onNext }) {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    materialPlate: "",
    materialSerial: "",
    elementName: "",
    materialsTypes: "",
  });

  const [rowSelection, setRowSelection] = useState(
    formData?.rowSelection ?? {}
  );

  const filtered = useMemo(() => {
    return materials.filter((item) => {
      if (
        filters.elementName &&
        !item.material.toLowerCase().includes(filters.elementName.toLowerCase())
      )
        return false;
      if (filters.materialsTypes && item.materialtype !== filters.materialsTypes)
        return false;
      if (
        filters.materialPlate &&
        !(item.plateSena ?? "")
          .toLowerCase()
          .includes(filters.materialPlate.toLowerCase())
      )
        return false;
      if (
        filters.materialSerial &&
        !(item.serial ?? "")
          .toLowerCase()
          .includes(filters.materialSerial.toLowerCase())
      )
        return false;
      return true;
    });
  }, [filters, materials]);

  const handleNext = async () => {
    const selected = Object.entries(rowSelection)
      .filter(([, v]) => v)
      .map(([idx]) => filtered[Number(idx)])
      .filter(Boolean);

    if (selected.length === 0) {
      await alertWarning(
        "Sin materiales",
        "Debes seleccionar al menos un material para continuar."
      );
      return;
    }

    onNext({ rowSelection, selectedMaterials: selected });
  };

  return (
    <>
      {/* HEADER */}
      <div className="flex items-center gap-2 mb-1">
        <ScanSearch size={24} className="text-white" />
        <h2 className="text-white font-bold text-lg">
          Búsqueda y selección de materiales
        </h2>
      </div>
      <p className="text-white/80 text-sm mb-6">
        Filtre los materiales y seleccione los que serán prestados
      </p>

      {/* FILTROS */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="w-full sm:w-[200px]">
          <Input
            label="Placa Sena"
            type="search"
            value={filters.materialPlate}
            onChange={(e) =>
              setFilters((f) => ({ ...f, materialPlate: e.target.value }))
            }
            placeholder="Placa SENA"
          />
        </div>
        <div className="w-full sm:w-[200px]">
          <Input
            label="Serial"
            type="search"
            value={filters.materialSerial}
            onChange={(e) =>
              setFilters((f) => ({ ...f, materialSerial: e.target.value }))
            }
            placeholder="Serial"
          />
        </div>
        <div className="w-full sm:w-[240px]">
          <Input
            label="Nombre del material"
            type="search"
            value={filters.elementName}
            onChange={(e) =>
              setFilters((f) => ({ ...f, elementName: e.target.value }))
            }
            placeholder="Buscar material"
          />
        </div>
        <div className="w-full sm:w-[200px]">
          <Select
            label="Tipo de Material"
            name="materialsTypes"
            value={filters.materialsTypes}
            options={materialsTypes}
            onChange={(e) =>
              setFilters((f) => ({ ...f, materialsTypes: e.target.value }))
            }
            placeholder="Selecciona el tipo"
          />
        </div>
      </div>

      {/* TABLA */}
      {materials.length === 0 ? (
        <p className="text-black/50 text-sm py-6 text-center">
          Cargando materiales…
        </p>
      ) : (
        <DataTable
          data={filtered}
          columns={loansColumns}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          initialPageSize={5}
        />
      )}

      {/* INFO */}
      <div className="flex items-center gap-2 bg-cyan-900/30 rounded-lg px-4 py-3 mt-4 mb-6 text-cyan-200 text-sm">
        <Info size={15} />
        Seleccione uno o más materiales. La cantidad solo aplica para materiales de consumo.
      </div>

      {/* BOTONES */}
      <div className="flex justify-end gap-4">
        <Button
          variant="secondary"
          size="md"
          className="!min-w-0 px-10"
          onClick={() => navigate("/dashboard/loans")}
        >
          Atrás
        </Button>
        <Button
          variant="primary"
          size="md"
          className="!min-w-0 px-10"
          onClick={handleNext}
        >
          Siguiente
        </Button>
      </div>
    </>
  );
}
