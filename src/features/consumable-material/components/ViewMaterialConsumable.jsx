import { Input } from "@/shared";
import { useState, useEffect } from "react";
import { getCategoriesTypes } from "../services/selectService";

import {
  Button,
  BackButton,
} from "@/shared";

import destornillador from "@/assets/images/destornillador.png";

const STATE_CLASS = {
  Disponible: "bg-green-600",
  "No Disponible": "bg-yellow-600",
  Prestamo: "bg-blue-600",
  Baja: "bg-red-600",
  Traslado: "bg-purple-600",
  Mantenimiento: "bg-gray-500",
};

export default function ViewMatrialConsumable({
  formData = {},
  onNext,
  onCancel,
}) {

  const [categories, setCategories] = useState([]);

  const [fields, setFields] = useState({
    consumableMaterialId:
      formData?.consumableMaterialId || "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    getCategoriesTypes().then(setCategories);
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

    if (!fields.consumableMaterialId) {
      newErrors.consumableMaterialId =
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
        ml-130
        w-[1020px]
        rounded-2xl
        border
        border-white/10
        bg-white/10
        backdrop-blur-md
        shadow-2xl
        p-4
      "
    >
        <div className=">
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

        <BackButton to="/dashboard/consumable-material" />

        <h1 className="text-white text-2xl font-bold">
          Visualizar Material de consumo
        </h1>

      </div>

      <div className="flex items-end justify-between ">

        <div className="w-[320px]">

          <Input
            label="ID Material Consumo"
            name="consumableMaterialId"
            placeholder="ID"
            value={fields.consumableMaterialId}
            onChange={handleChange}
            error={errors.consumableMaterialId}
          />

        </div>

        <div className="flex items-center gap-4">

          <div className="relative w-20 h-20">

            <div className="w-20 h-20 rounded-full overflow-hidden bg-purple-500">

              <img
                src={destornillador}
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

        <span className="text-white font-semibold ">
          IDENTIFICACION
        </span>

        <div className="flex-1 h-px bg-white/20"></div>

      </div>

      <div className="mt-5 flex gap-16">

        <div className="w-[200px] h-[50px] bg-white/80 rounded-[8px] p-3">
          ID: 10001
        </div>

        <div className="w-[200px] h-[50px] bg-white/80 rounded-[8px] p-3">
          Placa Sena: 8JH11
        </div>

        <div className="w-[200px] h-[50px] bg-white/80 rounded-[8px] p-3">
          Serial: 12345
        </div>

      </div>

      <div className="flex items-center gap-3 mt-7">

        <span className="text-white font-semibold">
          Producto
        </span>

        <div className="flex-1 h-px bg-white/20"></div>

      </div>

      <div className="mt-5 flex gap-10 flex-wrap">

        <div className="w-[200px] h-[60px] bg-white/80 rounded-[8px] p-3">
          Marca: Stanley
        </div>

        <div className="w-[200px] h-[60px] bg-white/80 rounded-[8px] p-3">
          Modelo: STHT65
        </div>

        <div className="w-[200px] h-[60px] bg-white/80 rounded-[8px] p-3">
          Cantidad: 20 und
        </div>

        <div className="w-[200px] h-[60px] bg-white/80 rounded-[8px] p-3">
          Fecha compra: 20/06/2012
        </div>

      </div>

      <div className="flex items-center gap-3 mt-7">

        <span className="text-white font-semibold">
          Valoración
        </span>

        <div className="flex-1 h-px bg-white/20"></div>

      </div>

      <div className="mt-5 flex gap-10">

        <div className="w-[220px] h-[50px] bg-white/80 rounded-[8px] p-3">
          Valor unitario: $2.000
        </div>

        <div className="w-[220px] h-[50px] bg-white/80 rounded-[8px] p-3">
          Valor total: $40.000
        </div>

      </div>

      <div className="flex items-center gap-3 mt-7">

        <span className="text-white font-semibold">
          Asignación y Ubicación
        </span>

        <div className="flex-1 h-px bg-white/20"></div>

      </div>

      <div className="mt-5 flex gap-10 flex-wrap">

        <div className="w-[220px] h-[70px] bg-white/80 rounded-[8px] p-3">
          Estado: Disponible
        </div>

        <div className="w-[220px] h-[70px] bg-white/80 rounded-[8px] p-3">
          Cuentadante: Mariana Ramírez
        </div>

        <div className="w-[220px] h-[70px] bg-white/80 rounded-[8px] p-3">
          Ubicación: Almacén principal
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