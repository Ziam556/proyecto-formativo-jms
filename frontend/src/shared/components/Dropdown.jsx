import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    cloneElement
} from "react"
import { createPortal } from "react-dom"

export const DropdownContext = createContext(null)

export function Dropdown ({
    children,
    open: controlledOPen,
    onOpenChange,
    className = ""
}) {

    const [uncontrolledOpen, setUncontrolledOpen] = useState(false)

    const isControlled = controlledOPen !== undefined
    const open = isControlled ? controlledOPen : uncontrolledOpen

    const setOpen = (value) => {
        if (isControlled) {
            onOpenChange?.(value)
        } else {
            setUncontrolledOpen(value)
        }
    }

    const containerRef = useRef(null)
    const portalRef    = useRef(null)

    // click outside — checks both the trigger container and the portal content
    useEffect(() => {
        const handleClickOutside = (e) => {
            const inContainer = containerRef.current?.contains(e.target)
            const inPortal    = portalRef.current?.contains(e.target)
            if (!inContainer && !inPortal) setOpen(false)
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    // Escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape") setOpen(false)
        }
        document.addEventListener("keydown", handleEscape)
        return () => document.removeEventListener("keydown", handleEscape)
    }, [])

    return (
        <DropdownContext.Provider value={{ open, setOpen, containerRef, portalRef }}>
            <div ref={containerRef} className={`relative inline-block ${className}`}>
                {children}
            </div>
        </DropdownContext.Provider>
    )
}


// Trigger
export function DropdownTrigger({ children }) {
    const { open, setOpen } = useContext(DropdownContext)

    if (!children) return null

    return cloneElement(children, {
        onClick: (e) => {
            children.props.onClick?.(e)
            setOpen(!open)
        },
        "aria-expanded": open,
        "aria-haspopup": "menu"
    })
}


// Content — usa Portal para escapar de cualquier overflow:hidden padre
export function DropdownContent({ children, className = "" }) {
    const { open, containerRef, portalRef } = useContext(DropdownContext)
    const [coords, setCoords] = useState(null)

    useEffect(() => {
        if (open && containerRef?.current) {
            const rect = containerRef.current.getBoundingClientRect()
            setCoords({
                top:   rect.bottom + 4,
                right: window.innerWidth - rect.right,
            })
        }
    }, [open])

    if (!open || !coords) return null

    return createPortal(
        <div
            ref={portalRef}
            role="menu"
            style={{ position: "fixed", top: coords.top, right: coords.right, zIndex: 9999 }}
            className={`
                min-w-48
                border
                text-text-inverse
                p-1
                dark:bg-neutral-950/80
                backdrop-blur-[1px]
                shadow-lg
                rounded-2xl
                overflow-hidden
                hover:shadow-black
                text-white
                transition-shadow duration-700
                ${className}
            `}
        >
            {children}
        </div>,
        document.body
    )
}


// Item
export function DropdownItem({
    children,
    onClick,
    className = ""
}) {
    const { setOpen } = useContext(DropdownContext)

    const handleClick = (e) => {
        onClick?.(e)
        setOpen(false)
    }

    return(
        <button
            role="menuitem"
            onClick={handleClick}
            className={`
                w-full text-left px-3 py-2 rounded-lg
                hopver:bg-gray-500 focus:bg-gray-100
                transition-colors
                ${className}
            `}
        >
            {children}
        </button>
    )
}