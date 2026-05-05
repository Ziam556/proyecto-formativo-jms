import { useState } from "react";
import { Input, Button  } from "@/shared";
import { loginSchema } from '../schemas/loginSchema.js';
import { Link, Navigate, useNavigate } from "react-router-dom"

export default function LoginForm() {
    const Navigate = useNavigate();

    const [formData, setFormData] = useState({
        userEmail: "",
        userPassword: "",

        // Flags booleanos
        isStaff:false,
        isActive: true,
        isSuperUser: false,
    });

    const [errors, setErrors] = useState({})

    // ==============================================
    //               Handle Genérico 
    // ==============================================

    // Funcion que se ejecuta cada vez que cambia el valor de un input del formulario

    const handleChange = (e) => {
        // Se obtiene el nombre del campo y su valor 
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            // Se copian todos los valores anteriores del estado
            ...prev,

            // Se actualiza unicamente lo que cambió
            [name]: type === "checkbox" ? checked : value,
        }));
    }

    // ==============================================
    //               Handle Genérico 
    // ==============================================

    // Funcion que se ejecuta cuando se envia el formulario

    const handleSubmit = (e) => {

        e.preventDefault();

        const result = loginSchema.safeParse(formData);

        if (!result.success) {
            const fieldErrors = {};
            result.error.issues.forEach((issue) => {
                const field = issue.path[0];
                fieldErrors[field] = issue.message;
            });
            
            setErrors(fieldErrors);
            return;
        }

        setErrors({})

        console.log("Usuario valido:", result.data);
        
    };

    return (
        <div className="flex flex-col justify-center h-screen">
            <h1 className="text-text-primary text-2x1 mb-6 text-center">
                Registro de Usuarios 
            </h1>

            <form
            className="grid grid-cols-1 items-center gap-6"
            onSubmit={handleSubmit}
            >
            
                <div className="grid gap-6 my-0 mx-auto  border-1 p-[48px] rounded-[6px]  pt-6">
                    
                    <Input
                        label="Contraseña"
                        name="userPassword"
                        placeholder="Ingrese su contraseña"
                        value={formData.userPassword}
                        onChange={handleChange}
                        error={errors.userPassword}
                    />
                    <Input
                        label="Correo"
                        name="userEmail"
                        placeholder="Ingrese su correo"
                        value={formData.userEmail}
                        type="email"
                        onChange={handleChange}
                        error={errors.userEmail}
                    />
                    {/* Actions */}
                    <div className="flex items-center justify-center gap-12">
                        <Button
                            variant="secondary"
                            size="sm"
                        >
                            Atrás
                        </Button>

                        <Button
                            variant="primary"
                            size="md"
                            onClick={() => Navigate("/dashboard")}
                        >
                            Iniciar Sesión
                        </Button>
                    </div>
                </div>
            </form>  
        </div>
    );
}