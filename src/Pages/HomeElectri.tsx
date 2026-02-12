import { useEffect, useState } from "react"
import { getProduc, deleteProducto } from "../service/serviceElectriHome";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

const API_BASE = 'https://electrohome-847j.onrender.com';

// --- INTERFACES ---
interface Categoria {
  id: number;
  nombre: string;
}

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  categoria?: Categoria;
  descripcion?: string;
}

interface HomeProps {
  onOpenCart: () => void;
}

function HomeElectri({ onOpenCart }: HomeProps) { 
  // Estados tipados correctamente
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productosFiltrados, setProductosFiltrados] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const [precioMax, setPrecioMax] = useState<number>(1000000);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState<number[]>([]);
  const [showCats, setShowCats] = useState<boolean>(true);
  const [showPrecio, setShowPrecio] = useState<boolean>(true);

  const cargarTodo = async () => {
    try {
      setLoading(true);
      const [resProductos, resCategorias]: [Producto[], Categoria[]] = await Promise.all([
        getProduc(),
        fetch(`${API_BASE}/api/categorias`).then(res => res.json())
      ]);
      setProductos(resProductos);
      setProductosFiltrados(resProductos);
      setCategorias(resCategorias);
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTodo();
    const role = localStorage.getItem('authority');
    setIsAdmin(role === 'ADMIN' || role === 'ROLE_ADMIN');
  }, []);

  useEffect(() => {
    const filtrados = productos.filter(p => {
      const precioNum = Number(p.precio);
      const cumplePrecio = precioNum <= precioMax;
      const cumpleCategoria =
        categoriasSeleccionadas.length === 0 ||
        (p.categoria?.id !== undefined && categoriasSeleccionadas.includes(p.categoria.id));
      return cumplePrecio && cumpleCategoria;
    });
    setProductosFiltrados(filtrados);
  }, [precioMax, categoriasSeleccionadas, productos]);

  const handleEliminar = async (id: number, nombre: string) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar "${nombre}"?`)) {
      try {
        await deleteProducto(id);
        setProductos(prev => prev.filter(p => p.id !== id));
        alert("Producto eliminado con éxito");
      } catch (error) {
        console.error("Error al eliminar:", error);
        alert("No se pudo eliminar el producto");
      }
    }
  };

  const handleToggleCategoria = (id: number) => {
    setCategoriasSeleccionadas(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center font-bold animate-pulse text-2xl">
      Cargando catálogo...
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-gray-900 mt-15">
      <div className="flex max-w-[1500px] mx-auto px-12 py-10 gap-16">
        
        {/* Sidebar */}
        <aside className="w-72 hidden md:block shrink-0">
          {isAdmin && (
            <Link
              to="/nuevo-producto"
              className="flex items-center justify-center gap-3 w-full bg-black text-white py-4 rounded-2xl font-bold text-sm transition-all hover:bg-zinc-800 active:scale-[0.98] shadow-sm mb-10"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              <span>NUEVO PRODUCTO</span>
            </Link>
          )}

          <div className="sticky top-10 p-2">
            <div className="flex items-center gap-3 mb-10 font-bold text-xl">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
              <span>Filtros</span>
            </div>

            <div className="mb-10">
              <div className="flex justify-between items-center mb-6 cursor-pointer" onClick={() => setShowCats(!showCats)}>
                <span className="font-bold text-base uppercase tracking-wider">Categorías</span>
                <svg className={`transition-transform duration-300 ${showCats ? '' : 'rotate-180'}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m18 15-6-6-6 6" /></svg>
              </div>
              {showCats && (
                <div className="space-y-4 ml-1">
                  {categorias.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded-md border-gray-300 accent-black" 
                        checked={categoriasSeleccionadas.includes(cat.id)} 
                        onChange={() => handleToggleCategoria(cat.id)} 
                      />
                      <span className={`text-[15px] ${categoriasSeleccionadas.includes(cat.id) ? 'text-black font-bold' : 'text-gray-500'}`}>{cat.nombre}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="mb-10 border-t border-gray-100 pt-8">
              <div className="flex justify-between items-center mb-8 cursor-pointer" onClick={() => setShowPrecio(!showPrecio)}>
                <span className="font-bold text-base uppercase tracking-wider">Rango de Precio</span>
                <svg className={`transition-transform duration-300 ${showPrecio ? '' : 'rotate-180'}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m18 15-6-6-6 6" /></svg>
              </div>
              {showPrecio && (
                <div>
                  <input type="range" min="0" max="1000000" step="5000" value={precioMax} onChange={(e) => setPrecioMax(Number(e.target.value))} className="w-full h-1 bg-gray-200 accent-black" />
                  <p className="mt-5 text-black font-black text-lg">${precioMax.toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Grid */}
        <main className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
            {productosFiltrados.map((p) => (
              <div key={p.id} className="flex flex-col group h-full">
                <Link to={`/producto/${p.id}`} className="block mb-4">
                  <div className="aspect-square w-full h-[320px] bg-[#f8f8f8] rounded-[2.5rem] flex items-center justify-center p-10 relative overflow-hidden transition-all group-hover:bg-[#f2f2f2]">
                    <img
                      src={`${API_BASE}/api/imagenes/${p.id}`}
                      alt={p.nombre}
                      className="max-w-full max-h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => { (e.currentTarget.src = "https://placehold.co/400x400?text=ElectroHome"); }}
                    />
                  </div>
                </Link>

                <div className="px-2 flex flex-col flex-grow">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-2">{p.categoria?.nombre || 'General'}</p>
                  <Link to={`/producto/${p.id}`}>
                    <h3 className="font-bold text-gray-900 text-xl mb-2 line-clamp-2 h-[3.5rem] leading-tight hover:underline">{p.nombre}</h3>
                  </Link>
                  <p className="text-2xl font-black text-black mb-4">${p.precio?.toLocaleString()}</p>

                  {/* Aquí podrías añadir un botón de "Añadir al carrito" que use onOpenCart() si quisieras */}

                  {isAdmin && (
                    <div className="flex gap-2 mt-auto pt-4 border-t border-gray-100">
                      <Link 
                        to={`/editar-producto/${p.id}`}
                        className="flex-1 bg-gray-100 text-black text-center py-2 rounded-xl text-xs font-bold hover:bg-black hover:text-white transition-colors"
                      >
                        EDITAR
                      </Link>
                      <button 
                        onClick={() => handleEliminar(p.id, p.nombre)}
                        className="flex-1 bg-red-50 text-red-600 py-2 rounded-xl text-xs font-bold hover:bg-red-600 hover:text-white transition-colors"
                      >
                        ELIMINAR
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
      <Footer/>
    </div>
  );
}

export default HomeElectri;