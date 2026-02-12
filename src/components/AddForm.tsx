import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { guardarProducto, actualizarProductos, getById } from "../service/serviceElectriHome";

const API_BASE = 'https://electrohome-847j.onrender.com';

function AddForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false); 
  const [categorias, setCategorias] = useState<any[]>([]);
  
  const [nombre, setNombre] = useState("");
  const [marca, setMarca] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [imagen, setImagen] = useState<File | null>(null);

  useEffect(() => {
    const inicializarFormulario = async () => {
      try {
        setLoadingData(true);
        const resCats = await fetch(`${API_BASE}/api/categorias`);
        const dataCats = await resCats.json();
        setCategorias(dataCats);

        if (id) {
          const p = await getById(Number(id));
          if (p) {
            setNombre(p.nombre || "");
            setMarca(p.marca || "");
            setPrecio(p.precio?.toString() || "");
            setStock(p.stock?.toString() || "");
            setDescripcion(p.descripcion || "");
            const catId = p.categoria?.id || p.categoriaId;
            setCategoriaId(catId?.toString() || "");
          }
        }
      } catch (error) {
        console.error("Error al cargar la información:", error);
      } finally {
        setLoadingData(false);
      }
    };
    inicializarFormulario();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagen && !id) return alert("Por favor selecciona una imagen");
    setLoading(true);

    const productoData = {
      nombre,
      marca,
      precio: parseFloat(precio),
      stock: parseInt(stock),
      descripcion,
      categoria: { id: parseInt(categoriaId) }
    };

    try {
      if (id) {
        await actualizarProductos(parseInt(id), productoData, imagen || undefined);
        alert("¡Producto actualizado con éxito!");
      } else {
        await guardarProducto(productoData, imagen!);
        alert("¡Producto publicado con éxito!");
      }
      navigate("/");
    } catch (error) {
      console.error("Error al procesar:", error);
      alert("Hubo un error al guardar los cambios.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) return (
    <div className="min-h-screen flex items-center justify-center font-black animate-pulse text-gray-400 uppercase tracking-[0.3em]">
      Obteniendo información técnica...
    </div>
  );

  return (
    <div className="min-h-screen bg-white p-6 md:p-12 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        {/* Header Estilo Minimalista */}
        <header className="mb-16 flex items-center justify-between border-b border-gray-100 pb-8">
          <h1 className="text-4xl font-black tracking-tighter italic">ELECTROHOME</h1>
          <Link to="/" className="text-[10px] font-black text-gray-400 hover:text-black transition-all uppercase tracking-[0.3em] border-b-2 border-transparent hover:border-black">
            Volver al catálogo
          </Link>
        </header>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Título de Sección */}
          <div className="flex flex-col gap-2">
            <h2 className="text-4xl font-black tracking-tighter uppercase">{id ? 'Editar' : 'Nuevo'} Producto</h2>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.4em]">Especificaciones de Inventario</p>
          </div>

          {/* Grid Principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Modelo / Nombre</label>
              <input type="text" required value={nombre} onChange={(e) => setNombre(e.target.value)}
                className="w-full bg-gray-50 rounded-[2rem] p-5 font-bold border-2 border-transparent focus:border-black focus:bg-white outline-none transition-all placeholder:text-gray-200" placeholder="Ej. Smart TV 55'" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Marca</label>
              <input type="text" required value={marca} onChange={(e) => setMarca(e.target.value)}
                className="w-full bg-gray-50 rounded-[2rem] p-5 font-bold border-2 border-transparent focus:border-black focus:bg-white outline-none transition-all placeholder:text-gray-200" placeholder="Samsung, Sony, LG..." />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Precio ($)</label>
              <input type="number" required value={precio} onChange={(e) => setPrecio(e.target.value)}
                className="w-full bg-gray-50 rounded-[2rem] p-5 font-bold border-2 border-transparent focus:border-black focus:bg-white outline-none transition-all" placeholder="0.00" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Stock</label>
              <input type="number" required value={stock} onChange={(e) => setStock(e.target.value)}
                className="w-full bg-gray-50 rounded-[2rem] p-5 font-bold border-2 border-transparent focus:border-black focus:bg-white outline-none transition-all" placeholder="Unds." />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Categoría</label>
              <div className="relative">
                <select required value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)}
                  className="w-full bg-gray-50 rounded-[2rem] p-5 font-bold border-2 border-transparent focus:border-black focus:bg-white outline-none transition-all appearance-none cursor-pointer">
                  <option value="">Seleccionar...</option>
                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Características Técnicas</label>
            <textarea rows={4} value={descripcion} onChange={(e) => setDescripcion(e.target.value)}
              className="w-full bg-gray-50 rounded-[2.5rem] p-6 font-bold border-2 border-transparent focus:border-black focus:bg-white outline-none transition-all resize-none" placeholder="Describe el producto..." />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Media / Imagen</label>
            <div className="relative group overflow-hidden border-2 border-dashed border-gray-100 rounded-[3rem] p-12 text-center hover:border-black hover:bg-gray-50 transition-all cursor-pointer">
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10"
                onChange={(e) => setImagen(e.target.files ? e.target.files[0] : null)} />
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                </div>
                <span className="text-[10px] font-black text-gray-400 group-hover:text-black uppercase tracking-widest">
                  {imagen ? imagen.name : (id ? "Click para reemplazar imagen" : "Cargar archivo de imagen")}
                </span>
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-black text-white py-8 rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.4em] hover:bg-zinc-800 transition-all active:scale-[0.97] disabled:bg-gray-200 shadow-2xl shadow-gray-200">
            {loading ? "PROCESANDO SOLICITUD..." : id ? "GUARDAR CAMBIOS TÉCNICOS" : "PUBLICAR EN CATÁLOGO"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddForm;