// Hook para manejo de estado local en componentes funcionales
import { useState } from "react";

// Configuración de campos disponibles para el reporte
import { consumableMaterialReportFields } from "../config/consumableMaterialReportFields";

// Caso de uso que orquesta la generación del reporte
import { generateConsumableMaterialReport } from "../services/generateConsumableMaterialReport";

// Componentes UI reutilizables
import { Button, Input, Select, CheckBox } from "@/shared";

// Componente modal para configuración de reportes
export default function ConsumableMaterialReportModal({
  isOpen,
  onClose,
  selectedIds = [],
}) {

  // =========================
  // ESTADOS
  // =========================

  // Estado formato de salida
  const [format, setFormat] = useState("pdf");

  // Estado alcance del reporte
  const [scope, setScope] = useState("all");

  // Estado filtro serial
  const [filterSerial, setFilterSerial] = useState("");

  // Estado filtro estado
  const [filterState, setFilterState] = useState("");

  // Estado campos seleccionados
  const [selectedFields, setSelectedFields] = useState(
    () =>
      consumableMaterialReportFields.filter(
        (f) => f.default
      )
  );

  // Si modal cerrado no renderiza
  if (!isOpen) return null;

  // =========================
  // ACTIVAR/DESACTIVAR CAMPOS
  // =========================
  const handleFieldToggle = (field) => {

    const exists = selectedFields.find(
      (f) => f.key === field.key
    );

    if (exists) {

      setSelectedFields(
        selectedFields.filter(
          (f) => f.key !== field.key
        )
      );

    } else {

      setSelectedFields([
        ...selectedFields,
        field,
      ]);
    }
  };

  // =========================
  // GENERAR REPORTE
  // =========================
  const handleGenerateReport = () => {

    // Validacion seleccionados
    if (
      scope === "selected" &&
      selectedIds.length === 0
    ) {
      alert("Debe seleccionar al menos un material.");
      return;
    }

    generateConsumableMaterialReport({
      format,
      selectedFields,
      scope,
      filterSerial,
      filterState,
      selectedIds,
    });

    // Cierre modal
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (

    // Overlay modal
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      {/* Contenedor modal */}
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-lg">

        {/* Titulo */}
        <h2 className="mb-6 text-xl font-semibold">
          Generar reporte de material consumo
        </h2>

        {/* Formato */}
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

        {/* Campos */}
        <div className="mb-4">

          <p className="mb-2 font-medium">
            Campos del reporte
          </p>

          <div className="grid grid-cols-2 gap-2">

            {consumableMaterialReportFields.map((field) => {

              const checked = selectedFields.some(
                (f) => f.key === field.key
              );

              return (
                <CheckBox
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

        {/* Alcance */}
        <div className="mb-4">
          <Select
            label="Alcance del reporte"
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            options={[
              {
                label: "Todos los materiales",
                value: "all",
              },
              {
                label: "Material seleccionado",
                value: "selected",
              },
              {
                label: "Filtrar por serial",
                value: "serial",
              },
              {
                label: "Filtrar por estado",
                value: "state",
              },
            ]}
          />
        </div>

        {/* Filtro serial */}
        {scope === "serial" && (
          <div className="mb-4">
            <Input
              label="Número serial"
              value={filterSerial}
              onChange={(e) =>
                setFilterSerial(e.target.value)
              }
              placeholder="Ingrese serial"
            />
          </div>
        )}

        {/* Filtro estado */}
        {scope === "state" && (
          <div className="mb-4">
            <Select
              label="Estado"
              value={filterState}
              onChange={(e) =>
                setFilterState(e.target.value)
              }
              options={[
                {
                  label: "Disponible",
                  value: "Disponible",
                },
                {
                  label: "No Disponible",
                  value: "No Disponible",
                },
                {
                  label: "Prestamo",
                  value: "Prestamo",
                },
                {
                  label: "Baja",
                  value: "Baja",
                },
                {
                  label: "Traslado",
                  value: "Traslado",
                },
              ]}
            />
          </div>
        )}

        {/* Acciones */}
        <div className="mt-6 flex justify-end gap-2">

          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancelar
          </Button>

          <Button
            variant="primary"
            onClick={handleGenerateReport}
          >
            Generar reporte
          </Button>

        </div>
      </div>
    </div>
  );
}