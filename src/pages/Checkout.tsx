import { useState } from "react";
import { useCart } from "../context/CartContext";
import { supabase } from "../lib/supabase";
import { ArrowLeft, ShoppingBag, User, Mail, Phone, MapPin, CreditCard, RefreshCw } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const ARGENTINIAN_PROVINCES = [
    "Buenos Aires", "CABA", "Catamarca", "Chaco", "Chubut", "Córdoba", "Corrientes",
    "Entre Ríos", "Formosa", "Jujuy", "La Pampa", "La Rioja", "Mendoza", "Misiones",
    "Neuquén", "Río Negro", "Salta", "San Juan", "San Luis", "Santa Cruz", "Santa Fe",
    "Santiago del Estero", "Tierra del Fuego", "Tucumán"
];

export const Checkout = () => {
    const { cart, totalPrice, clearCart } = useCart();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Estados locale spara los datos del cliente.-
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [province, setProvince] = useState('');
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [zipCode, setZipCode] = useState('');

    // Formateador de moneda para ARS.-
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
        }).format(value);
    };

    const handleCreateOrderAndRedirect = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validaciones iniciales de seguridad corporativa
        if (!name || !email || !phone || !province || !city || !address || !zipCode) {
            alert("Por favor, completa todos los campos obligatorios para el envío.");
            return;
        }

        if (cart.length === 0) {
            alert("El carrito está vacío. Agrega componentes antes de procesar el pago.");
            return;
        }

        setIsSubmitting(true);

        try {
            // Inserta la orden principal en la base de datos.-
            const { data: orderData, error: orderError } = await supabase
                .from("orders")
                .insert([
                    {
                        customer_name: name,
                        customer_email: email,
                        customer_phone: phone,
                        shipping_province: province,
                        shipping_city: city,
                        shipping_address: address,
                        shipping_zip_code: zipCode,
                        total_amount: totalPrice,
                        status: "pending" // Estado inicial antes de la pasarela.-
                    }
                ])
                .select()
                .single();

            if (orderError) throw orderError;

            // Mapea y prepara los ítems del carrito con el ID de la orden generada.-
            const orderItemsPayload = cart.map(item => ({
                order_id: orderData.id,
                product_id: String(item.product.id),
                product_name: item.product.name,
                price_at_purchase: item.product.price,
                quantity: item.quantity
            }));

            // Inserta los ítems en bloque en la tabla de la db 'order_items'.-
            const { error: itemsError } = await supabase
                .from("order_items")
                .insert(orderItemsPayload);

            if (itemsError) throw itemsError;

            // Limpieza local del carrito de compras.-
            clearCart();

            // Redirigue a la pasarela de pago.-
            alert(`¡Orden #${orderData.id.slice(0, 8)} creada con éxito en la nube!`);

            // Por ahora, redirecciona a la pantalla de catálogo.-
            navigate("/catalog");

        } catch (error: any) {
            console.error("Error procesando la orden de compra: ", error);
            alert(`Error de sincronización con Supabase: ${error.message || error}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-nexus-bg text-nexus-text-main pt-6 pb-16 px-4 md:px-8 relative">
            
            {/* Pantalla de bloqueo para la inserción en la base de datos.- */}
            {isSubmitting && (
                <div className="fixed inset-0 bg-nexus-bg/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-3">
                    <RefreshCw size={40} className="animate-spin text-nexus-brand" />
                    <p className="text-white text-sm font-bold uppercase tracking-wider">Registrando pedido en la nube...</p>
                </div>
            )}

            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <Link to="/catalog" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-nexus-text-muted hover:text-nexus-brand transition-colors group cursor-pointer">
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Volver al catálogo
                    </Link>
                </div>

                <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-8 italic text-left">
                    Finalizar Compra <span className="text-nexus-brand">.</span>
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Formulario de Facturación y Envío.- */}
                    <main className="lg:col-span-7 bg-nexus-surface border border-nexus-border/60 p-6 rounded-2xl shadow-sm text-left">
                        <div className="flex items-center gap-2 mb-6 border-b border-nexus-border/20 pb-4">
                            <User className="text-nexus-brand" size={20} />
                            <h3 className="text-base font-bold text-white uppercase tracking-tight">
                                Datos del Comprador y Destino
                            </h3>
                        </div>

                        <form onSubmit={handleCreateOrderAndRedirect} className="space-y-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-nexus-text-muted uppercase tracking-wider">Nombre Completo *</label>
                                <div className="relative">
                                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-nexus-text-muted/60" />
                                    <input
                                        type="text" required value={name} onChange={(e) => setName(e.target.value)}
                                        placeholder="Ej: Lucas Urquiza"
                                        className="w-full bg-nexus-bg border border-nexus-border rounded-xl py-2.5 pl-11 pr-4 text-sm text-nexus-text-main focus:outline-none focus:border-nexus-brand transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-nexus-text-muted uppercase tracking-wider">Correo Electrónico *</label>
                                    <div className="relative">
                                        <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-nexus-text-muted/60" />
                                        <input
                                            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                                            placeholder="lucas@example.com"
                                            className="w-full bg-nexus-bg border border-nexus-border rounded-xl py-2.5 pl-11 pr-4 text-sm text-nexus-text-main focus:outline-none focus:border-nexus-brand transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-nexus-text-muted uppercase tracking-wider">Teléfono / Celular *</label>
                                    <div className="relative">
                                        <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-nexus-text-muted/60" />
                                        <input
                                            type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)}
                                            placeholder="Ej: 3537669534"
                                            className="w-full bg-nexus-bg border border-nexus-border rounded-xl py-2.5 pl-11 pr-4 text-sm text-nexus-text-main focus:outline-none focus:border-nexus-brand transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Desplegable de Provincias Argentinas.- */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-nexus-text-muted uppercase tracking-wider">Provincia *</label>
                                    <div className="relative">
                                        <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-nexus-text-muted/60 z-10" />
                                        <select
                                            required value={province} onChange={(e) => setProvince(e.target.value)}
                                            className="w-full bg-nexus-bg border border-nexus-border rounded-xl py-2.5 pl-11 pr-4 text-sm text-nexus-text-main focus:outline-none focus:border-nexus-brand transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="" disabled>Selecciona provincia</option>
                                            {ARGENTINIAN_PROVINCES.map(prov => (
                                                <option key={prov} value={prov} className="bg-nexus-surface text-white">{prov}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-nexus-text-muted uppercase tracking-wider">Localidad / Ciudad *</label>
                                    <input
                                        type="text" required value={city} onChange={(e) => setCity(e.target.value)}
                                        placeholder="Ej: Villa María"
                                        className="w-full bg-nexus-bg border border-nexus-border rounded-xl py-2.5 px-4 text-sm text-nexus-text-main focus:outline-none focus:border-nexus-brand transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="sm:col-span-2 flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-nexus-text-muted uppercase tracking-wider">Calle y Altura *</label>
                                    <input
                                        type="text" required value={address} onChange={(e) => setAddress(e.target.value)}
                                        placeholder="Ej: Av. Colón 1234, Piso 2 Dpto B"
                                        className="w-full bg-nexus-bg border border-nexus-border rounded-xl py-2.5 px-4 text-sm text-nexus-text-main focus:outline-none focus:border-nexus-brand transition-all"
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-nexus-text-muted uppercase tracking-wider">Código Postal *</label>
                                    <input
                                        type="text" required value={zipCode} onChange={(e) => setZipCode(e.target.value)}
                                        placeholder="Ej: 5900"
                                        className="w-full bg-nexus-bg border border-nexus-border rounded-xl py-2.5 px-4 text-sm text-nexus-text-main focus:outline-none focus:border-nexus-brand transition-all"
                                    />
                                </div>
                            </div>

                            <button type="submit" className="hidden" id="submit-hidden-checkout-btn" />
                        </form>
                    </main>

                    {/* Resumen del Pedido Lateral.- */}
                    <aside className="lg:col-span-5 space-y-4 lg:sticky lg:top-24 text-left">
                        <div className="bg-nexus-surface border border-nexus-border/60 rounded-2xl p-6 shadow-sm flex flex-col">
                            <div className="flex items-center gap-2 mb-4 border-b border-nexus-border/20 pb-4">
                                <ShoppingBag className="text-nexus-brand" size={18} />
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                                    Resumen del Pedido ({cart.length})
                                </h3>
                            </div>

                            <div className="max-h-64 overflow-y-auto space-y-3 pr-1 mb-4 divide-y divide-nexus-border/10">
                                {cart.length === 0 ? (
                                    <p className="text-xs text-nexus-text-muted text-center py-8">Tu carrito está vacío.</p>
                                ) : (
                                    cart.map((item, idx) => (
                                        <div key={item.product.id} className={`flex items-center gap-4 text-white ${idx !== 0 ? 'pt-3' : ''}`}>
                                            <img
                                                src={item.product.imageUrl} alt={item.product.name}
                                                className="w-12 h-12 object-cover rounded-lg bg-nexus-bg border border-nexus-border/30 shrink-0"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-xs font-bold text-white truncate uppercase">{item.product.name}</h4>
                                                <span className="text-[11px] text-nexus-text-muted block mt-0.5">
                                                    Cantidad: <b className="text-white font-black">{item.quantity}</b>
                                                </span>
                                            </div>
                                            <span className="text-xs font-bold text-nexus-brand shrink-0">
                                                {formatCurrency(item.product.price * item.quantity)}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="border-t border-nexus-border/40 pt-4 mt-2 space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-nexus-text-muted font-medium">Monto Total:</span>
                                    <span className="text-2xl font-black tracking-tight text-white">{formatCurrency(totalPrice)}</span>
                                </div>

                                <button
                                    onClick={() => document.getElementById("submit-hidden-checkout-btn")?.click()}
                                    disabled={cart.length === 0}
                                    className="w-full bg-nexus-brand hover:bg-nexus-brand/90 disabled:bg-nexus-border disabled:text-nexus-text-muted text-white py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-[0.99]"
                                >
                                    <CreditCard size={16} /> Proceder al Pago Automático
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}