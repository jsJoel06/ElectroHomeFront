import { useEffect, useState } from "react";
import { FiPackage, FiCalendar, FiMapPin, FiShoppingCart, FiRefreshCw, FiTruck, FiCheckCircle, FiClock, FiPhone, FiUser } from "react-icons/fi";

const API_BASE = "https://electrohome-847j.onrender.com/api/pedidos";

function Pedidos() {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarPedidos = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const emailGuardado = localStorage.getItem("email");
      let userEmail = emailGuardado;
      
      if (!userEmail) {
        const rawUser = localStorage.getItem("user");
        if (rawUser) {
          const userData = JSON.parse(rawUser);
          userEmail = userData.email || userData.emailCliente;
        }
      }

      if (!userEmail) {
        setError("Inicia sesión para ver tu historial de compras.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE}/cliente/${userEmail}`);
      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const data = await response.json();
      if (Array.isArray(data)) {
        setPedidos(data.sort((a: any, b: any) => b.id - a.id));
      }
    } catch (err: any) {
      setError("No pudimos conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  const getEstadoStyle = (estado: string) => {
    switch (estado) {
      case 'PENDIENTE':
        return { bg: 'bg-amber-100', text: 'text-amber-700', icon: <FiClock className="animate-pulse" />, label: 'PENDIENTE' };
      case 'ENVIADO':
        return { bg: 'bg-blue-100', text: 'text-blue-700', icon: <FiTruck />, label: 'EN CAMINO' };
      case 'ENTREGADO':
        return { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: <FiCheckCircle />, label: 'ENTREGADO' };
      default:
        return { bg: 'bg-zinc-100', text: 'text-zinc-600', icon: <FiPackage />, label: estado || 'PROCESANDO' };
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      <p className="font-black italic uppercase tracking-tighter">Sincronizando pedidos...</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-6 pt-32 min-h-screen bg-white">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-5xl font-black uppercase tracking-tighter italic flex items-center gap-4 text-zinc-900">
          <FiPackage size={40} /> Mis Compras
        </h1>
        <button 
          onClick={cargarPedidos}
          className="p-3 bg-zinc-50 hover:bg-black hover:text-white rounded-full transition-all duration-300 active:scale-90"
        >
          <FiRefreshCw size={24} />
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-6 rounded-[24px] mb-8 font-black uppercase text-center text-xs tracking-widest border border-red-100">
          {error}
        </div>
      )}

      {pedidos.length === 0 ? (
        <div className="bg-zinc-50 border-2 border-dashed border-zinc-200 p-20 rounded-[40px] text-center">
          <FiShoppingCart size={48} className="mx-auto mb-6 text-zinc-300" />
          <p className="text-zinc-400 font-black uppercase text-xs tracking-[0.2em] mb-6">Tu historial está vacío</p>
          <a href="/" className="inline-block bg-black text-white px-8 py-4 rounded-full font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-transform">
            Empezar a comprar
          </a>
        </div>
      ) : (
        <div className="grid gap-12">
          {pedidos.map((pedido) => {
            const status = getEstadoStyle(pedido.estado);
            return (
              <div key={pedido.id} className="bg-white border-2 border-zinc-100 rounded-[40px] p-10 hover:border-zinc-300 transition-all duration-500 shadow-sm hover:shadow-xl">
                
                {/* CABECERA: DATOS DEL CLIENTE Y ESTADO */}
                <div className="flex flex-col md:flex-row justify-between items-start mb-8 pb-8 border-b border-zinc-100 gap-6">
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Orden #{pedido.id}</span>
                    <h2 className="text-2xl font-black uppercase italic text-zinc-900 flex items-center gap-2">
                      <FiUser size={20} className="text-zinc-400" /> {pedido.nombreCliente || "Cliente ElectroHome"}
                    </h2>
                    <div className="flex flex-wrap items-center gap-4 text-zinc-500 font-bold text-xs uppercase tracking-tight">
                      <div className="flex items-center gap-2">
                        <FiCalendar className="text-zinc-400" /> 
                        {pedido.fechaPedido ? new Date(pedido.fechaPedido).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : "---"}
                      </div>
                      <div className="flex items-center gap-2">
                        <FiPhone className="text-zinc-400" /> 
                        {pedido.telefonoCliente || "Sin teléfono"}
                      </div>
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${status.bg} ${status.text} border`}>
                    {status.icon} {status.label}
                  </div>
                </div>

                {/* CUERPO: LISTA DE PRODUCTOS */}
                <div className="space-y-6 mb-10">
                  {pedido.detalles?.map((det: any) => (
                    <div key={det.id} className="flex justify-between items-center group">
                      <div className="flex items-center gap-5">
                        <div className="bg-zinc-900 text-white w-10 h-10 flex items-center justify-center rounded-xl font-black text-xs italic shadow-lg">
                          {det.cantidad}x
                        </div>
                        <span className="text-zinc-800 font-black uppercase text-xs tracking-tighter">
                          {det.producto?.nombre || "Producto"}
                        </span>
                      </div>
                      <span className="font-black text-zinc-950 text-sm italic">
                        ${(det.precioUnitario * det.cantidad).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* FOOTER: DIRECCIÓN Y TOTAL */}
                <div className="flex flex-col md:flex-row justify-between items-end pt-8 border-t border-zinc-100 gap-8">
                  <div className="flex flex-col gap-2 w-full md:w-auto">
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Destino de Entrega</span>
                    <div className="flex items-start gap-3 text-zinc-800 text-xs font-bold uppercase bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                      <FiMapPin className="shrink-0 mt-0.5 text-black" size={16} /> 
                      {pedido.direccionEnvio || "Recogida en tienda"}
                    </div>
                  </div>
                  
                  <div className="text-right min-w-[150px]">
                      <p className="text-[10px] font-black uppercase text-zinc-400 mb-1 tracking-widest">Total de la Orden</p>
                      <p className="text-5xl font-black tracking-tighter text-zinc-900 italic">
                          ${pedido.total?.toLocaleString() || '0'}
                      </p>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Pedidos;