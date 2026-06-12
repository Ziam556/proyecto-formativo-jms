// Hook para manejo de estado local en componentes funcionales
import { useState } from "react";

// Configuración de campos disponibles para el reporte
import { loansReportFields } from "../config/loansReportFields";

// Caso de uso que orquesta la generación del reporte
import { generateLoansReport } from "../services/generateLoansReport";

// Componentes UI reutilizables
import { Button, Input, Select, CheckBox } from "@/shared";

// Modal reporte préstamos
export default function LoansReportModal({
  isOpen,
  onClose,
  selectedIds = [],
}) {

  // =========================
  // ESTADOS
  // =========================

  const [format, setFormat] = useState("pdf");

  const [scope, setScope] = useState("all");

  const [filterSerial, setFilterSerial] = useState("");

  const [filterState, setFilterState] = useState("");

  const [selectedFields, setSelectedFields] = useState(
    () =>
      loansReportFields.filter(
        (f) => f.default
      )
  );

  // =========================
  // NO RENDER
  // =========================

  if (!isOpen) return null;

  // =========================
  // ACTIVAR / DESACTIVAR
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

    if (
      scope === "selected" &&
      selectedIds.length === 0
    ) {
      alert("Debe seleccionar al menos un préstamo.");
      return;
    }

    generateLoansReport({
      format,
      selectedFields,
      scope,
      filterSerial,
      filterState,
      selectedIds,
    });

    setTimeout(() => {
      onClose();
    }, 800);
  };

  // =========================
  // RENDER
  // =========================

  return (

    <div className="
      fixed
      inset-0
      z-50
      flex
      items-center
      justify-center
      bg-black/50
      backdrop-blur-sm
      px-4
    ">

      {/* MODAL */}
      <div className="
        w-full
        max-w-2xl
        rounded-2xl
        border
        border-white/20
        bg-white
        shadow-2xl
        p-7
      ">

        {/* HEADER */}
        <div className="mb-6">

          <h2 className="
            text-2xl
            font-bold
            text-slate-800
          ">
            Generar reporte de préstamos
          </h2>

          <p className="
            text-sm
            text-slate-500
            mt-1
          ">
            Configure el formato, alcance y campos del reporte
          </p>

        </div>

        {/* FORMATO */}
        <div className="mb-5">

          <Select
            label="Formato del reporte"
            value={format}
            onChange={(e) =>
              setFormat(e.target.value)
            }
            options={[
              {
                label: "PDF",
                value: "pdf",
              },
              {
                label: "Excel",
                value: "excel",
              },
            ]}
          />

        </div>

        {/* CAMPOS */}
        <div className="
          mb-5
          rounded-xl
          border
          border-slate-200
          p-4
          bg-slate-50
        ">

          <p className="
            mb-4
            font-semibold
            text-slate-700
          ">
            Campos del reporte
          </p>

          <div className="
            grid
            grid-cols-2
            gap-3
          ">

            {loansReportFields.map((field) => {

              const checked = selectedFields.some(
                (f) => f.key === field.key
              );

              return (

                <div
                  key={field.key}
                  className="
                    rounded-lg
                    bg-white
                    border
                    border-slate-200
                    px-3
                    py-2
                  "
                >

                  <CheckBox
                    id={field.key}
                    name={field.key}
                    label={field.label}
                    checked={checked}
                    onChange={() =>
                      handleFieldToggle(field)
                    }
                  />

                </div>
              );
            })}

          </div>

        </div>

        {/* ALCANCE */}
        <div className="mb-5">

          <Select
            label="Alcance del reporte"
            value={scope}
            onChange={(e) =>
              setScope(e.target.value)
            }
            options={[
              {
                label: "Todos los préstamos",
                value: "all",
              },
              {
                label: "Préstamo seleccionado",
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

        {/* FILTRO SERIAL */}
        {scope === "serial" && (

          <div className="mb-5">

            <Input
              label="Número serial"
              value={filterSerial}
              onChange={(e) =>
                setFilterSerial(
                  e.target.value
                )
              }
              placeholder="Ingrese serial"
            />

          </div>

        )}

        {/* FILTRO ESTADO */}
        {scope === "state" && (

          <div className="mb-5">

            <Select
              label="Estado"
              value={filterState}
              onChange={(e) =>
                setFilterState(
                  e.target.value
                )
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

        {/* BOTONES */}
        <div className="
          mt-8
          flex
          justify-end
          gap-3
        ">

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