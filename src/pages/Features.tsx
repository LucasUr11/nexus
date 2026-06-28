import { Truck, CreditCard, ShieldCheck, Headphones } from 'lucide-react';

const FEATURES = [
    {
        id: 1,
        icon: <Truck className="w-6 h-6 text-nexus-brand" />,
        title: "Envíos Nexus Speed",
        description: "A todo el país en 48hs"
    },
    {
        id: 2,
        icon: <CreditCard className="w-6 h-6 text-nexus-brand" />,
        title: "Cuotas sin Interés",
        description: "3, 6 y 12 pagos fijos"
    },
    {
        id: 3,
        icon: <ShieldCheck className="w-6 h-6 text-nexus-brand" />,
        title: "Garantía Global",
        description: "Soporte técnico oficial"
    },
    {
        id: 4,
        icon: <Headphones className="w-6 h-6 text-nexus-brand" />,
        title: "Atención 24/7",
        description: "Expertos en hardware"
    }
];

export const Features = () => {
    return (
        <section className="w-full bg-nexus-bg border-y border-nexus-border/30">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {FEATURES.map((feature) => (
                        <div
                            key={feature.id}
                            className="flex items-center gap-4 group cursor-default transition-all duration-300 hover:translate-x-1"
                        >
                            <div className="shrink-0 p-3 rounded-xl bg-nexus-surface border border-nexus-border/50 group-hover:border-nexus-brand/50 group-hover:shadow-[0_0_15px_rgba(139,92,246,0.15)] transition-all">
                                {feature.icon}
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-white tracking-wide uppercase italic">
                                    {feature.title}
                                </h3>
                                <p className="text-xs text-gray-400 font-medium">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}