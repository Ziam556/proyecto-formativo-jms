import { useEffect, useState, useMemo } from "react";
import { Input, Button, BackButton, DataTable, DatePicker, Textarea } from "@/shared";
import { loansColumns } from "../table/loansColumns";
import { getMaterialsForLoan } from "../services/loanService";

export default function EditLoans({ formData = {}, onSave, onCancel }) {

  const [materials, setMaterials] = useState([]);
  const [filters]                 = useState({ elementName: "", materialsTypes: "" });
  const [rowSelection, setRowSelection] = useState({});

  const [fields, setFields] = useState({
    loansId:         formData?.loansId         || "",
    fichaGrupo:      formData?.fichaGrupo      || "",
    cantidadConsumo: formData?.cantidadConsumo || "",
    fechaSalida:     formData?.fechaSalida     || "",
    fechaEntrega:    formData?.fechaEntrega    || "",
    justificacion:   formData?.justificacion   || "",
    usuarioSolicita: formData?.usuarioSolicita || "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    getMaterialsForLoan()
      .then(setMaterials)
      .catch(console.error);
  }, []);

  const filtered = useMemo(() => {
    return materials.filter((item) => {
      if (
        filters.elementName &&
        !item.material.toLowerCase().includes(filters.elementName.toLowerCase())
      )
        return false;
      if (filters.materialsTypes && item.materialtype !== filters.materialsTypes)
        return false;
      return true;
    });
  }, [filters, materials]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSave = () => {
    const newErrors = {};
    if (!fields.loansId)         newErrors.loansId         = "El ID es requerido";
    if (!fields.fichaGrupo)      newErrors.fichaGrupo      = "La ficha es requerida";
    if (!fields.fechaSalida)     newErrors.fechaSalida     = "La fecha de salida es requerida";
    if (!fields.usuarioSolicita) newErrors.usuarioSolicita = "El usuario es requerido";
    if (!fields.justificacion)   newErrors.justificacion   = "La justificación es requerida";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(fields);
  };

  return (
    <div className="w-full max-w-[1100px] mx-auto rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md shadow-2xl p-4">
      <div className="bg-white/10 rounded-2xl border border-white/20 backdrop-blur-xl px-4 py-4">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <BackButton to="/dashboard/loans" />
          <h1 className="text-white text-2xl font-bold">Editar Préstamo</h1>
        </div>

        {/* ID */}
        <div className="w-full sm:w-[320px] mb-6">
          <Input
            label="ID Préstamo"
            name="loansId"
            placeholder="ID del préstamo"
            value={fields.loansId}
            onChange={handleChange}
            error={errors.loansId}
          />
        </div>

        <div className="mt-4 w-full h-px bg-white/20" />

        {/* MATERIALES */}
        <div className="flex items-center gap-3 mt-5">
          <span className="text-white font-semibold">MATERIALES A PRESTAR</span>
          <div className="flex-1 h-px bg-white/20" />
        </div>

        <div className="mt-5">
          {materials.length === 0 ? (
            <p className="text-white/50 text-sm py-4">Cargando materiales…</p>
          ) : (
            <DataTable
              data={filtered}
              columns={loansColumns}
              rowSelection={rowSelection}
              onRowSelectionChange={setRowSelection}
              initialPageSize={5}
            />
          )}
        </div>

        {/* DATOS DEL PRÉSTAMO */}
        <div className="flex items-center gap-3 mt-7">
          <span className="text-white font-semibold">DATOS DEL PRÉSTAMO</span>
          <div className="flex-1 h-px bg-white/20" />
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">

          <Input
            label="Ficha / Grupo Aprendices *"
            name="fichaGrupo"
            value={fields.fichaGrupo}
            onChange={handleChange}
            error={errors.fichaGrupo}
          />

          <Input
            label="Cantidad (Consumo)"
            name="cantidadConsumo"
            type="number"
            value={fields.cantidadConsumo}
            onChange={handleChange}
            error={errors.cantidadConsumo}
          />

          <DatePicker
            label="Fecha Salida *"
            name="fechaSalida"
            value={fields.fechaSalida}
            onChange={handleChange}
            error={errors.fechaSalida}
          />

          <DatePicker
            label="Fecha Entrega (Devolutivo)"
            name="fechaEntrega"
            value={fields.fechaEntrega}
            onChange={handleChange}
          />

        </div>

        <div className="mt-4">
          <Textarea
            label="Justificación de uso *"
            name="justificacion"
            value={fields.justificacion}
            onChange={handleChange}
            rows={3}
            error={errors.justificacion}
          />
        </div>

        {/* USUARIO */}
        <div className="flex items-center gap-3 mt-7">
          <span className="text-white font-semibold">USUARIO</span>
          <div className="flex-1 h-px bg-white/20" />
        </div>

        <div className="mt-5">
          <Input
            label="Usuario solicitante *"
            name="usuarioSolicita"
            value={fields.usuarioSolicita}
            onChange={handleChange}
            error={errors.usuarioSolicita}
          />
        </div>

        {/* BOTONES */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-10">
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
