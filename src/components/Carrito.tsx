import { FiX, FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

interface CartItem {
    id: number | string;
    nombre: string;
    precio: number;
    imagen: string;
    cantidad: number;
}

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const API_BASE = "https://electrohome-847j.onrender.com";

function Carrito({ isOpen, onClose }: CartDrawerProps) {
    const navigate = useNavigate();
    
    // Usamos una referencia para saber si el cambio viene de este mismo componente
    const isInternalUpdate = useRef(false);

    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        const savedCart = localStorage.getItem("carrito_compras");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // 1. Sincronizar cuando cambian los datos desde FUERA (otra pestaña o Navbar)
    useEffect(() => {
        const handleSync = () => {
            if (isInternalUpdate.current) {
                isInternalUpdate.current = false;
                return;
            }
            const savedCart = localStorage.getItem("carrito_compras");
            if (savedCart) {
                const parsed = JSON.parse(savedCart);
                setCartItems(parsed);
            }
        };

        window.addEventListener("storage", handleSync);
        window.addEventListener("cart-updated", handleSync);

        return () => {
            window.removeEventListener("storage", handleSync);
            window.removeEventListener("cart-updated", handleSync);
        };
    }, []);

    // 2. Guardar en LocalStorage y avisar a los demás componentes
    useEffect(() => {
        const currentCartString = JSON.stringify(cartItems);
        const savedCartString = localStorage.getItem("carrito_compras");

        // Solo actualizamos si realmente hay un cambio de contenido
        if (currentCartString !== savedCartString) {
            isInternalUpdate.current = true; // Marcamos que nosotros hicimos el cambio
            localStorage.setItem("carrito_compras", currentCartString);
            window.dispatchEvent(new Event("cart-updated"));
        }
    }, [cartItems]);

    const modificarCantidad = (id: number | string, delta: number) => {
        setCartItems(prev =>
            prev.map(item =>
                item.id === id
                    ? { ...item, cantidad: Math.max(1, item.cantidad + delta) }
                    : item
            )
        );
    };

    const eliminarProducto = (id: number | string) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const irAPagos = () => {
        onClose();
        navigate("/pago");
    };

    const total = cartItems.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

    return (
        <>
            {/* OVERLAY */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] transition-opacity duration-500 ${
                    isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
                onClick={onClose}
            />

            {/* DRAWER */}
            <div
                className={`fixed right-0 top-0 h-full w-full md:w-[450px] bg-white z-[210] shadow-2xl transition-transform duration-500 ease-in-out flex flex-col ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                {/* HEADER */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black uppercase tracking-tighter">Tu Carrito</h2>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                            {cartItems.length} Artículos
                        </p>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-full">
                        <FiX size={24} />
                    </button>
                </div>

                {/* BODY */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {cartItems.length > 0 ? (
                        cartItems.map(item => (
                            <div key={item.id} className="flex gap-4 animate-in fade-in slide-in-from-right-4">
                                <div className="w-24 h-24 bg-gray-100 rounded-2xl overflow-hidden shrink-0">
                                    <img
                                        src={`${API_BASE}/api/imagenes/${item.id}`}
                                        alt={item.nombre}
                                        className="w-full h-full object-cover"
                                        onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/150")}
                                    />
                                </div>

                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="flex justify-between">
                                        <h3 className="text-[10px] font-black uppercase max-w-[150px] leading-tight">
                                            {item.nombre}
                                        </h3>
                                        <button onClick={() => eliminarProducto(item.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                                            <FiTrash2 size={16} />
                                        </button>
                                    </div>

                                    <p className="text-sm font-bold">${item.precio.toLocaleString()}</p>

                                    <div className="flex items-center gap-4 bg-gray-50 px-3 py-1 rounded-xl w-fit border border-gray-100">
                                        <button onClick={() => modificarCantidad(item.id, -1)} className="hover:scale-125 transition-transform">
                                            <FiMinus size={14} />
                                        </button>
                                        <span className="text-xs font-black w-4 text-center">{item.cantidad}</span>
                                        <button onClick={() => modificarCantidad(item.id, 1)} className="hover:scale-125 transition-transform">
                                            <FiPlus size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                            <p className="text-gray-400 font-bold uppercase text-xs">El carrito está vacío</p>
                            <Link to="/" onClick={onClose} className="mt-4 text-xs underline font-black">Empezar a comprar</Link>
                        </div>
                    )}
                </div>

                {/* FOOTER */}
                {cartItems.length > 0 && (
                    <div className="p-8 border-t border-gray-100 bg-gray-50/50">
                        <div className="flex justify-between mb-4 items-end">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Subtotal</span>
                            <span className="text-2xl font-black">${total.toLocaleString()}</span>
                        </div>
                        <button
                            onClick={irAPagos}
                            className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-zinc-800 transition-colors shadow-lg shadow-black/10"
                        >
                            Finalizar Pedido
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

export default Carrito;