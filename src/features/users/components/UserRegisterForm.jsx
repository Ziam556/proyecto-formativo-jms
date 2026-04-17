import { useState, useEffect} from 'react'
import { getDocumentTypes, getUserTypes } from "@/features/users/services/selectService"
import { userSchema } from "../schemas/userSchema";
import { Input, Button, Select } from "@/shared";


export default function UserRegisterForm() {

    const [documentTypes, setDocumentTypes] = useState([]);
    const [userTypes, setUserTypes] = useState([]);
    const [ formData, setFormData ] = useState({
        userName: "",
        userEmail: "",
        userPhone: "",
        userDocumentType: "",
        userType: "",
        userDocumentNumber: "",
        userPassword: "",
    });

    const [ errors, setErrors] = useState({});

    useEffect(() => {
        getDocumentTypes().then(setDocumentTypes)
        getUserTypes().then(setUserTypes)
    }, [])


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value, 
        }))
    }

    const handleSubmit = (e) => {

        e.preventDefault()

        const result = userSchema.safeParse(formData);
        
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
        console.log("Usuario invalido", result.data)
    }

    return (
        <div>
            <h1 className="text-text-primary text-2x1 mb-6">
                Registro de Usuarios
            </h1>

            <form 
            className="grid grid-cols-1 items-center gap-6"
            onSubmit={handleSubmit}
            >
                <div className="grid grid-cols-2 gap-6 my-0 mx-auto">
                    
                    <Input
                        name="userName"
                        placeholder="Nombre"
                        value={formData.userName}
                        onChange={handleChange}
                        error={errors.userName}
                    />
                    <Input
                        name="userEmail"
                        placeholder="Correo electrónico"
                        type="email"
                        value={formData.userEmail}
                        onChange={handleChange}
                        error={errors.userEmail}
                    />
                    <Select
                        name="userDocumentType"
                        value={formData.userDocumentType}
                        options={documentTypes}
                        onChange={handleChange}
                        error={errors.userDocumentType}
                        placeholder="Tipo de documento"
                    />
                    <Input
                        name="userEmailVerification"
                        type="email"
                        placeholder="Confirmación de correo electrónico"
                        value={formData.userEmail}
                        onChange={handleChange}
                        error={errors.userEmail}
                    />
                    <Input
                        name="userDocumentNumber"
                        placeholder="Número de documento"
                        value={formData.userDocumentNumber}
                        onChange={handleChange}
                        error={errors.userDocumentNumber}
                    />
                    <Input
                        name="userEmailInstitutional"
                        type="email"
                        placeholder="Correo institucional (opcional)"
                        value={formData.userEmail}
                        onChange={handleChange}
                        error={errors.userEmail}
                    />
                    <Input
                        name="startDate"
                        type="date"
                        label="Fecha inicio"
                        value={formData.startDate}
                        onChange={handleChange}
                        error={errors.startDate}
                    />
                    <Select
                        name="userType"
                        value={formData.userType}
                        options={userTypes}
                        onChange={handleChange}
                        error={errors.userType}
                        placeholder="Tipo de usuario"
                    />
                    <Input
                        name="endDate"
                        type="date"
                        placeholder="Fecha finalización"
                        value={formData.endDate}
                        onChange={handleChange}
                        error={errors.endDate}
                    />
                    <Input
                        name="userPassword"
                        placeholder="Contraseña"
                        value={formData.userPassword}
                        type="password"
                        onChange={handleChange}
                        error={errors.userPassword}
                    />
                    <Input
                        name="userAddress"
                        placeholder="Dirección"
                        value={formData.userAddress}
                        onChange={handleChange}
                        error={errors.userAddress}
                    />
                    <Input
                        name="userPhone"
                        placeholder="Número telefónico de contacto"
                        value={formData.userPhone}
                        type="tel"
                        onChange={handleChange}
                        error={errors.userPhone}
                    />
                    

                    {/* Actions */}
                    <div className="flex items-end justify-end gap-6">
                        <Button
                            variant="secondary"
                            size="sm"
                        >
                            Cancelar
                        </Button>

                        <Button
                            variant="primary"
                            size="md"
                        >
                            Guardar
                        </Button>

                    </div>
                
                </div>

            </form>
        </div>
    );
}