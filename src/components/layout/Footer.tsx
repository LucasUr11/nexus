import { Logo } from "../../assets/Logo";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faXTwitter, faGithub } from '@fortawesome/free-brands-svg-icons';

export const Footer = () => {

    const navLinks = [
        { name: "Catálogo", to: "/catalog" },
        { name: "Teclados", to: "/catalog?category=Teclados" },
        { name: "Mouse", to: "/catalog?category=Mouse" },
        { name: "Audio", to: "/catalog?category=Audio" },
    ]

    return (
        <footer className="w-full bg-nexus-bg border-t border-nexus-border/50 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">

                {/* Grid Principales.- */}
                <div className="grid grid-cols-2 lg:grid-cols-5 lg:items-start gap-12 lg:gap-8 pb-12 border-b border-nexus-border/30">

                    {/* Columna 1: Branding.- */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Logo size="sm" />
                            <span className="text-lg font-black text-white tracking-widest uppercase italic">Nexus</span>
                        </div>

                        <p className="text-xs text-nexus-text-muted leading-relaxed max-w-xs">
                            Hardware disruptivo, teclados custom y periféricos diseñados para entusiastas de la tecnología. Elevá tu rendimiento táctil y estético.
                        </p>

                        <div className="flex items-center gap-3 pt-2">
                            <a href="https://www.instagram.com/lucas_urquiza11/" className="p-2 bg-nexus-surface rounded-lg text-nexus-text-muted hover:text-white hover:border-nexus-brand border border-transparent transition-all">
                                <FontAwesomeIcon icon={faInstagram} />
                            </a>
                            <a href="https://www.x.com/UrLucas11" className="p-2 bg-nexus-surface rounded-lg text-nexus-text-muted hover:text-white hover:border-nexus-brand border border-transparent transition-all">
                                <FontAwesomeIcon icon={faXTwitter} />

                            </a>
                            <a href="https://github.com/LucasUr11" className="p-2 bg-nexus-surface rounded-lg text-nexus-text-muted hover:text-white hover:border-nexus-brand border border-transparent transition-all">
                                <FontAwesomeIcon icon={faGithub} />

                            </a>
                        </div>
                    </div>

                    {/* Columna 2: Navegación.- */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-bold text-white uppercase tracking-widest italic">Productos</h4>
                        <div className="flex flex-col space-y-2 text-xs">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.to}
                                    className="text-nexus-text-muted hover:text-nexus-brand transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Columna 3: Links para acceder al Inventario.- */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] uppercase font-black text-white tracking-[0.2em]">Sistema</h4>
                        <ul className="space-y-2 text-[10px] uppercase font-bold text-nexus-text-muted tracking-widest">
                            <li>
                                <Link to="/login" className="hover:text-nexus-brand transition-colors">Acceso Staff</Link>
                            </li>
                            <li>
                                <Link to="/admin" className="hover:text-nexus-brand transition-colors">Inventario Central</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Columna 4: Soporte.- */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-white uppercase tracking-widest italic">Soporte técnico</h4>
                        <ul className="space-y-2 text-xs">
                            <li><a href="#faqs" className="text-nexus-text-muted hover:text-nexus-brand transition-colors">Preguntas Frecuentes</a></li>
                            <li><a href="#envios" className="text-nexus-text-muted hover:text-nexus-brand transition-colors">Políticas de Envío (ARS)</a></li>
                            <li><a href="#garantia" className="text-nexus-text-muted hover:text-nexus-brand transition-colors">Garantía Oficial</a></li>
                            <li><a href="#contacto" className="text-nexus-text-muted hover:text-nexus-brand transition-colors">Arrepentimiento de Compra</a></li>
                        </ul>
                    </div>

                    {/* Columna 5: Legales de e-commerce en Argentina.- */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-white uppercase tracking-widest italic">Información</h4>
                        <div className="text-xs text-nexus-text-muted space-y-2 leading-relaxed">
                            <p>Nexus Tech Store S.A.</p>
                            <p>CUIT: 30-42891915-8</p>
                            <p>Buenos Aires, Argentina</p>
                            <div className="pt-2">
                                {/* Cuadro de simulación de Data Fiscal obligatoria.- */}
                                <div className="w-10 h-14 bg-white/10 rounded border border-white/20 flex items-center justify-center text-[8px] text-center uppercase tracking-tighter text-white/60 select-none">
                                    Data Fiscal
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fila inferior.- */}
                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-nexus-text-muted/60">
                    <p>&copy; 2026 Nexus Tech Store. Todos los derechos reservados.</p>
                    <p>Hecho en Argentina con React + TypeScript + Tailwind v4</p>
                </div>
            </div>
        </footer>
    )
}