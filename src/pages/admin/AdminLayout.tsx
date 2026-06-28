import { useAuth } from "../../context/AuthContext";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const AdminLayout = () => {

    const { logout } = useAuth();

    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="min-h-screen bg-nexus-bg flex">
            <div className="flex items-start pt-2 pl-1.5 md:absolute md:top-6 md:left-2 z-50">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-nexus-text-muted hover:text-white p-2 bg-nexus-surface md:bg-transparent rounded-lg border border-nexus-border md:border-none transition-colors flex items-center gap-1.5 cursor-pointer focus:outline-none"
                    aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
                >
                    {isOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
                
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    />
                )}
            </AnimatePresence>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.aside
                        initial={{ width: 0, opacity: 0, x: -20 }}
                        animate={{
                            width: 256, // Equivalente a w-64
                            opacity: 1,
                            x: 0,
                            transition: { type: "spring", stiffness: 300, damping: 30 }
                        }}
                        exit={{
                            width: 0,
                            opacity: 0,
                            x: -20,
                            transition: { type: "spring", stiffness: 300, damping: 30 }
                        }}
                        className={`
                            fixed md:relative inset-y-0 left-0 z-40
                            bg-nexus-surface border-r border-nexus-border p-6 
                            flex flex-col justify-between text-white overflow-hidden h-full
                        `}
                    >
                        {/* Contenedor interno con ancho fijo para evitar que el texto se deforme al colapsar */}
                        <div className="w-56 flex flex-col gap-6 mt-14 md:mt-10">
                            <h3 className="font-bold text-nexus-brand uppercase tracking-wider text-sm hidden md:block">
                                Nexus Admin
                            </h3>
                            <nav className="flex flex-col gap-2 text-sm text-nexus-text-muted">
                                <span className="text-white font-medium p-2 bg-nexus-bg/50 rounded-lg cursor-pointer flex items-center gap-2">
                                    📦 Gestionar Productos
                                </span>
                            </nav>
                        </div>

                        <div className="w-56 pb-4">
                            <button
                                onClick={logout}
                                className="text-xs font-semibold text-red-400 hover:text-red-300 text-left cursor-pointer transition-colors w-full p-2 rounded-lg hover:bg-red-500/10"
                            >
                                Cerrar Sesión →
                            </button>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            <motion.main
                layout // Hace que el contenedor principal se adapte suavemente cuando el sidebar aparece
                className="flex-1 p-6 md:p-8 overflow-y-auto w-full min-w-0"
            >
                {/* Espaciador superior en móvil para que el contenido no quede debajo del botón de menú */}
                <div className="h-4 md:hidden" />
                <Outlet />
            </motion.main>
        </div>
    );
};
