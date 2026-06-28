import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useOrders, type Order } from "../context/OrderContext";
import { ArrowLeft, ShoppingBag, User, Mail, Phone, MapPin, MessageSquare, History } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const Checkout = () => {
    const { cart, totalPrice, clearCart, loadCartItems } = useCart();
    const { createOrder } = useOrders();
    const location = useLocation();

    // Estados locale spara los datos del cliente.-
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [notes, setNotes] = useState('');

    // Por si viene re-direccionado desde el historial de pedidos.-
    useEffect(() => {
        const state = location.state as { recoverOrder?: Order };

        if (state?.recoverOrder) {
            const order = state.recoverOrder;

            // Setea los datos del cliente.-
            setName(order.customer.name);
            setEmail(order.customer.email);
            setPhone(order.customer.phone);
            setAddress(order.customer.address);
            setNotes(order.customer.notes || "");

            // Evita que se dupliquen por culpa del StrictMode.-
            loadCartItems(order.items);

            // Limpia el estado de la ruta para una proteccion en los datos en una posible recarga de la pagina
            window.history.replaceState({}, document.title);
        }
    }, [location.state, loadCartItems]);

    // Formateador de moneda para ARS.-
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
        }).format(value);
    };

    const handleSendWhatsApp = (e: React.FormEvent) => {
        e.preventDefault();

        // Valida que todos los datos sean obligartorios.-
        if (!name || !phone || !address) {
            alert("Por favor, completa los campos obligatorios.");
            return;
        }

        if (cart.length === 0) {
            alert("Tu carrito esta vacio. Agrega productos antes de finalizar la compra.");
            return;
        }

        // Registro local de "Mis Pedidos".-
        const savedOrder = createOrder(
            { name, email, phone, address, notes },
            cart,
            totalPrice
        );

        // Numero de telefono.-
        const businessPhone = "5493537669534";

        // Mensaje de texto con numero de orden.-
        let message = `🛒 *ORDEN DE COMPRA: ${savedOrder.id} - NEXUS STORE*\n`;
        message += `📅 *Fecha:* ${savedOrder.date}\n\n`;
        message += `👤 *Cliente:*\n`;
        message += `• *Nombre:* ${name}\n`;
        message += `• *Teléfono:* ${phone}\n`;
        message += `• *Dirección:* ${address}\n`;
        if (notes) message += `• *Notas:* ${notes}\n\n`;

        message += `📦 *Productos:* \n`;
        cart.forEach((item) => {
            message += `• ${item.quantity}x _${item.product.name}_ → *${formatCurrency(item.product.price * item.quantity)}*\n`;
        });

        message += `\n💵 *TOTAL A PAGAR: ${formatCurrency(totalPrice)}*\n`;

        // Hace que el tecxto sea valido dentro de una URL.-
        const encodedMessage = encodeURIComponent(message);

        // Redirigue a WhastApp.-
        const whatsappUrl = `https://wa.me/${businessPhone}?text=${encodedMessage}`;

        // Se limpia el formulario.-
        clearCart();
        setName("");
        setEmail("");
        setPhone("");
        setAddress("");
        setNotes("");

        window.open(whatsappUrl, "_blank"); // Abre el WhatsApp en otra pagina.-
    };

    return (
        <div className="min-h-screen bg-nexus-bg text-nexus-text-main pt-6 pb-16 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">

                <div className="flex justify-between items-center mb-6">
                    <Link to="/catalog" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-nexus-text-muted hover:text-nexus-brand transition-colors group cursor-pointer">
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Volver al catálogo
                    </Link>

                    {/* Botón flotante para ver el historial.- */}
                    <Link to="/my-orders" className="inline-flex items-center gap-2 bg-nexus-surface border border-nexus-border/60 hover:border-nexus-brand px-4 py-2 rounded-xl text-xs font-bold text-white transition-all">
                        <History size={14} className="text-nexus-brand" /> Mis Pedidos Antiguos
                    </Link>
                </div>

                <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-8 italic">
                    Finalizar Compra <span className="text-nexus-brand">.</span>
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Columna izquierda: Formulario.-*/}
                    <main className="lg:col-span-7 bg-nexus-surface border border-nexus-border/60 p-6 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-2 mb-6 border-b border-nexus-border/20 pb-4">
                            <User className="text-nexus-brand" size={20} />
                            <h3 className="text-base font-bold text-white uppercase tracking-tight">
                                Datos de Contacto y Envío
                            </h3>
                        </div>

                        <form onSubmit={handleSendWhatsApp} className="space-y-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-nexus-text-muted uppercase tracking-wider">Nombre Completo *</label>
                                <div className="relative">
                                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-nexus-text-muted/60" />
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Ej: Juan Pérez"
                                        className="w-full bg-nexus-bg border border-nexus-border rounded-xl py-2.5 pl-11 pr-4 text-sm text-nexus-text-main focus:outline-none focus:border-nexus-brand transition-all"
                                    />
                                </div>
                            </div>

                            {/* Email y Teléfono.- */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-nexus-text-muted uppercase tracking-wider">Correo Electrónico</label>
                                    <div className="relative">
                                        <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-nexus-text-muted/60" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="juan@example.com"
                                            className="w-full bg-nexus-bg border border-nexus-border rounded-xl py-2.5 pl-11 pr-4 text-sm text-nexus-text-main focus:outline-none focus:border-nexus-brand transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-nexus-text-muted uppercase tracking-wider">WhatsApp / Teléfono *</label>
                                    <div className="relative">
                                        <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-nexus-text-muted/60" />
                                        <input
                                            type="tel"
                                            required
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="Ej: 3516123456"
                                            className="w-full bg-nexus-bg border border-nexus-border rounded-xl py-2.5 pl-11 pr-4 text-sm text-nexus-text-main focus:outline-none focus:border-nexus-brand transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Dirección de entrega.- */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-nexus-text-muted uppercase tracking-wider">Dirección de Entrega Completa *</label>
                                <div className="relative">
                                    <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-nexus-text-muted/60" />
                                    <input
                                        type="text"
                                        required
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder="Ej: Av. Colón 1234, Piso 2 depto B - Córdoba"
                                        className="w-full bg-nexus-bg border border-nexus-border rounded-xl py-2.5 pl-11 pr-4 text-sm text-nexus-text-main focus:outline-none focus:border-nexus-brand transition-all"
                                    />
                                </div>
                            </div>

                            {/* Notas adicionales.- */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-nexus-text-muted uppercase tracking-wider">Notas Adicionales (Opcional)</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Indicaciones para el delivery o aclaraciones sobre el pedido..."
                                    rows={3}
                                    className="w-full bg-nexus-bg border border-nexus-border rounded-xl py-2.5 px-4 text-sm text-nexus-text-main focus:outline-none focus:border-nexus-brand transition-all resize-none"
                                />
                            </div>

                            {/* Botón de Envío.- */}
                            <button type="submit" className="hidden" id="submit-hidden-btn" />
                        </form>
                    </main>

                    <aside className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">

                        {/* Columna de resumen de compra.- */}
                        <div className="bg-nexus-surface border border-nexus-border/60 rounded-2xl p-6 shadow-sm flex flex-col">
                            <div className="flex items-center gap-2 mb-4 border-b border-nexus-border/20 pb-4">
                                <ShoppingBag className="text-nexus-brand" size={18} />
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                                    Resumen del Pedido ({cart.length})
                                </h3>
                            </div>

                            {/* Lista de productos (Con scroll integrado).- */}
                            <div className="max-h-80 overflow-y-auto space-y-3 pr-1 mb-4 divide-y divide-nexus-border/10">
                                {cart.length === 0 ? (
                                    <p className="text-xs text-nexus-text-muted text-center py-8">No hay artículos en el carrito.</p>
                                ) : (
                                    cart.map((item, idx) => (
                                        <div key={item.product.id} className={`flex items-center gap-4 text-white ${idx !== 0 ? 'pt-3' : ''}`}>
                                            <img
                                                src={item.product.imageUrl}
                                                alt={item.product.name}
                                                className="w-12 h-12 object-cover rounded-lg bg-nexus-bg border border-nexus-border/30 shrink-0"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-xs font-bold text-white truncate">{item.product.name}</h4>
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

                            {/* Divisor de Precio Total */}
                            <div className="border-t border-nexus-border/40 pt-4 mt-2 space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-nexus-text-muted font-medium">Total de tu Orden:</span>
                                    <span className="text-2xl font-black tracking-tight text-white">{formatCurrency(totalPrice)}</span>
                                </div>

                                {/* Botón de envio del formulario por WhatsApp.- */}
                                <button
                                    onClick={() => document.getElementById("submit-hidden-btn")?.click()}
                                    className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <MessageSquare size={16} className="fill-white" /> Enviar Pedido por WhatsApp
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    )
}