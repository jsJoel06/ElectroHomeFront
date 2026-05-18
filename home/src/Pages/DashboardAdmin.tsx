import { useEffect, useState, useCallback } from "react";
import { 
  FiPackage, FiTruck, FiCheckCircle, 
  FiDollarSign, FiTrendingUp, FiArrowUpRight, FiArrowDownRight, FiActivity 
} from "react-icons/fi";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';

// --- TIPADOS ---
type TimeRange = 'hoy' | 'semana' | 'mes' | 'año';

interface Stats {
  totalPedidos: number;
  enviados: number;
  entregados: number;
  totalVentas: number;
  crecimiento: number;
  historial: { nombre: string; ventas: number; pedidos: number }[];
}

const API_STATS = "https://electrohome-847j.onrender.com/api/pedidos/stats";

export default function DashboardAdmin() {
  const [range, setRange] = useState<TimeRange>('semana');
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const cargarStats = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_STATS}?range=${range}`);
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Error al sincronizar con la API");
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    cargarStats();
  }, [cargarStats]);

  if (loading && !stats) return <SkeletonUI />;

  // Extraemos el historial de forma segura para las gráficas
  const dataHistorial = stats?.historial || [];

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 font-sans text-slate-900 mt-10">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2 text-indigo-600 font-bold text-sm tracking-widest uppercase">
              <FiActivity /> Dashboard en Vivo
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">Análisis Comercial</h1>
          </div>
            
          <div className="flex bg-slate-200/50 p-1 rounded-2xl border border-slate-200 backdrop-blur-md">
            {(['hoy', 'semana', 'mes', 'año'] as TimeRange[]).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-5 py-2 rounded-xl text-xs font-bold uppercase transition-all duration-300 ${
                  range === r 
                    ? "bg-white text-indigo-600 shadow-sm scale-105" 
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {r}
              </button>
            ))} 
          </div>
        </div>
 
        {/* CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="Ingresos Totales" value={`$${stats?.totalVentas.toLocaleString()}`} icon={<FiDollarSign />} color="bg-indigo-600" trend={stats?.crecimiento} />
          <StatCard title="Pedidos" value={stats?.totalPedidos} icon={<FiPackage />} color="bg-blue-500" trend={3.1} />
          <StatCard title="En Camino" value={stats?.enviados} icon={<FiTruck />} color="bg-amber-500" />
          <StatCard title="Entregados" value={stats?.entregados} icon={<FiCheckCircle />} color="bg-emerald-500" />
        </div> 
   
        {/* GRÁFICOS CORREGIDOS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
          {/* FLUJO DE INGRESOS (AreaChart) */}
          <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
              <FiTrendingUp className="text-indigo-600" /> Flujo de Ingresos
            </h3> 
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dataHistorial} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="nombre" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="ventas" 
                    stroke="#6366f1" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorSales)" 
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* VOLUMEN DE PEDIDOS (BarChart) */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 flex flex-col">
            <h3 className="text-xl font-bold mb-8 text-slate-800">Volumen de Pedidos</h3>
            <div className="flex-1 min-h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataHistorial}>
                  <Bar dataKey="pedidos" radius={[6, 6, 6, 6]}>
                    {dataHistorial.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index === (dataHistorial.length - 1) ? '#6366f1' : '#E2E8F0'} 
                      />
                    ))}
                  </Bar>
                  <Tooltip cursor={{fill: 'transparent'}} content={({active, payload}) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-xl">
                          {payload[0].value} pedidos
                        </div>
                      )
                    }
                    return null;
                  }}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-8 p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1 text-center">Promedio Diario</p>
              <p className="text-3xl font-black text-slate-800 text-center">
                {stats ? Math.round(stats.totalPedidos / (dataHistorial.length || 7)) : 0}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// --- HELPERS ---

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 shadow-2xl rounded-2xl border border-slate-100">
        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{label}</p>
        <p className="text-lg font-black text-indigo-600">${payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
}

function StatCard({ title, value, icon, color, trend }: any) {
  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 rounded-2xl text-white ${color} shadow-lg shadow-current/20`}>
          {icon}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${trend > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            {trend > 0 ? <FiArrowUpRight /> : <FiArrowDownRight />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{title}</p>
      <h2 className="text-3xl font-black text-slate-900 mt-1">{value ?? 0}</h2>
    </div>
  );
}

function SkeletonUI() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-10 animate-pulse">
      <div className="max-w-7xl mx-auto">
        <div className="h-10 bg-slate-200 w-64 rounded-xl mb-12"></div>
        <div className="grid grid-cols-4 gap-6 mb-12">
          {[1,2,3,4].map(i => <div key={i} className="h-44 bg-slate-200 rounded-[2rem]"></div>)}
        </div>
        <div className="h-[400px] bg-slate-200 rounded-[2.5rem]"></div>
      </div>
    </div>
  );
}