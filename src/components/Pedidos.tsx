import { useEffect, useState, useCallback } from "react";
import {
  FiPackage,  FiMapPin,  FiRefreshCw,
  FiTruck, FiCheckCircle, FiClock,  FiUser, FiXCircle, FiEdit3
} from "react-icons/fi";

const API_BASE = "https://electrohome-847j.onrender.com/api/pedidos";

function Pedidos() {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const cargarPedidos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const role = localStorage.getItem("authority");
      const admin = role === "ADMIN" || role === "ROLE_ADMIN";
      setIsAdmin(admin);

      // --- LÓGICA DE DETECCIÓN DE EMAIL MEJORADA ---
      let userEmail = localStorage.getItem("email");
      if (!userEmail) {
        const rawUser = localStorage.getItem("user");
        if (rawUser) {
          const userData = JSON.parse(rawUser);
          userEmail = userData.email || userData.emailCliente || userData.username;
        }
      }

      if (!admin && !userEmail) {
        setError("Inicia sesión para ver tus pedidos.");
        setLoading(false);
        return;
      }

      const url = admin ? API_BASE : `${API_BASE}/cliente/${userEmail}`;
      const response = await fetch(url);
      
      if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);

      const data = await response.json();
      setPedidos(Array.isArray(data) ? data.sort((a, b) => b.id - a.id) : []);
    } catch (err) {
      setError("No pudimos sincronizar con ElectroHome.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarPedidos();
  }, [cargarPedidos]);

  // --- FUNCIÓN PARA ACTUALIZAR ESTADO (PARA ADMIN) ---
  const cambiarEstado = async (id: number, nuevoEstado: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`${API_BASE}/${id}/estado?estado=${nuevoEstado}`, {
        method: 'PUT'
      });
      if (res.ok) {
        setPedidos(prev => prev.map(p => p.id === id ? { ...p, estado: nuevoEstado } : p));
      } else {
        alert("No se pudo actualizar el estado.");
      }
    } catch (err) {
      alert("Error de conexión al actualizar.");
    } finally {
      setUpdatingId(null);
    }
  };

  const getEstadoStyle = (estado: string) => {
    const config: any = {
      PENDIENTE: { bg: "bg-amber-100", text: "text-amber-700", icon: <FiClock className="animate-pulse" />, label: "PENDIENTE" },
      PROCESANDO: { bg: "bg-purple-100", text: "text-purple-700", icon: <FiPackage />, label: "PROCESANDO" },
      ENVIADO: { bg: "bg-blue-100", text: "text-blue-700", icon: <FiTruck />, label: "EN CAMINO" },
      ENTREGADO: { bg: "bg-emerald-100", text: "text-emerald-700", icon: <FiCheckCircle />, label: "ENTREGADO" },
      CANCELADO: { bg: "bg-red-100", text: "text-red-700", icon: <FiXCircle />, label: "CANCELADO" },
    };
    return config[estado] || { bg: "bg-zinc-100", text: "text-zinc-600", icon: <FiPackage />, label: estado };
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="font-black italic uppercase text-xs tracking-widest">Sincronizando ElectroHome...</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-6 pt-32 min-h-screen bg-white text-zinc-900">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-16">
        <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter italic flex items-center gap-4">
          <FiPackage className="text-indigo-600" />
          {isAdmin ? "Gestión Global" : "Mis Compras"}
        </h1>
        <button onClick={cargarPedidos} className="p-4 bg-zinc-100 hover:bg-black hover:text-white rounded-full transition-all active:scale-90">
          <FiRefreshCw size={24} />
        </button>
      </div>

      {error && (
        <div className="bg-zinc-900 text-white p-6 rounded-[30px] mb-10 font-bold uppercase text-center text-[10px] tracking-[0.3em]">
          {error}
        </div>
      )}

      {pedidos.length === 0 ? (
        <div className="bg-zinc-50 border-4 border-dashed border-zinc-200 p-24 rounded-[50px] text-center italic font-black uppercase text-zinc-300">
          Nada por aquí todavía
        </div>
      ) : (
        <div className="grid gap-10">
          {pedidos.map((pedido) => {
            const status = getEstadoStyle(pedido.estado);
            return (
              <div key={pedido.id} className="group relative bg-white border-2 border-zinc-100 rounded-[45px] p-8 md:p-12 hover:border-indigo-200 transition-all duration-500 shadow-sm hover:shadow-2xl">
                
                <div className="flex flex-col lg:flex-row justify-between gap-12">
                  
                  {/* COLUMNA IZQUIERDA: CLIENTE Y PRODUCTOS */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                       <span className="bg-zinc-900 text-white px-4 py-1.5 rounded-xl text-[10px] font-black italic">ORDEN #{pedido.id}</span>
                       <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold border ${status.bg} ${status.text} uppercase tracking-widest`}>
                         {status.label}
                       </span>
                    </div>

                    <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-6 flex items-center gap-3">
                      <FiUser size={28} className="text-zinc-200" />
                      {pedido.nombreCliente}
                    </h2>

                    {/* SELECTOR PARA ADMIN */}
                    {isAdmin && (
                      <div className="flex items-center gap-3 mb-8 bg-zinc-50 p-4 rounded-2xl w-fit border border-zinc-100">
                        <FiEdit3 className="text-zinc-400" />
                        <select 
                          disabled={updatingId === pedido.id}
                          onChange={(e) => cambiarEstado(pedido.id, e.target.value)}
                          className="bg-transparent text-[10px] font-black uppercase outline-none cursor-pointer"
                          value={pedido.estado}
                        >
                          <option value="PENDIENTE">Pendiente</option>
                          <option value="PROCESANDO">Procesando</option>
                          <option value="ENVIADO">Enviado</option>
                          <option value="ENTREGADO">Entregado</option>
                          <option value="CANCELADO">Cancelar</option>
                        </select>
                      </div>
                    )}

                    {/* LISTA DE PRODUCTOS */}
                    <div className="space-y-4 bg-zinc-50/50 p-8 rounded-[35px] border border-zinc-100">
                      {pedido.detalles?.map((det: any) => (
                        <div key={det.id} className="flex justify-between items-center group/item">
                          <div className="flex items-center gap-4">
                            <span className="text-indigo-600 font-black italic">x{det.cantidad}</span>
                            <span className="text-zinc-500 font-bold uppercase text-xs tracking-tight group-hover/item:text-black transition-colors">
                              {det.producto?.nombre}
                            </span>
                          </div>
                          <span className="font-black italic text-sm">${(det.precioUnitario * det.cantidad).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* COLUMNA DERECHA: ENVÍO Y PRECIO */}
                  <div className="lg:w-1/3 flex flex-col justify-between items-end text-right">
                    <div className="space-y-6">
                      <div className="flex flex-col items-end gap-2">
                        <FiMapPin className="text-indigo-600" size={24} />
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Dirección de entrega</p>
                        <p className="text-xs font-bold uppercase text-zinc-700 max-w-[200px] leading-relaxed">
                          {pedido.direccionEnvio || "Recogida Local"}
                        </p>
                      </div>
                      
                      {pedido.telefonoCliente && (
                        <div className="flex flex-col items-end gap-1">
                          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Contacto</p>
                          <p className="text-xs font-bold text-zinc-700 italic">{pedido.telefonoCliente}</p>
                        </div>
                      )}
                    </div>

                    <div className="mt-12">
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Inversión Total</p>
                      <p className="text-6xl font-black italic tracking-tighter text-indigo-600">
                        ${pedido.total?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FOOTER DECORATIVO */}
      <p className="mt-20 text-center text-[10px] font-black uppercase tracking-[0.5em] text-zinc-300">
        ElectroHome © 2026 • Sistemas de Gestión
      </p>
    </div>
  );
}

export default Pedidos;