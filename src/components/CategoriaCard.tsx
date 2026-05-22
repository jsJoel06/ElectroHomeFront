import { useEffect, useState } from 'react'
import { getCategorias } from '../service/categoriaService'
import {
  Tv,
  Refrigerator,
  WashingMachine,
  Microwave,
  Coffee,
  Flame,
  LayoutGrid
} from 'lucide-react'

interface Foto {
  id: number;
}

interface Producto {
  id: number;
  nombre: string;
  marca: string;
  precio: number;
  stock: number;
  descripcion: string;
  fotos: Foto[];
}

interface Categoria {
  id: number;
  nombre: string;
  productos: Producto[];
}

interface ProductoConCategoria extends Producto {
  catNombre: string;
}

const API_BASE = 'https://electrohome-847j.onrender.com';

function CatalogoCategorias() {

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [activeTab, setActiveTab] = useState<number | null>(null);

  useEffect(() => {

    const fetchCategorias = async () => {

      try {

        const data = await getCategorias();

        console.log(data);

        setCategorias(data);

      } catch (error) {

        console.error('Error:', error);

      }
    };

    fetchCategorias();

  }, []);

  const getIcon = (nombre: string) => {

    const n = nombre.toLowerCase();

    if (n.includes('tv')) {
      return <Tv size={24} />;
    }

    if (n.includes('refri')) {
      return <Refrigerator size={24} />;
    }

    if (n.includes('lava')) {
      return <WashingMachine size={24} />;
    }

    if (n.includes('micro')) {
      return <Microwave size={24} />;
    }

    if (n.includes('tost')) {
      return <Coffee size={24} />;
    }

    if (n.includes('estu')) {
      return <Flame size={24} />;
    }

    return <LayoutGrid size={24} />;
  };

  const productosFiltrados: ProductoConCategoria[] =
    categorias
      .filter(
        cat => activeTab === null || cat.id === activeTab
      )
      .flatMap(cat =>
        cat.productos.map(prod => ({
          ...prod,
          catNombre: cat.nombre
        }))
      );

  return (

    <div className="w-full bg-white py-10 mt-15">

      <div className="max-w-7xl mx-auto px-4">

        {/* HEADER */}

        <div className="text-center mb-12">

          <h2 className="text-4xl font-black text-gray-900 mb-2">
            NUESTRO CATÁLOGO
          </h2>

          <div className="h-1.5 w-20 bg-gray-900 mx-auto rounded-full"></div>

        </div>

        {/* CATEGORÍAS */}

        <div className="flex flex-wrap justify-center gap-4 mb-16">

          <button
            onClick={() => setActiveTab(null)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${
              activeTab === null
                ? 'bg-gray-900 text-white shadow-lg'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            Todos
          </button>

          {categorias.map((cat) => (

            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-full font-bold transition-all ${
                activeTab === cat.id
                  ? 'bg-gray-900 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >

              {getIcon(cat.nombre)}

              {cat.nombre}

              <span
                className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                  activeTab === cat.id
                    ? 'bg-white text-black'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {cat.productos.length}
              </span>

            </button>

          ))}

        </div>

        {/* PRODUCTOS */}

        {productosFiltrados.length === 0 ? (

          <div className="text-center py-20">

            <h3 className="text-2xl font-black text-gray-700 mb-2">
              No hay productos
            </h3>

            <p className="text-gray-500">
              Esta categoría todavía no tiene productos.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

            {productosFiltrados.map((p) => (

              <div
                key={p.id}
                className="group bg-gray-50 rounded-3xl p-4 border border-transparent hover:border-gray-900 hover:bg-white transition-all duration-300"
              >

                {/* IMAGEN */}

                <div className="aspect-square bg-gray-100 rounded-2xl mb-4 overflow-hidden relative flex items-center justify-center">

                  <img
                    src={`${API_BASE}/api/imagenes/${p.id}`}
                    alt={p.nombre}
                    className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://placehold.co/400x400?text=ElectroHome";
                    }}
                  />

                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase text-gray-900">

                    {p.marca}

                  </div>

                  {(p.stock ?? 0) <= 5 && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-[10px] font-bold">
                      Poco stock
                    </div>
                  )}

                </div>

                {/* INFO */}

                <h3 className="font-bold text-gray-900 line-clamp-2 min-h-[56px]">

                  {p.nombre}

                </h3>

                <p className="text-sm text-gray-500 mb-3">

                  {p.catNombre}

                </p>

                <div className="flex justify-between items-center">

                  <span className="text-xl font-black text-gray-900">

                    ${p.precio.toLocaleString()}

                  </span>

                  <button className="p-2 bg-gray-900 text-white rounded-xl hover:scale-105 transition-all">

                    <LayoutGrid size={18} />

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

export default CatalogoCategorias;