import { Link } from "react-router-dom";

interface LogoProps {
    className?: string;
    showText?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', showText, size = 'md' }) => {

    {/* Maneja los tamaños.- */ }
    const dimensions = {
        sm: 'h-6 w-6',
        md: 'h-8 w-8',
        lg: 'h-16 w-16',
    };

    return (
        <Link
            to="/"
            className={`flex items-center gap-3 group transition-transform active:scale-95 ${className}`}
        >
            <img
                src="/nexus-logo.png"
                alt="Nexus Logo"
                className={`${dimensions[size]} object-contain drop-shadow-[0_0_8px_rgba(139,92,246,0.3)] group-hover:drop-shadow-[0_0_15px_rgba(139,92,246,0.6)] transition-all duration-300`}
            />

            {/* Texto de marca inferior.- */}
            {showText && (
                <span className={`font-black tracking-[0.2em] uppercase italic text-white transition-colors duration-300 group-hover:text-nexus-brand ${size === 'lg' ? 'text-xl' : 'text-sm'}`}>
                    Nexus
                </span>
            )}
        </Link>
    );
};