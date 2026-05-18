import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getById } from "../service/serviceElectriHome";
import { Link } from "react-router-dom";

interface Producto {
  id: number; // Cambiado a number para consistencia con la DB
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
}

const API_BASE = 'https://electrohome-847j.onrender.com';

// 1. Agregamos la interfaz para recibir la prop de App.tsx
interface DetalleProps {
  onOpenCart: () => void;
}

function DetalleProducto({ onOpenCart }: DetalleProps) { // 2. Recibimos la prop
  const { id } = useParams<{ id: string }>();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [agregado, setAgregado] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      if (id) {
        try {
          setLoading(true);
          // 3. CORRECCIÓN TS2345: Convertimos el id (string) a number
          const data = await getById(Number(id)); 
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

  const agregarAlCarrito = () => {
    if (!producto) return;

    const carritoGuardado = localStorage.getItem("carrito_compras");
    let carrito: any[] = carritoGuardado ? JSON.parse(carritoGuardado) : [];

    const itemExistente = carrito.find((item) => item.id === producto.id);

    if (itemExistente) {
      carrito = carrito.map((item) =>
        item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
      );
    } else {
      const nuevoItem = {
        ...producto,
        cantidad: 1,
      };
      carrito.push(nuevoItem);
    }

    localStorage.setItem("carrito_compras", JSON.stringify(carrito));

    // 4. Actualizar estado global y abrir el carrito
    window.dispatchEvent(new Event("storage"));
    onOpenCart(); // Esto abre el drawer automáticamente al hacer clic

    setAgregado(true);
    setTimeout(() => setAgregado(false), 2000);
  };

  if (loading) return <div className="flex h-screen items-center justify-center font-bold animate-pulse text-2xl text-center">Cargando producto...</div>;
  if (!producto) return <div className="p-10 text-center">Producto no encontrado.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 pt-32">
      <Link to="/" className="text-[10px] font-black text-gray-400 hover:text-black transition-all uppercase tracking-[0.3em] border-b-2 border-transparent hover:border-black mb-8 inline-block">
        Volver al catálogo
      </Link>
      
      <div className="grid md:grid-cols-2 gap-12">
        <div className="bg-gray-100 rounded-3xl overflow-hidden aspect-square flex items-center justify-center p-8">
          <img 
            src={`${API_BASE}/api/imagenes/${producto.id}`}
            alt={producto.nombre} 
            className="max-w-full max-h-full object-contain mix-blend-multiply"
            onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/600x600?text=ElectroHome"; }}
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