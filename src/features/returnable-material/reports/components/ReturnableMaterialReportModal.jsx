import { useState } from "react";
import { returnableMaterialReportFields } from "../config/returnableMaterialReportFields";
import { generateReturnableMaterialReport } from "../services/generateReturnableMaterialReport";
import { Button, Input, Select, Checkbox } from "@/shared";

export default function ReturnableMaterialReportModal({ isOpen, onClose, selectedRows }) {
  const [format, setFormat] = useState("pdf");
  const [scope, setScope] = useState("all");
  const [filterSerial, setFilterSerial] = useState("");
  const [filterState, setFilterState] = useState("");
  const [selectedFields, setSelectedFields] = useState(
    () => returnableMaterialReportFields.filter((f) => f.default)
  );

  if (!isOpen) return null;

  const handleFieldToggle = (field) => {
    const exists = selectedFields.find((f) => f.key === field.key);
    if (exists) {
      setSelectedFields(selectedFields.filter((f) => f.key !== field.key));
    } else {
      setSelectedFields([...selectedFields, field]);
    }
  };

  const handleGenerate = () => {
    generateReturnableMaterialReport({
      format,
      selectedFields,
      scope,
      filterSerial,
      filterState,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-6 text-xl font-semibold">Generar reporte de material devolutivo</h2>

        <div className="mb-4">
          <Select
            label="Formato del reporte"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            options={[
              { label: "PDF", value: "pdf" },
              { label: "Excel", value: "excel" },
            ]}
          />
        </div>

        <div className="mb-4">
          <p className="mb-2 font-medium">Campos del reporte</p>
          <div className="grid grid-cols-2 gap-2">
            {returnableMaterialReportFields.map((field) => {
              const checked = selectedFields.some((f) => f.key === field.key);
              return (
                <Checkbox
                  key={field.key}
                  id={field.key}
                  name={field.key}
                  label={field.label}
                  checked={checked}
                  onChange={() => handleFieldToggle(field)}
                />
              );
            })}
          </div>
        </div>

        <div className="mb-4">
          <Select
            label="Alcance del reporte"
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            options={[
              { label: "Todos los materiales", value: "all" },
              { label: "Filtrar por serial", value: "serial" },
              { label: "Filtrar por estado", value: "state" },
            ]}
          />
        </div>

        {scope === "serial" && (
          <div className="mb-4">
            <Input
              label="Número de serial"
              value={filterSerial}
              onChange={(e) => setFilterSerial(e.target.value)}
              placeholder="Ingrese el serial"
            />
          </div>
        )}

        {scope === "state" && (
          <div className="mb-4">
            <Select
              label="Estado"
              value={filterState}
              onChange={(e) => setFilterState(e.target.value)}
              options={[
                { label: "Disponible", value: "Disponible" },
                { label: "No Disponible", value: "No Disponible" },
                { label: "Prestamo", value: "Prestamo" },
                { label: "Baja", value: "Baja" },
                { label: "Traslado", value: "Traslado" },
                { label: "Mantenimiento", value: "Mantenimiento" },
              ]}
            />
          </div>
        )}

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleGenerate}>
            Generar reporte
          </Button>
        </div>
      </div>
    </div>
  );
}
