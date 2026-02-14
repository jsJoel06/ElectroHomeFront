import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiCheckCircle, FiArrowLeft, FiCreditCard } from "react-icons/fi";
import { crearPedidoCompleto } from "../service/detalleService"; 

function Pago() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const [formData, setFormData] = useState({
        nombreCliente: "",
        emailCliente: "",
        telefonoCliente: "",
        direccionEnvio: ""
    });

    useEffect(() => {
        const savedCart = localStorage.getItem("carrito_compras");
        const userData = JSON.parse(localStorage.getItem("user") || "{}");

        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        } else {
            setTimeout(() => navigate("/"), 3000);
        }

        // AUTOCOMPLETADO AUTOMÁTICO
        if (userData.email) {
            setFormData({
                nombreCliente: userData.nombre || "",
                emailCliente: userData.email,
                telefonoCliente: userData.telefono || "",
                direccionEnvio: userData.direccion || ""
            });
        }
    }, [navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const total = cartItems.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

    const manejarPagoReal = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cartItems.length === 0) return;
        setIsProcessing(true);

        try {
            await crearPedidoCompleto(formData, cartItems);
            localStorage.removeItem("carrito_compras");
            window.dispatchEvent(new Event("storage"));
            setIsFinished(true);
        } catch (error) {
            alert("Hubo un error. Inténtalo de nuevo.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (isFinished) return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
            <FiCheckCircle size={80} className="text-green-500 mb-6" />
            <h1 className="text-4xl font-black uppercase mb-2">¡Pedido Realizado!</h1>
            <p className="text-gray-500 mb-8">Gracias {formData.nombreCliente}. Puedes ver tu pedido en el historial.</p>
            <Link to="/pedidos" className="bg-black text-white px-10 py-4 rounded-2xl font-black uppercase text-[10px]">
                Ver Mis Compras
            </Link>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto p-6 pt-32">
            <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-10 hover:gap-4 transition-all">
                <FiArrowLeft /> Volver a la tienda
            </Link>

            <form onSubmit={manejarPagoReal} className="grid md:grid-cols-2 gap-16">
                <div className="space-y-8">
                    <h2 className="text-2xl font-black uppercase">Envío</h2>
                    <div className="grid gap-4">
                        <input required name="nombreCliente" placeholder="Nombre" value={formData.nombreCliente} onChange={handleChange} className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-black" />
                        <input required name="emailCliente" type="email" placeholder="Email" value={formData.emailCliente} onChange={handleChange} readOnly className="w-full p-4 bg-gray-200 rounded-xl cursor-not-allowed opacity-70 outline-none" />
                        <input required name="telefonoCliente" type="tel" placeholder="Teléfono" value={formData.telefonoCliente} onChange={handleChange} className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-black" />
                        <input required name="direccionEnvio" placeholder="Dirección" value={formData.direccionEnvio} onChange={handleChange} className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-black" />
                    </div>
                    <div className="p-6 border-2 border-black rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-4"><FiCreditCard size={24} /> <span className="text-[10px] font-black uppercase">Pago al Recibir</span></div>
                        <div className="w-4 h-4 bg-black rounded-full shadow-[0_0_0_4px_white,0_0_0_6px_black]"></div>
                    </div>
                </div>

                <div className="bg-zinc-900 text-white p-8 rounded-[32px] h-fit sticky top-32">
                    <h2 className="text-xl font-black uppercase mb-6 italic">Resumen</h2>
                    <div className="space-y-4 mb-8">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex justify-between text-[11px] font-bold uppercase tracking-wider opacity-80">
                                <span>{item.cantidad}x {item.nombre}</span>
                                <span>${(item.precio * item.cantidad).toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-white/20 pt-6 flex justify-between items-end">
                        <span className="text-[10px] font-black uppercase">Total</span>
                        <span className="text-3xl font-black tracking-tighter">${total.toLocaleString()}</span>
                    </div>
                    <button type="submit" disabled={isProcessing} className="w-full mt-8 bg-white text-black py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:invert transition-all">
                        {isProcessing ? "Procesando..." : "Confirmar Compra"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Pago;