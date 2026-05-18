
import { Shield, Zap, Star, Globe, ArrowRight } from 'lucide-react';

const Nosotros = () => {
  const hitos = [
    { 
      icono: <Shield size={28} />, 
      titulo: "SEGURIDAD", 
      desc: "Protocolos de protección de datos y garantías extendidas en cada equipo." 
    },
    { 
      icono: <Zap size={28} />, 
      titulo: "EFICIENCIA", 
      desc: "Curamos nuestro catálogo buscando el menor consumo energético posible." 
    },
    { 
      icono: <Star size={28} />, 
      titulo: "EXCLUSIVIDAD", 
      desc: "Acceso anticipado a los últimos lanzamientos de tecnología global." 
    },
    { 
      icono: <Globe size={28} />, 
      titulo: "ALCANCE", 
      desc: "Red de distribución logística con cobertura en todo el territorio nacional." 
    }
  ];

  return (
    <section className="bg-white text-black py-24 px-6 md:px-12 overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        
        {/* --- CABECERA --- */}
        <div className="border-b border-black pb-12 mb-20 flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="max-w-2xl">
            <span className="text-xs font-bold tracking-[0.4em] uppercase mb-4 block text-gray-500">
              Est. 2026 — ElectroHome
            </span>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-none uppercase">
              REDEFINIENDO EL <br /> 
              <span className="text-gray-300">CONFORT.</span>
            </h2>
          </div>
          <div className="max-w-xs">
            <p className="text-sm font-bold leading-relaxed text-gray-600 uppercase tracking-wider">
              No vendemos máquinas. Entregamos las herramientas que transforman tu espacio en un centro de innovación y descanso.
            </p>
          </div>
        </div>

        {/* --- CONTENIDO PRINCIPAL --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-32">
          
          {/* Imagen con Estilo Editorial */}
          <div className="lg:col-span-7 relative group">
            <div className="aspect-[16/9] bg-black overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 ease-in-out">
              <img 
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070" 
                alt="Arquitectura Minimalista" 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-black text-white p-8 hidden md:block">
              <p className="text-4xl font-black italic">"Simplicity is the <br/> ultimate sophistication."</p>
            </div>
          </div>

          {/* Texto de Misión */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-8">
            <h3 className="text-2xl font-black uppercase tracking-tight">Nuestra Filosofía</h3>
            <p className="text-xl text-gray-800 font-medium leading-relaxed">
              En ElectroHome, la estética y la funcionalidad no son negociables. Hemos creado un ecosistema donde la tecnología de punta se encuentra con el diseño minimalista.
            </p>
            <p className="text-gray-500 leading-relaxed">
              Nuestra misión es simple: eliminar la fricción de la vida cotidiana. Cada producto en nuestro catálogo ha pasado por un riguroso proceso de selección basado en tres pilares: durabilidad estética, rendimiento técnico y facilidad de uso.
            </p>
            <button className="flex items-center gap-4 group font-black uppercase tracking-widest text-sm border-b-2 border-black w-fit pb-2 hover:gap-8 transition-all">
              Saber más sobre nosotros <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* --- GRID DE VALORES (BLANCO Y NEGRO) --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-black border border-black">
          {hitos.map((hito, idx) => (
            <div 
              key={idx} 
              className="bg-white p-12 hover:bg-black hover:text-white transition-colors duration-500 group"
            >
              <div className="mb-8 group-hover:scale-110 transition-transform duration-500">
                {hito.icono}
              </div>
              <h4 className="text-sm font-black tracking-[0.2em] mb-4 uppercase">{hito.titulo}</h4>
              <p className="text-xs leading-loose font-bold tracking-wide uppercase opacity-60 group-hover:opacity-100">
                {hito.desc}
              </p>
            </div>
          ))}
        </div>

        {/* --- FOOTER DE SECCIÓN --- */}
        <div className="mt-32 text-center border-t border-gray-100 pt-20">
          <h4 className="text-[10vw] font-black text-gray-50 opacity-10 select-none leading-none">
            ELECTROHOME
          </h4>
        </div>
      </div>
    </section>
  );
};

export default Nosotros;