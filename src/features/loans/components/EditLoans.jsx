import { Input } from "@/shared";
import { useEffect, useState, useMemo } from "react";
import { Loans } from "../data/Loans";
import { loansColumns } from "../table/loansColumns";
import { Button, BackButton, DataTable } from "@/shared";
import prestamo from "@/assets/images/prestamo.png";
import { getMaterialsTypes } from "../services/selectService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const STATE_CLASS = {
  Disponible: "bg-green-600",
  "No Disponible": "bg-yellow-600",
  Prestamo: "bg-blue-600",
  Baja: "bg-red-600",
  Traslado: "bg-purple-600",
  Mantenimiento: "bg-gray-500",
};

export default function EditLoans({ formData = {}, onSave, onCancel }) {

  const [filters] = useState({ elementName: "", materialsTypes: "" });
  const [rowSelection, setRowSelection] = useState({});

  const filtered = useMemo(() => {
    return Loans.filter((item) => {
      if (filters.elementName && !item.material.toLowerCase().includes(filters.elementName.toLowerCase())) return false;
      if (filters.materialsTypes && item.materialtype !== filters.materialsTypes) return false;
      return true;
    });
  }, [filters]);

  const [fields, setFields] = useState({
    loansId:         formData?.loansId        || "",
    fichaGrupo:      formData?.fichaGrupo     || "Ficha 2850123",
    cantidadConsumo: formData?.cantidadConsumo || "20",
    fechaSalida:     formData?.fechaSalida     ? new Date(formData.fechaSalida)  : new Date("2026-05-26"),
    fechaEntrega:    formData?.fechaEntrega    ? new Date(formData.fechaEntrega) : new Date("2026-05-30"),
    justificacion:   formData?.justificacion   || "Materiales requeridos para practica del modulo de mantenimiento preventivo en el laboratorio de sistemas",
    usuarioSolicita: formData?.usuarioSolicita || "@NameUser",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    getMaterialsTypes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleDateChange = (name, date) => {
    setFields((prev) => ({ ...prev, [name]: date }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSave = () => {
    const newErrors = {};

    if (!fields.loansId)         newErrors.loansId         = "El ID es requerido";
    if (!fields.fichaGrupo)      newErrors.fichaGrupo      = "La ficha es requerida";
    if (!fields.cantidadConsumo) newErrors.cantidadConsumo = "La cantidad es requerida";
    if (!fields.fechaSalida || !(fields.fechaSalida instanceof Date))
                                 newErrors.fechaSalida     = "La fecha de salida es requerida";
    if (!fields.usuarioSolicita) newErrors.usuarioSolicita = "El usuario es requerido";
    if (!fields.justificacion)   newErrors.justificacion   = "La justificación es requerida";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(fields);
  };

  return (
    <div className="ml-190 w-[1200px] rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md shadow-2xl p-4">
      <div className="bg-white/10 rounded-2xl border border-white/20 backdrop-blur-xl px-4 py-4">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <BackButton to="/dashboard/loans" />
          <h1 className="text-white text-2xl font-bold">Editar Préstamo</h1>
        </div>

        {/* ID + CARD MATERIAL */}
        <div className="flex items-end justify-between">

          <div className="w-[320px]">
            <Input
              label="ID Prestamo"
              name="loansId"
              placeholder="ID"
              value={fields.loansId}
              onChange={handleChange}
              error={errors.loansId}
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-purple-500">
                <img src={prestamo} alt="Herramienta" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-white text-xl font-bold">Destornillador</h2>
              <p className="text-white/70">Stanley STHT65</p>
              <div className={`mt-1 px-2 py-1 text-xs rounded-full text-white w-fit ${STATE_CLASS["Disponible"]}`}>
                Disponible
              </div>
            </div>
          </div>

        </div>

        <div className="mt-10 w-full h-px bg-white/20" />

        {/* MATERIALES */}
        <div className="flex items-center gap-3 mt-5">
          <span className="text-white font-semibold">MATERIALES A PRESTAR</span>
          <div className="flex-1 h-px bg-white/20" />
        </div>

        <div className="mt-5">
          <DataTable
            data={filtered}
            columns={loansColumns}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            initialPageSize={5}
          />
        </div>

        {/* DATOS DEL PRÉSTAMO */}
        <div className="flex items-center gap-3 mt-7">
          <span className="text-white font-semibold">DATOS DEL PRÉSTAMO</span>
          <div className="flex-1 h-px bg-white/20" />
        </div>

        <div className="mt-5 flex gap-6 flex-wrap">

          <div className="flex flex-col gap-1">
            <label className="text-white/70 text-xs">Ficha / Grupo Aprendices</label>
            <input
              name="fichaGrupo"
              value={fields.fichaGrupo}
              onChange={handleChange}
              className="w-[250px] h-[50px] bg-white/80 rounded-[8px] px-3 text-black text-sm outline-none focus:ring-2 focus:ring-purple-400"
            />
            {errors.fichaGrupo && <span className="text-red-400 text-xs">{errors.fichaGrupo}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-white/70 text-xs">Cantidad (Consumo)</label>
            <input
              name="cantidadConsumo"
              type="number"
              value={fields.cantidadConsumo}
              onChange={handleChange}
              className="w-[250px] h-[50px] bg-white/80 rounded-[8px] px-3 text-black text-sm outline-none focus:ring-2 focus:ring-purple-400"
            />
            {errors.cantidadConsumo && <span className="text-red-400 text-xs">{errors.cantidadConsumo}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-white/70 text-xs">Fecha Salida</label>
            <DatePicker
              selected={fields.fechaSalida}
              onChange={(date) => handleDateChange("fechaSalida", date)}
              placeholderText="Seleccione fecha"
              dateFormat="dd/MM/yyyy"
              className="w-[250px] h-[50px] bg-white/80 rounded-[8px] px-3 text-black text-sm outline-none focus:ring-2 focus:ring-purple-400"
            />
            {errors.fechaSalida && <span className="text-red-400 text-xs">{errors.fechaSalida}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-white/70 text-xs">Fecha Entrega (Devolutivo)</label>
            <DatePicker
              selected={fields.fechaEntrega}
              onChange={(date) => handleDateChange("fechaEntrega", date)}
              placeholderText="Seleccione fecha"
              dateFormat="dd/MM/yyyy"
              className="w-[250px] h-[50px] bg-white/80 rounded-[8px] px-3 text-black text-sm outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

        </div>

        <div className="mt-4 flex flex-col gap-1">
          <label className="text-white/70 text-xs">Justificación de uso</label>
          <textarea
            name="justificacion"
            value={fields.justificacion}
            onChange={handleChange}
            rows={3}
            className="w-full bg-white/80 rounded-[8px] px-3 py-2 text-black text-sm outline-none focus:ring-2 focus:ring-purple-400 resize-none"
          />
          {errors.justificacion && <span className="text-red-400 text-xs">{errors.justificacion}</span>}
        </div>

        {/* USUARIO */}
        <div className="flex items-center gap-3 mt-7">
          <span className="text-white font-semibold">USUARIO</span>
          <div className="flex-1 h-px bg-white/20" />
        </div>

        <div className="mt-5">
          <div className="flex flex-col gap-1">
            <label className="text-white/70 text-xs">Usuario solicitante</label>
            <input
              name="usuarioSolicita"
              value={fields.usuarioSolicita}
              onChange={handleChange}
              className="w-full h-[50px] bg-white/80 rounded-[8px] px-3 text-black text-sm outline-none focus:ring-2 focus:ring-purple-400"
            />
            {errors.usuarioSolicita && <span className="text-red-400 text-xs">{errors.usuarioSolicita}</span>}
          </div>
        </div>

        {/* BOTONES */}
        <div className="flex justify-end gap-4 mt-10">
          <Button variant="secondary" size="sm" onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant="primary" size="md" onClick={handleSave}>
            Guardar cambios
          </Button>
        </div>

      </div>
    </div>
  );
}