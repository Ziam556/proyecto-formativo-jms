import { useState, useMemo } from "react";

import { SlidersHorizontal } from "lucide-react";

import { Loans } from "../data/Loans.js";

console.log(consumableMaterials.length);

import {
  DataTable,
  StatsPills,
  ReportDropdown,
  BackButton,
  Input,
  Select,
} from "@/shared";

import { LoansColumns } from "../table/loansColumns.js";

const STATE_DOT = {
  Disponible: "#16a34a",
  "No Disponible": "#d97706",
  Prestamo: "#2563eb",
  Baja: "#ef4444",
  Traslado: "#9333ea",
  Mantenimiento: "#6b7280",
};

export default function ListLoansPage() {

  const [filters, setFilters] = useState({
    elementName: "",
    accountHolder: "",
    state: "",
    serial: "",
  });

  const [rowSelection, setRowSelection] =
    useState({});

  const filtered = useMemo(() => {
    return consumableMaterials.filter(
      (item) => {

        if (
          filters.elementName &&
          !item.elementName
            ?.toLowerCase()
            .includes(
              filters.elementName.toLowerCase()
            )
        )
          return false;

        if (
          filters.accountHolder &&
          !item.accountHolder
            ?.toLowerCase()
            .includes(
              filters.accountHolder.toLowerCase()
            )
        )
          return false;

        if (
          filters.state &&
          item.state !== filters.state
        )
          return false;

        if (
          filters.serial &&
          !String(item.serial).includes(
            filters.serial
          )
        )
          return false;

        return true;
      }
    );
  }, [filters]);

  const statsPills = useMemo(() => {

    const pills = [
      {
        label: "Total",
        count: consumableMaterials.length,
        color: "#e2e8f0",
      },
    ];

    Object.entries(STATE_DOT).forEach(
      ([state, color]) => {

        pills.push({
          label: state,
          count:
            consumableMaterials.filter(
              (r) => r.state === state
            ).length,
          color,
        });
      }
    );

    return pills;

  }, []);

  const uniqueStates = useMemo(
    () => [
      ...new Set(
        consumableMaterials.map(
          (r) => r.state
        )
      ),
    ],
    []
  );

  const clearFilters = () => {

    setFilters({
      elementName: "",
      accountHolder: "",
      state: "",
      serial: "",
    });
  };

  const generateSelectedReport = (
    format
  ) => {

    const selectedIds = Object.keys(
      rowSelection
    )
      .filter((idx) => rowSelection[idx])

      .map(
        (idx) =>
          filtered[Number(idx)]?.id
      )

      .filter(Boolean);

    if (selectedIds.length === 0) {

      alert(
        "Seleccione al menos un material."
      );

      return;
    }

    generateConsumableMaterialReport({
      format,
      selectedFields:
        consumableMaterialReportFields,
      scope: "selected",
      selectedIds,
    });
  };

  return (
    <div className="min-h-[calc(100vh-64px)] px-6 py-4">

      {/* TITULO */}
      <div className="flex items-center gap-3 mb-4">

        <BackButton to="/dashboard/loans" />

        <h1 className="text-white text-[1.2rem] font-bold m-0">
          Lista materiales consumo
        </h1>
      </div>

      {/* PILLS */}
      <div className="mb-3">
        <StatsPills stats={statsPills} />
      </div>

      {/* FILTROS */}
      <div className="flex gap-[10px] items-end mb-3 flex-wrap">

        <div className="flex flex-col gap-1 w-full sm:w-[320px]">
          <label className="text-white text-[0.75rem] font-medium">Nombre del elemento</label>
          <Input
            name="elementName"
            value={filters.elementName}
            onChange={(e) => setFilters((f) => ({ ...f, elementName: e.target.value }))}
            placeholder="Buscar nombre elemento"
          />
        </div>

        <div className="flex flex-col gap-1 w-full sm:w-[320px]">
          <label className="text-white text-[0.75rem] font-medium">Cuentadante</label>
          <Input
            name="accountHolder"
            value={filters.accountHolder}
            onChange={(e) => setFilters((f) => ({ ...f, accountHolder: e.target.value }))}
            placeholder="Ingrese nombre del cuentadante"
          />
        </div>

        {/* SELECT */}
        <div className="flex flex-col gap-1 w-full sm:w-[320px]">
          <label className="text-white text-[0.75rem] font-medium">Estado</label>
          <Select
            name="state"
            value={filters.state}
            options={uniqueStates.map((s) => ({ id: s, label: s }))}
            onChange={(e) => setFilters((f) => ({ ...f, state: e.target.value }))}
            placeholder="Selecciona el estado"
          />
        </div>

        {/* BOTON */}
        <button
          onClick={clearFilters}
          className="
            h-[56px]
            px-5
            flex
            items-center
            justify-center
            gap-[6px]
            rounded
            bg-cyan-700
            border-none
            text-white
            text-[0.82rem]
            font-semibold
            cursor-pointer
            whitespace-nowrap
          "
        >

          <SlidersHorizontal size={15} />

          Limpiar Filtros
        </button>

        <ReportDropdown
          label="Generar reporte de todos los materiales consumos"
          color="#00304D"
          width={280}
          height={56}
          onPDF={() =>
            generateConsumableMaterialReport({
              format: "pdf",
              selectedFields:
                consumableMaterialReportFields,
              scope: "all",
            })
          }
          onExcel={() =>
            generateConsumableMaterialReport({
              format: "excel",
              selectedFields:
                consumableMaterialReportFields,
              scope: "all",
            })
          }
        />

        <ReportDropdown
          label="Generar reporte de material consumo seleccionado"
          color="#00304D"
          width={280}
          height={56}
          onPDF={() =>
            generateSelectedReport(
              "pdf"
            )
          }
          onExcel={() =>
            generateSelectedReport(
              "excel"
            )
          }
        />
      </div>

      {/* TABLA */}
      <DataTable
        data={filtered}
        columns={consumableMaterialColumns}
        rowSelection={rowSelection}
        onRowSelectionChange={
          setRowSelection
        }
      />
    </div>
  );
}