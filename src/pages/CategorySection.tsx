import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CategorySection = () => {

    const catLinks = [
        {
            id: 'cat-1',
            to: "/catalog?category=Teclados",
            name: 'Teclados',
            title: 'Teclados Custom',
            subtitle: 'Switches, keycaps y layouts mecánicos optimizados.',
            imageUrl: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&q=80',
            gridClass: 'md:col-span-2 md:row-span-2 h-[300px] md:h-[420px]' // Tarjeta grande destacada
        },
        {
            id: 'cat-2',
            to: "/catalog?category=Mouse",
            name: 'Teclados',
            title: 'Mouse',
            subtitle: 'Sensores de alta precisión y peso pluma.',
            imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80',
            gridClass: 'md:col-span-1 h-[200px] md:h-[200px]' // Tarjeta chica
        },
        {
            id: 'cat-3',
            to: "/catalog?category=Audio",
            name: 'Audio',
            title: 'Audio Premium',
            subtitle: 'Sonido de estudio e inmersión total.',
            imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80',
            gridClass: 'md:col-span-1 h-[200px] md:h-[200px]' // Tarjeta chica
        },
        {
            id: 'cat-4',
            title: 'Setups Curados',
            to: '/catalog',
            subtitle: 'Deskpads, iluminación y accesorios para tu escritorio.',
            imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80',
            gridClass: 'md:col-span-2 h-[200px]' // Tarjeta alargada
        }
    ]


    return (
        <section className="w-full space-y-6">
            <div className="flex flex-col gap-1">

                {/* Encabezado.- */}
                <h2 className="text-xl md:text-2xl font-bold tracking-wider text-white uppercase italic">
                    Explorá por Categorías
                </h2>

                {/* El Grid.- */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-auto">
                    {catLinks.map((category) => (
                        <Link
                            key={category.id}
                            to={category.to}
                            className={`group relative rounded-3xl overflow-hidden border border-nexus-border/50 bg-nexus-surface flex flex-col justify-end p-6 md:p-8 transition-all duration-300 hover:border-nexus-brand/60 hover:shadow-[0_0_30px_rgba(139,92,246,0.1)] ${category.gridClass}`}
                        >
                            {/* Imagen de fondo.- */}
                            <div className="absolute inset-0 z-0">
                                <img
                                    src={category.imageUrl}
                                    alt={category.title}
                                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-nexus-bg via-nexus-bg/40 to-transparent" />
                            </div>

                            {/* Contenido de la tarjeta.- */}
                            <div className="relative z-10 space-y-1 md:space-y-2 pointer-events-none">
                                <div className="absolute top-25 right-0 md:top-45 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 items-center justify-center opacity-0 group-hover:opacity-100 duration-300 hidden md:flex">
                                    <ArrowUpRight size={18} className="text-white" />
                                </div>

                                <h3 className="text-lg md:text-2xl font-black text-white tracking-tight uppercase italic group-hover:text-nexus-brand-hover transition-colors">
                                    {category.title}
                                </h3>

                                <p className="text-xs text-nexus-text-muted max-w-xs leading-relaxed group-hover:text-white/80 transition-colors">
                                    {category.subtitle}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}