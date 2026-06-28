import { useState } from 'react';
import { Send } from 'lucide-react';

export const HojaInformativa = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        console.log(`Email registrado de forma estática: ${email}`);
        setEmail('');
    }

    return (
        <section className="w-full py-12 md:py-20 relative overflow-hidden">
            <div className="bg-nexus-surface border border-nexus-border/50 rounded-3xl p-8 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-[0_0_50px_rgba(139,92,246,0.03)]">

                {/* Efecto de luz.- */}
                <div className="absolute top-1/2 right-0 -translate-y-1/2 w-75 h-75 bg-nexus-brand/10 rounded-full blur-[120px] pointer-events-none" />

                {/* Bloque izquierdo.- */}
                <div className="flex-1 space-y-4 text-left z-10 max-w-xl">
                    <span className="text-xs font-bold tracking-widest text-nexus-brand bg-nexus-brand/10 border border-nexus-brand/20 rounded-md px-2.5 py-1 uppercase italic">
                        Newsletter Hub
                    </span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white leading-tight uppercase italic">
                        Contenido Exclusivo. <br />
                        Construí tu Setup de Forma Inteligente.
                    </h2>
                    <p className="text-xs sm:text-sm text-nexus-text-muted leading-relaxed max-w-md">
                        Sumate a nuestra comunidad de hardware. Recibí alertas tempranas de restock de teclados custom, lanzamientos de componentes Asus/Ryzen y cupones de descuento exclusivos.
                    </p>

                    {/* Formulario de registro.- */}
                    <form
                        onSubmit={handleSubmit}
                        className="pt-4 flex flex-col sm:flex-row items-center gap-3 w-full max-w-md"
                    >
                        <div className="relatve w-full">
                            <input
                                type="text"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder='tu-correo@gmail.com'
                                className="w-full bg-nexus-bg border border-nexus-border rounded-full py-3 px-6 text-sm text-nexus-text-main placeholder-nexus-text-muted/50 focus:outline-none focus:border-nexus-brand focus:ring-1 focus:ring-nexus-brand transition-all"
                            />
                        </div>

                        <button
                            type='submit'
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-200 text-nexus-bg text-sm font-bold rounded-full py-3 px-6 shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 whitespace-nowrap cursor-pointer"
                        >
                            Suscribirse Now
                            <Send size={14} />
                        </button>
                    </form>

                    <p className="text-[10px] text-nexus-text-muted/60 max-w-xs">
                        "Tu información nunca será compartida con terceros y podés cancelar la suscripción en cualquier momento."
                    </p>
                </div>

                {/* Bloque derecho.- */}
                <div className="flex-1 w-full lg:max-w-md aspect-4/3 relative rounded-2xl overflow-hidden border border-nexus-border/60 group shadow-2xl z-10">
                    <img
                        src="https://images.unsplash.com/photo-1547119957-637f8679db1e?w=800&q=80"
                        alt="Nexus Tech Comunity"
                        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Degradado para acoplar la imagen al fondo.- */}
                    <div className="absolute inset-0 bg-linear-to-t from-nexus-surface via-transparent to-transparent opacity-60" />

                    {/* Simulacion del efecto border.- */}
                    <div className="absolute top-0 right-0 w-full h-1 bg-linear-to-r from-transparent via-nexus-brand to-transparent shadow-[0_2px_20px_rgba(139,92,246,0.8)]" />
                </div>
            </div>
        </section>
    );
};