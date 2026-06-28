import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Lock } from "lucide-react";

export const Login = () => {

    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Si el usuario que ya esta logeado entra a Login, se redirige automaticamente a Admin.-
    if (isAuthenticated) {
        return <Navigate to="/admin" replace />;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const success = login(password);

        if (success) {
            navigate('/admin'); // Redirección moderna post-login
        } else {
            setError('Contraseña incorrecta. Probá con "admin123"');
        }
    };

    return (
        <div className="min-h-screen bg-nexus-bg text-nexus-text-main flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-nexus-surface border border-nexus-border/60 p-8 rounded-2xl shadow-lg flex flex-col gap-6">

                <div className="flex flex-col items-center text-center gap-2">
                    <div className="p-3 bg-nexus-brand/10 rounded-full text-nexus-brand">
                        <Lock size={28} />
                    </div>
                    <h2 className="text-xl font-black text-white uppercase tracking-tight">Acceso Administrador</h2>
                    <p className="text-xs text-nexus-text-muted">Ingresá la clave de gestión para administrar el stock.</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-nexus-text-muted uppercase tracking-wider">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-nexus-bg border border-nexus-border rounded-xl py-2.5 px-4 text-sm text-nexus-text-main focus:outline-none focus:border-nexus-brand transition-all"
                        />
                    </div>

                    {error && (
                        <p className="text-xs font-semibold text-red-400 bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-nexus-brand hover:bg-nexus-brand-hover text-white text-sm font-bold uppercase tracking-wider py-3 rounded-xl shadow-sm transition-all cursor-pointer active:scale-[0.99]"
                    >
                        Ingresar al Panel
                    </button>
                </form>
            </div>
        </div>
    );
};