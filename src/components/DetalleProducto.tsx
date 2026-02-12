import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getById } from "../service/serviceElectriHome";
import { Link} from "react-router-dom";

interface Producto {
  id: number | string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
}

const API_BASE = 'https://electrohome-847j.onrender.com';

function DetalleProducto() {
  const { id } = useParams<{ id: string }>();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [agregado, setAgregado] = useState(false); // Estado visual temporal

  useEffect(() => {
    const cargar = async () => {
      if (id) {
        try {
          setLoading(true);
          const data = await getById(id);
          setProducto(data);
        } catch (error) {
          console.error("Error al cargar el producto:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    cargar();
  }, [id]);

  // --- FUNCIÓN PARA AGREGAR AL CARRITO ---
  const agregarAlCarrito = () => {
    if (!producto) return;

    // 1. Obtener lo que ya existe en el localStorage
    const carritoGuardado = localStorage.getItem("carrito_compras");
    let carrito: any[] = carritoGuardado ? JSON.parse(carritoGuardado) : [];

    // 2. Verificar si el producto ya está en el carrito
    const itemExistente = carrito.find((item) => item.id === producto.id);

    if (itemExistente) {
      // Si existe, aumentamos la cantidad
      carrito = carrito.map((item) =>
        item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
      );
    } else {
      // Si no existe, lo agregamos con cantidad 1
      // Guardamos también la URL de la imagen para que el carrito la muestre
      const nuevoItem = {
        ...producto,
        cantidad: 1,
        imagenUrl: `${API_BASE}/api/imagenes/${producto.id}` 
      };
      carrito.push(nuevoItem);
    }

    // 3. Guardar de nuevo en LocalStorage
    localStorage.setItem("carrito_compras", JSON.stringify(carrito));

    // 4. DISPARAR EVENTO para que el Header y el Carrito se actualicen automáticamente
    window.dispatchEvent(new Event("storage"));

    // 5. Feedback visual rápido
    setAgregado(true);
    setTimeout(() => setAgregado(false), 2000);
  };

  if (loading) return <div className="p-50flex h-screen items-center justify-center font-bold animate-pulse text-2xl text-center p-80">Cargando producto...</div>;
  if (!producto) return <div className="p-10 text-center">Producto no encontrado.</div>;

  return (
    
    <div className="max-w-4xl mx-auto p-6 md:pt-32">
         <Link to="/" className="text-[10px] font-black text-gray-400 hover:text-black transition-all uppercase tracking-[0.3em] border-b-2 border-transparent hover:border-black ml-160">
            Volver al catálogo
          </Link>
      <div className="grid md:grid-cols-2 gap-8">
         
        <div className="bg-gray-100 rounded-3xl overflow-hidden">
          <img 
            src={`${API_BASE}/api/imagenes/${producto.id}`}
            alt={producto.nombre} 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-black uppercase tracking-tighter mb-4">
            {producto.nombre}
          </h1>
          <p className="text-gray-500 mb-6 text-sm leading-relaxed">
            {producto.descripcion}
          </p>
          <div className="text-2xl font-black mb-8">
            ${producto.precio.toLocaleString()}
          </div>
          
          <button 
            onClick={agregarAlCarrito}
            className={`${
              agregado ? "bg-green-600" : "bg-black"
            } text-white py-4 rounded-2xl font-bold uppercase text-xs tracking-widest hover:opacity-80 transition-all active:scale-95`}
          >
            {agregado ? "¡Añadido!" : "Añadir al carrito"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetalleProducto;