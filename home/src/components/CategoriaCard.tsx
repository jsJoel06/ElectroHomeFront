import React, { useEffect, useState } from 'react'
import { getCategorias } from '../service/categoriaService'
import { Tv, Refrigerator, WashingMachine, Microwave, Coffee, Flame, LayoutGrid } from 'lucide-react'

interface Producto {
  id: number;
}

interface Categoria {
  id: number;
  nombre: string;
  productos: Producto[];
}

const API_BASE = 'https://electrohome-847j.onrender.com';

function CatalogoCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [activeTab, setActiveTab] = useState<number | null>(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const data = await getCategorias();
        setCategorias(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchCategorias();
  }, []);

  // Función para asignar iconos según el nombre de la categoría
  const getIcon = (nombre: string) => {
    const n = nombre.toLowerCase();
    if (n.includes('tv')) return <Tv size={24} />;
    if (n.includes('refri')) return <Refrigerator size={24} />;
    if (n.includes('lava')) return <WashingMachine size={24} />;
    if (n.includes('micro')) return <Microwave size={24} />;
    if (n.includes('tost')) return <Coffee size={24} />;
    if (n.includes('estu')) return <Flame size={24} />;
    return <LayoutGrid size={24} />;
  };

  return (
    <div className="w-full bg-white py-10 mt-15">
      <div className="max-w-7xl mx-auto px-4">
        {/* Encabezado del Catálogo */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-gray-900 mb-2">NUESTRO CATÁLOGO</h2>
          <div className="h-1.5 w-20 bg-gray-900 mx-auto rounded-full"></div>
        </div>

        {/* Selector de Categorías Estilo "Pills" o "Tabs" */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <button
            onClick={() => setActiveTab(null)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${activeTab === null
                ? 'bg-gray-900 text-white shadow-lg shadow-blue-200'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
          >
            Todos
          </button>

          {categorias.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-full font-bold transition-all ${activeTab === cat.id
                  ? 'bg-gray-900 text-white shadow-lg shadow-blue-200'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
            >
              {getIcon(cat.nombre)}
              {cat.nombre}
              <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${activeTab === cat.id ? 'bg-gray-900 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                {cat.productos.length}
              </span>
            </button>
          ))}
        </div>

        {/* Área de Visualización de Productos (Ejemplo de cuadrícula) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categorias
            .filter(cat => activeTab === null || cat.id === activeTab)
            .flatMap(cat => cat.productos.map(prod => ({ ...prod, catNombre: cat.nombre })))
            .map((p: any) => (
              <div key={p.id} className="group bg-gray-50 rounded-3xl p-4 border border-transparent hover:border-gray-900 hover:bg-white transition-all duration-300">
                <div className="aspect-square bg-gray-200 rounded-2xl mb-4 overflow-hidden relative">
                  {/* Aquí iría la imagen del producto */}
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-bold">
                    <img
                      src={`${API_BASE}/api/imagenes/${p.id}`}
                      alt={p.nombre}
                      className="max-w-full max-h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => { (e.currentTarget.src = "https://placehold.co/400x400?text=ElectroHome"); }}
                    />
                  </div>
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase text-gray-900">
                    {p.marca}
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 truncate">{p.nombre}</h3>
                <p className="text-sm text-gray-500 mb-3">{p.catNombre}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-black text-gray-900">${p.precio?.toLocaleString()}</span>
                  <button className="p-2 bg-gray-900 text-white rounded-xl hover:bg-gray-900 transition-colors">
                    <LayoutGrid size={18} />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default CatalogoCategorias;