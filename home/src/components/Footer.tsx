import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand & Newsletter Sutil */}
          <div className="md:col-span-1 space-y-6">
            <h2 className="text-3xl font-black tracking-tighter italic">ELECTROHOME</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 leading-relaxed">
              Equipando hogares inteligentes con tecnología de vanguardia.
            </p>
            <div className="flex gap-4">
              {/* Espacio para redes sociales sutiles */}
              <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-pointer">
                <span className="text-[10px] font-black">IG</span>
              </div>
              <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-pointer">
                <span className="text-[10px] font-black">FB</span>
              </div>
            </div>
          </div>

          {/* Shopping */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-black">Tienda</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">Ver Todo</Link></li>
              <li><Link to="/categorias/linea-blanca" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">Línea Blanca</Link></li>
              <li><Link to="/categorias/tecnologia" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">Tecnología</Link></li>
              <li><Link to="/ofertas" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors italic text-red-400">Ofertas</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-black">Ayuda</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">Envíos</a></li>
              <li><a href="#" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">Garantías</a></li>
              <li><a href="#" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">Contacto</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-black">Legal</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">Privacidad</a></li>
              <li><a href="#" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">Términos</a></li>
              <li><a href="#" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">Cookies</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Métodos de Pago & Copyright */}
        <div className="mt-16 pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 grayscale opacity-50">
            <span className="text-[8px] font-black uppercase tracking-widest">Pagos Seguros:</span>
            {/* Solo texto o iconos muy simples para mantener el estilo */}
            <span className="text-[9px] font-bold">VISA</span>
            <span className="text-[9px] font-bold">MASTER</span>
            <span className="text-[9px] font-bold">PAYPAL</span>
          </div>
          
          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-300 text-center md:text-right">
            © {currentYear} ELECTROHOME RETAIL. ALL RIGHTS RESERVED.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;