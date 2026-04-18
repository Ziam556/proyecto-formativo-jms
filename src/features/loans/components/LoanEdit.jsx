import { Input, Button } from "@/shared";

export default function UseEditLoan(){

    const handleChange = (campo) => (e) => {
        console.log(`${campo}: `, e.target.value);
    };

    return (
        <div>

            <h1 className="col-span-2 text-text-primary text-2xl mb-6">
                Editar Prestamo
            </h1>

            <h2 className="text-text-primary text-1xl mb-6">
                Edite la información correspondiente
            </h2>

            <form className="grid grid-cols-1  items-center gap-6" >
                <div className="grid grid-cols-2 gap-6 my-0 mx-auto">


            <div className="col-span-2 ">
            <Input
                placeholder="Placa Sena/Nombre Material"
                onChange={handleChange("Placa Sena/Nombre Material")}
            />
            </div>
                <Input
                    placeholder="ID"
                    onChange={handleChange("ID")}
                />

                <Input
                    placeholder="Grupo"
                    onChange={handleChange("Grupo")}
                />

                <Input
                    placeholder="Fecha Salida"
                    onChange={handleChange("Fecha Salida")}
                />

                <Input
                    placeholder="Fecha Estimada"
                    onChange={handleChange("Fecha Estimada")}
                />

                <Input
                    placeholder="Materiales"
                    onChange={handleChange("Materiales")}
                />

                <Input
                    placeholder="Usuario Solicitante"
                    onChange={handleChange("Usuario Solicitante")}
                />

                {/* Botones */}
                <div className="flex items-end justify-center gap-6">

                    <Button
                        variant="secundary"
                        size="md">
                        Cancelar
                    </Button>

                    <Button
                        variant="primary"
                        size="md">
                        Guardar Prestamo
                    </Button>
                </div>
            </div>

            </form>
        </div>
    );
}