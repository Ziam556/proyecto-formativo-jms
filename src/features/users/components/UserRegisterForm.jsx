import { useState, useEffect} from 'react'
import { getDocumentTypes, getUserTypes } from "@/features/users/services/selectService"
import { userSchema } from "../schemas/userSchema";
import { check } from 'zod';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { SquareArrowRightEnter, Menu } from "lucide-react";
import { Input, Button, Select, Checkbox, DatePicker, IconButton, Dropdown, DropdownTrigger, DropdownContent ,DropdownItem  } from "@/shared";

export default function UserRegisterForm() {
    const Navigate = useNavigate();

    // Estados para las opciones de los selects
    // Se cargan desde archivos JSON a traves de los servicios
    const [documentTypes, setDocumentTypes] = useState([]);
    const [userTypes, setUserTypes] = useState([]);

    // Estado del formulario con todos sus campos inicializados en vacio
    const [ formData, setFormData ] = useState({
        userName: "",
        userEmail: "",
        userPhone: "",
        userDocumentType: "",
        userType: "",
        userDocumentNumber: "",
        userPassword: "",
        userAddress: "",
        userEmailVerification: "",
        userEmailInstitutional: "",
        startDate: "",
        endDate: "",
    });

    // Estado para los errores de validacion, se llena cuando Zod encuentra campos invalidos
    const [ errors, setErrors] = useState({});

    // Al montar el componente se cargan las opciones de los selects en paralelo
    useEffect(() => {
        getDocumentTypes().then(setDocumentTypes)
        getUserTypes().then(setUserTypes)
    }, [])

    // Funcion generica que actualiza cualquier campo del formulario
    // Usa el atributo name del input para saber cual campo actualizar
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value, 
        }))
    }

    // Valida el formulario completo con Zod al hacer submit
    // Si hay errores los mapea por campo y los guarda en el estado errors
    // Si la validacion es exitosa limpia los errores y procesa los datos
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
                    
                    {/* Informacion personal */}
                    <Input
                        label="Nombre"
                        name="userName"
                        placeholder="Ingrese su nombre"
                        value={formData.userName}
                        onChange={handleChange}
                        error={errors.userName}
                    />
                    <Input
                        label="Correo electrónico"
                        name="userEmail"
                        placeholder="Ingrese su correo"
                        type="email"
                        value={formData.userEmail}
                        onChange={handleChange}
                        error={errors.userEmail}
                    />

                    {/* Documento */}
                    <Select
                        label="Tipo de documento"
                        name="userDocumentType"
                        value={formData.userDocumentType}
                        options={documentTypes}
                        onChange={handleChange}
                        error={errors.userDocumentType}
                        placeholder="Tipo de documento"
                    />
                    <Input
                        label="Confirmación de correo electrónico"
                        name="userEmailVerification"
                        type="email"
                        placeholder="Confirme su correo"
                        value={formData.userEmailVerification}
                        onChange={handleChange}
                        error={errors.userEmailVerification}
                    />
                    <Input
                        label="Número de documento"
                        name="userDocumentNumber"
                        placeholder="Ingrese su número de documento"
                        value={formData.userDocumentNumber}
                        onChange={handleChange}
                        error={errors.userDocumentNumber}
                    />
                    <Input
                        label="Correo institucional (opcional)"
                        name="userEmailInstitutional"
                        type="email"
                        placeholder="Ingrese su correo institucional"
                        value={formData.userEmailInstitutional}
                        onChange={handleChange}
                        error={errors.userEmailInstitutional}
                    />

                    {/* Fechas de vinculacion del usuario al sistema
                        startDate: fecha en que el usuario empieza a tener acceso
                        endDate: fecha en que el usuario pierde el acceso
                        DatePicker convierte la fecha seleccionada a formato YYYY-MM-DD
                        para que sea compatible con handleChange y el schema de Zod */}
                    <DatePicker 
                        label="Fecha inicio"
                        name="startDate"
                        placeholder="Fecha inicio"
                        value={formData.startDate}
                        onChange={handleChange}
                        error={errors.startDate}
                    />
                    <Select
                        label="Tipo de usuario"
                        name="userType"
                        value={formData.userType}
                        options={userTypes}
                        onChange={handleChange}
                        error={errors.userType}
                        placeholder="Tipo de usuario"
                    />
                    <DatePicker
                        label="Fecha finalización"
                        name="endDate"
                        placeholder="Fecha finalización"
                        value={formData.endDate}
                        onChange={handleChange}
                        error={errors.endDate}
                    />

                    {/* Seguridad y contacto */}
                    <Input
                        label="Contraseña"
                        name="userPassword"
                        placeholder="Ingrese su contraseña"
                        value={formData.userPassword}
                        type="password"
                        onChange={handleChange}
                        error={errors.userPassword}
                    />
                    <Input
                        label="Dirección"
                        name="userAddress"
                        placeholder="Ingrese su dirección"
                        value={formData.userAddress}
                        onChange={handleChange}
                        error={errors.userAddress}
                    />
                    <Input
                        label="Número telefónico de contacto"
                        name="userPhone"
                        placeholder="Ingrese su teléfono"
                        value={formData.userPhone}
                        type="tel"
                        onChange={handleChange}
                        error={errors.userPhone}
                    />

                    <Checkbox
                        id="inStaff"
                        name="inStaff"
                        label="Es staff"
                        checked={formData.inStaff}
                        onChange={handleChange}
                    />

                    <Checkbox
                        id="isActive"
                        name="isActive"
                        label="Está activo"
                        checked={formData.isActive}
                        onChange={handleChange}
                    />
                    <Checkbox
                        id="inSuperUser"
                        name="inSuperUser"
                        label="Es super usuario"
                        checked={formData.inSuperUser}
                        onChange={handleChange}
                    />

                    {/* Actions */}
                    <div className="flex items-end justify-end gap-6">
                        <Button variant="secondary" size="sm">Cancelar</Button>
                        <Button variant="primary" size="md">Guardar</Button>
                    </div>

                    <div className="p-10">
                            <Dropdown>
                                <DropdownTrigger>
                                    <IconButton ariaLabel="Menu de usuario">
                                        <Menu/>    
                                    </IconButton>
                                </DropdownTrigger>

                                <DropdownContent className="right-0 w-48">
                                    <DropdownItem>
                                        <Link to="/auth" className="block w-full">
                                            Autenticacion
                                        </Link>
                                    </DropdownItem>

                                    <DropdownItem>
                                        <Link to="/dashboard" className="block w-full">
                                            Panel de control
                                        </Link>
                                    </DropdownItem>
                                </DropdownContent>
                            </Dropdown>    
                        </div>

                </div>
            </form>
        </div>
    );
}