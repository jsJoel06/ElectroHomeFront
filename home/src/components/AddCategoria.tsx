import React, { useState } from 'react';
import { saveCategoria } from "../service/categoriaService";

function AddCategoria() {
  // Estado para capturar el nombre
  const [nombre, setNombre] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue

    if (!nombre.trim()) {
      alert("Por favor, escribe un nombre para la categoría");
      return;
    }

    try {
      setLoading(true);
      // Creamos el objeto categoría (puedes añadir ID si fuera edición)
      const nuevaCategoria = { nombre };
      
      await saveCategoria(nuevaCategoria);
      
      alert("Categoría guardada con éxito");
      setNombre(""); // Limpiamos el campo
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Hubo un error al guardar la categoría");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white p-10 rounded-[2rem] shadow-xl w-full max-w-md"
      >
        <h2 className="text-2xl font-black uppercase tracking-tighter mb-6">
          Nueva Categoría<span className="text-gray-300">.</span>
        </h2>

        <div className="flex flex-col gap-2 mb-6">
          <label htmlFor="nombre" className="text-xs font-black uppercase tracking-widest text-gray-400">
            Nombre de la Categoría
          </label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. Refrigeración"
            className="w-full border-b-2 border-gray-100 py-3 focus:border-black outline-none transition-colors font-bold"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all 
            ${loading ? 'bg-gray-200 text-gray-400' : 'bg-black text-white hover:bg-zinc-800 active:scale-95'}`}
        >
          {loading ? 'Guardando...' : 'Guardar Categoría'}
        </button>
      </form>
    </div>
  );
}

export default AddCategoria;