import { useState} from 'react'
import { loginUserSchema } from "../schemas/loginUserSchema";
import { Input, Button  } from "@/shared";

export default function LoginUserForm() {

    const [ formData, setFormData ] = useState({
        loginUserEmail: "",
        loginUserPassword: "",
    });

    const [ errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value, 
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const result = loginUserSchema.safeParse(formData);
        if (!result.success) {
            const fieldErrors = {};
            result.error.issues.forEach((issue) => {
                const field = issue.path[0]
                fieldErrors[field] = issue.message
            });
            setErrors(fieldErrors)
            return;
        }
        setErrors({});
        console.log("Login exitoso", result.data)
    }

    return (
        <div>
            <h1 className="text-text-primary text-2x1 mb-6">
                Inicio de sesión
            </h1>

            <form 
            className="grid grid-cols-1 items-center gap-6"
            onSubmit={handleSubmit}
            >
                <div className="grid grid-cols-2 gap-6 my-0 mx-auto">
                    
                    <Input
                        label="Correo electrónico"
                        name="loginUserEmail"
                        placeholder="Ingrese su correo"
                        type="email"
                        value={formData.loginUserEmail}
                        onChange={handleChange}
                        error={errors.loginUserEmail}
                    />
                    <Input
                        label="Contraseña"
                        name="loginUserPassword"
                        placeholder="Ingrese su contraseña"
                        value={formData.loginUserPassword}
                        type="password"
                        onChange={handleChange}
                        error={errors.loginUserPassword}
                    />

                    <div className="flex items-end justify-end gap-6">
                        <Button variant="primary" size="md">Iniciar sesión</Button>
                    </div>

                </div>
            </form>
        </div>
    );
}