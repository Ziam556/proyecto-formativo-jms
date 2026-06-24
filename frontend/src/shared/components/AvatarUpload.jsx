// src/shared/components/AvatarUpload.jsx
// Avatar circular clickeable que actúa como selector de imagen de perfil.
// Al hacer clic en el círculo o en el ícono de cámara se abre el file picker.
// Muestra preview inmediato de la imagen seleccionada.

import { useRef, useEffect, useState } from "react";
import { Camera, User, X } from "lucide-react";

/**
 * @param {File|null}   value        - Archivo de imagen actual (controlado)
 * @param {Function}    onChange      - Callback que recibe el File seleccionado (o null)
 * @param {string}      [previewUrl]  - URL de imagen ya guardada (útil en edición)
 * @param {number}      [size=140]    - Diámetro del círculo en px
 * @param {string}      [accept]      - Tipos MIME permitidos
 */
export default function AvatarUpload({
    value,
    onChange,
    previewUrl = null,
    size = 140,
    accept = "image/jpeg,image/png,image/svg+xml",
}) {
    const inputRef = useRef();
    const [localPreview, setLocalPreview] = useState(null);
    const [cleared, setCleared]           = useState(false);

    // Cuando llega un nuevo File desde el padre, generamos el object URL
    useEffect(() => {
        if (!value) {
            setLocalPreview(null);
            return;
        }
        const url = URL.createObjectURL(value);
        setLocalPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [value]);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0] ?? null;
        setCleared(false);
        onChange(file);
        e.target.value = "";
    };

    const handleClear = (e) => {
        e.stopPropagation();
        setCleared(true);
        onChange(null);
    };

    const openPicker = () => inputRef.current?.click();

    // Si el usuario borró la foto, no mostramos nada aunque haya previewUrl
    const displaySrc = cleared ? null : (localPreview || previewUrl);

    const camSize   = Math.round(size * 0.24);   // botón cámara proporcional
    const iconSize  = Math.round(size * 0.46);   // ícono User proporcional

    return (
        <div className="flex flex-col items-center gap-3">
            {/* ── Círculo clickeable ── */}
            <div
                onClick={openPicker}
                title="Cambiar foto de perfil"
                style={{ width: size, height: size }}
                className="relative cursor-pointer group"
            >
                {/* Fondo / imagen */}
                <div
                    style={{ width: size, height: size }}
                    className="rounded-full bg-[rgba(200,200,220,0.45)] border-2 border-[rgba(255,255,255,0.6)] overflow-hidden flex items-center justify-center transition-opacity group-hover:opacity-80"
                >
                    {displaySrc ? (
                        <img
                            src={displaySrc}
                            alt="Foto de perfil"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <User size={iconSize} color="rgba(90,90,120,0.7)" />
                    )}
                </div>

                {/* Overlay de hover */}
                <div
                    style={{ width: size, height: size }}
                    className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                    <Camera size={Math.round(size * 0.28)} color="#fff" />
                </div>

                {/* Botón X — solo visible cuando hay imagen */}
                {displaySrc && (
                    <button
                        type="button"
                        onClick={handleClear}
                        title="Quitar foto"
                        style={{ width: camSize, height: camSize }}
                        className="absolute top-1 right-1 rounded-full bg-[#71277A] flex items-center justify-center border-2 border-white z-10 cursor-pointer hover:bg-[#8f3399] transition-colors"
                    >
                        <X size={Math.round(camSize * 0.5)} color="#fff" />
                    </button>
                )}

                {/* Botón de cámara (decorativo / refuerzo visual) */}
                <div
                    style={{ width: camSize, height: camSize }}
                    className="absolute bottom-1 right-1 rounded-full bg-[#71277A] flex items-center justify-center border-2 border-white pointer-events-none"
                >
                    <Camera size={Math.round(camSize * 0.5)} color="#fff" />
                </div>
            </div>

            <label className="text-white text-[0.75rem] text-center select-none">
                Foto de perfil
            </label>

            {/* Input oculto desacoplado */}
            <input
                ref={inputRef}
                type="file"
                hidden
                accept={accept}
                onChange={handleFileChange}
            />
        </div>
    );
}