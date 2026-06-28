import { useOrders } from "../context/OrderContext";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Calendar, FileText, ExternalLink, Package } from "lucide-react";

export const MyOrders = () => {
    const { orders } = useOrders();
    const navigate = useNavigate();

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(value);
    };

    return (
        <div className="min-h-screen bg-nexus-bg text-nexus-text-main pt-6 pb-16 px-4 md:px-8">
            <div className="max-w-4xl mx-auto">

                <Link to="/checkout" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-nexus-text-muted hover:text-white transition-colors mb-6 group">
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Volver al Checkout
                </Link>

                <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-2 italic">
                    Historial de Pedidos <span className="text-nexus-brand">.</span>
                </h2>
                <p className="text-xs text-nexus-text-muted mb-8">Acá podés auditar tus compras guardadas localmente y re-enviarlas si tuviste problemas de conexión.</p>

                {orders.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-nexus-border rounded-2xl bg-nexus-surface/30">
                        <Package size={36} className="mx-auto text-nexus-text-muted/60 mb-3" />
                        <p className="text-nexus-text-muted text-sm font-medium">Aún no registraste ninguna orden de compra.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-nexus-surface border border-nexus-border/60 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:border-nexus-border">

                                {/* Informacion principal de la tarjeta.- */}
                                <div className="space-y-2 w-full md:w-auto">
                                    <div className="flex items-center gap-2.5">
                                        <span className="bg-nexus-brand text-white text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-md">
                                            {order.id}
                                        </span>
                                        <span className="text-xs text-nexus-text-muted flex items-center gap-1">
                                            <Calendar size={12} /> {order.date}
                                        </span>
                                    </div>
                                    <h4 className="text-sm font-bold text-white tracking-tight">
                                        Comprador: <span className="font-medium text-nexus-text-main">{order.customer.name}</span>
                                    </h4>
                                    <p className="text-xs text-nexus-text-muted truncate max-w-sm">
                                        📦 {order.items.map(i => `${i.quantity}x ${i.product.name}`).join(", ")}
                                    </p>
                                </div>

                                {/* Importe y Acciones rápidas.- */}
                                <div className="flex sm:items-center justify-between md:justify-end w-full md:w-auto gap-6 border-t md:border-t-0 border-nexus-border/20 pt-3 md:pt-0">
                                    <div>
                                        <span className="text-[10px] uppercase tracking-wider font-bold text-nexus-text-muted block">Monto Total</span>
                                        <span className="text-base font-black text-white">{formatCurrency(order.total)}</span>
                                    </div>

                                    {/* Boton de re-cobrado.- */}
                                    <button
                                        onClick={() => navigate("/checkout", { state: { recoverOrder: order } })}
                                        className="inline-flex items-center gap-1.5 bg-nexus-bg hover:bg-nexus-surface border border-nexus-border text-xs font-bold text-white hover:text-nexus-brand py-2.5 px-4 rounded-xl transition-all cursor-pointer shadow-sm"
                                    >
                                        <FileText size={13} /> Re-abrir en Checkout <ExternalLink size={11} />
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}