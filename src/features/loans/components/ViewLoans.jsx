import { Input } from "@/shared";
import { useEffect } from "react";
import { useState, useMemo } from "react";
import { Loans } from "../data/Loans";
import { loansColumns } from "../table/loansColumns";

import {
  Button,
  BackButton,
  DataTable
} from "@/shared";
import prestamo from "@/assets/images/prestamo.png";
import { getMaterialsTypes } from "../services/selectService";



const STATE_CLASS = {
  Disponible: "bg-green-600",
  "No Disponible": "bg-yellow-600",
  Prestamo: "bg-blue-600",
  Baja: "bg-red-600",
  Traslado: "bg-purple-600",
  Mantenimiento: "bg-gray-500",
};

export default function ViewLoans({
  formData = {},
  onNext,
  onCancel,
}) {

  const [filters, setFilters] = useState({
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

  const [materials, setMaterials] = useState([]);

  const [fields, setFields] = useState({
    loansId:
      formData?.loansId || "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    getMaterialsTypes().then(setMaterials);
  }, []);

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFields((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

  };

  const handleNext = () => {

    const newErrors = {};

    if (!fields.loansId) {
      newErrors.loansId =
        "El ID es requerido";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onNext(fields);

  };

  return (

    <div
      className="
        ml-190
        w-[1200px]
        rounded-2xl
        border
        border-white/10
        bg-white/10
        backdrop-blur-md
        shadow-2xl
        p-4
      "
    >
        <div className="
      border-white/20
      bg-white/10
      rounded-2xl
      border
      border-white/20
      bg-white/10
      backdrop-blur-xl
      px-4
      py-4
      "
      >

      <div className="flex items-center gap-3 mb-6">

        <BackButton to="/dashboard/loans" />

        <h1 className="text-white text-2xl font-bold">
          Visualizar Prestamo
        </h1>

      </div>

      <div className="flex items-end justify-between ">

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

              <img
                src={prestamo}
                alt="Herramienta"
                className="w-full h-full object-cover"
              />

            </div>

            <div
              className="
                absolute
                -bottom-1
                -right-1
                w-5
                h-5
                bg-green-500
                border-2
                border-white
                rounded-full
              "
            ></div>

          </div>

          <div className="flex flex-col">

            <h2 className="text-white text-xl font-bold">
              Destornillador
            </h2>

            <p className="text-white/70">
              Stanley STHT65
            </p>

            <div
              className={`
                mt-1
                px-2
                py-1
                text-xs
                rounded-full
                text-white
                w-fit
                ${STATE_CLASS["Disponible"]}
              `}
            >
              Disponible
            </div>

          </div>

        </div>

      </div>

      {/* LINEA */}
      <div className="mt-10 w-full h-px bg-white/20"></div>
      
      
      <div className="flex items-center gap-3 mt-5">
        

        <span className="text-white font-semibold">
          MATERIALES A PRESTAR 
        </span>
                
        <div className="flex-1 h-px bg-white/20"></div>

      </div>
          <div className="mt-5">
          {/* TABLA */}
                <DataTable
                  data={filtered}
                  columns={loansColumns}
                  rowSelection={rowSelection}
                  onRowSelectionChange={setRowSelection}
                  initialPageSize={5}
                />

          </div>

      <div className="flex items-center gap-3 mt-7">

        <span className="text-white font-semibold">
          DATOS DEL PRESTAMO  
        </span>

        <div className="flex-1 h-px bg-white/20"></div>

      </div>

      <div className="mt-5 flex gap-10 flex-wrap">

        <div className="w-[250px] h-[70px] bg-white/80 rounded-[8px] p-3">
          Ficha/Grupo Aprendices: <br /> Ficha 2850123
        </div>

        <div className="w-[250px] h-[70px] bg-white/80 rounded-[8px] p-5 ">
          Cantidad (Consumo): 20 UND
        </div>

        <div className="w-[250px] h-[70px] bg-white/80 rounded-[8px] p-5">
          Fecha Salida: 26/05/2026
        </div>

        <div className="w-[250px] h-[70px] bg-white/80 rounded-[8px] p-3">
          Fecha Entrega(Devolutivo): 30/05/2026
        </div>
                
      </div>
      <br />
      <div className="w-[1120px] h-[70px] bg-white/80 rounded-[8px] p-3">
          Justificacion de uso: 
          <span className="text-black/80 "> Materiales requeridos para practica del modulo  de matenimiento preventivo en el labotario de sistemas </span>
        </div>

      <div className="flex items-center gap-3 mt-7">

        <span className="text-white font-semibold">
          USUARIO Y CONFIRMACION 
        </span>

        <div className="flex-1 h-px bg-white/20"></div>

      </div>

      <div className="mt-5 flex gap-10">

        

        <div className="w-[550px] h-[50px] bg-white/80 rounded-[8px] p-3">
          Usuario solicitante: @NameUser
        </div>

         <div className="w-[550px] h-[50px] bg-white/80 rounded-[8px] p-3">
          Codigo de verificacion : ✔ Verificado
        </div>

      </div>


      {/* BOTONES */}
      <div className="flex justify-end gap-4 mt-10">

        <Button
          variant="secondary"
          size="sm"
          onClick={onCancel}
        >
          Editar
        </Button>

        <Button
          variant="primary"
          size="md"
          onClick={handleNext}
        >
          Guardar
        </Button>

      </div>
        </div>

    </div>

  );

}