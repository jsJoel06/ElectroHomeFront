import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiCheckCircle, FiArrowLeft, FiCreditCard } from "react-icons/fi";

interface CartItem {
    id: number | string;
    nombre: string;
    precio: number;
    cantidad: number;
}

function Pago() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    // 1. Cargar productos para calcular el resumen
    useEffect(() => {
        const savedCart = localStorage.getItem("carrito_compras");
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        } else {
            // Si no hay nada, redirigir al inicio después de un momento
            setTimeout(() => navigate("/"), 3000);
        }
    }, [navigate]);

    const total = cartItems.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

    // 2. Método de Pago (Simulación Local)
    const procesarPagoLocal = () => {
        setIsProcessing(true);

        // Simulamos una demora de red de 2 segundos
        setTimeout(() => {
            // Guardar la orden en un historial local (opcional)
            const historial = JSON.parse(localStorage.getItem("historial_compras") || "[]");
            const nuevaOrden = {
                id: Date.now(),
                fecha: new Date().toISOString(),
                productos: cartItems,
                total: total
            };
            historial.push(nuevaOrden);
            localStorage.setItem("historial_compras", JSON.stringify(historial));

            // VACÍAR EL CARRITO (Lo más importante)
            localStorage.removeItem("carrito_compras");
            
            // Notificar a otros componentes (Header, etc) que el carrito está vacío
            window.dispatchEvent(new Event("storage"));

            setIsProcessing(false);
            setIsFinished(true);
        }, 2000);
    };

    if (isFinished) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500">
                <FiCheckCircle size={80} className="text-green-500 mb-6" />
                <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">¡Pago Exitoso!</h1>
                <p className="text-gray-500 max-w-sm mb-8 text-sm">Tu pedido ha sido procesado localmente. Gracias por comprar en ElectroHome.</p>
                <Link to="/" className="bg-black text-white px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-zinc-800 transition-all">
                    Volver a la tienda
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 pt-24 md:pt-32">
            <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-10 hover:gap-4 transition-all">
                <FiArrowLeft /> Volver
            </Link>

            <div className="grid md:grid-cols-2 gap-16">
                {/* Formulario Simulado */}
                <div className="space-y-8">
                    <h2 className="text-2xl font-black uppercase tracking-tighter">Información de Envío</h2>
                    <div className="grid gap-4">
                        <input type="text" placeholder="Nombre completo" className="w-full p-4 bg-gray-50 rounded-xl border-none text-sm focus:ring-2 focus:ring-black outline-none" />
                        <input type="email" placeholder="Correo electrónico" className="w-full p-4 bg-gray-50 rounded-xl border-none text-sm focus:ring-2 focus:ring-black outline-none" />
                        <input type="text" placeholder="Dirección de entrega" className="w-full p-4 bg-gray-50 rounded-xl border-none text-sm focus:ring-2 focus:ring-black outline-none" />
                    </div>

                    <h2 className="text-2xl font-black uppercase tracking-tighter pt-4">Método de Pago</h2>
                    <div className="p-6 border-2 border-black rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <FiCreditCard size={24} />
                            <span className="text-xs font-bold uppercase tracking-widest">Tarjeta de Crédito (Simulada)</span>
                        </div>
                        <div className="w-4 h-4 bg-black rounded-full shadow-[0_0_0_4px_white,0_0_0_6px_black]"></div>
                    </div>
                </div>

                {/* Resumen de Compra */}
                <div className="bg-gray-50 p-8 rounded-3xl h-fit">
                    <h2 className="text-xl font-black uppercase tracking-tighter mb-6">Resumen</h2>
                    <div className="space-y-4 mb-8">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex justify-between text-sm">
                                <span className="text-gray-500 font-medium">{item.cantidad}x {item.nombre}</span>
                                <span className="font-bold">${(item.precio * item.cantidad).toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-gray-200 pt-6 mb-8 flex justify-between items-end">
                        <span className="text-xs font-black uppercase tracking-widest">Total a pagar</span>
                        <span className="text-3xl font-black">${total.toLocaleString()}</span>
                    </div>

                    <button 
                        onClick={procesarPagoLocal}
                        disabled={isProcessing || cartItems.length === 0}
                        className={`w-full py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all shadow-lg ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-zinc-800 active:scale-95'}`}
                    >
                        {isProcessing ? "Procesando..." : "Confirmar y Pagar"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Pago;