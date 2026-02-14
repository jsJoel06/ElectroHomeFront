import { FiShoppingCart, FiMenu, FiX, FiSearch } from "react-icons/fi";
import { CiUser, CiLogout } from "react-icons/ci";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { postLogout } from "../service/authService";

interface AuthState {
    isAuthenticated: boolean;
    userEmail: string | null;
}

interface HeaderProps {
    onOpenCart: () => void;
}

function Header({ onOpenCart }: HeaderProps) {
    
    const [isScrolled, setIsScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    const [auth, setAuth] = useState<AuthState>({
        isAuthenticated: localStorage.getItem("isAuthenticated") === "true",
        userEmail: localStorage.getItem("email"),
    });

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

 const handleLogout = async () => {
    // 1. Cerramos los menús visuales
    setMenuOpen(false);
    setMobileNavOpen(false);

    // 2. Limpiamos el almacenamiento local
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("email");

    // 3. Actualizamos el estado local (opcional si vas a refrescar, pero es buena práctica)
    setAuth({ isAuthenticated: false, userEmail: null });

    try {
        // 4. Intentamos notificar al backend
        await postLogout();
    } catch (error) {
        console.error("Error en logout:", error);
    }

    // 5. REFRESCAR Y REDIRIGIR
    // Esto fuerza al navegador a recargar la página en la ruta de inicio
    window.location.href = "/"; 
};
    return (
        <>
            <header className={`fixed top-0 w-full z-50 bg-white transition-all ${isScrolled ? "shadow-sm h-16" : "h-20"}`}>
                <div className="flex items-center px-4 md:px-10 h-full max-w-7xl mx-auto">

                    {/* IZQUIERDA */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <button onClick={() => setMobileNavOpen(true)} className="md:hidden p-2">
                            <FiMenu size={22} />
                        </button>

                        <Link to="/" className="flex items-center gap-2">
                            <div className="bg-black text-white w-9 h-9 flex items-center justify-center font-black rounded-xl">E</div>
                            <span className="hidden sm:block font-black text-lg">ElectroHome</span>
                        </Link>
                    </div>

                    {/* CENTRO (Escritorio) */}
                    <nav className="hidden md:flex flex-1 justify-center gap-8 text-[11px] font-black uppercase tracking-widest">
                        <Link to="/" className="hover:text-gray-500">Inicio</Link>
                        <Link to="/catalogo" className="hover:text-gray-500">Catálogo</Link>
                        <Link to="/nosotros" className="hover:text-gray-500">Nosotros</Link>
                        <Link to="/pedidos" className="hover:text-gray-500">Pedidos</Link>
                    </nav>

                    {/* DERECHA */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="hidden md:flex items-center gap-2 border rounded-full px-4 py-2 text-sm text-gray-500">
                            <FiSearch size={16} />
                            <input type="text" placeholder="Buscar productos" className="outline-none bg-transparent w-40" />
                        </div>

                        <button 
                            onClick={onOpenCart} 
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Abrir carrito"
                        >
                            <FiShoppingCart size={20} />
                        </button>

                        <div className="relative">
                            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-full hover:bg-gray-100">
                                <CiUser size={22} />
                            </button>

                            {menuOpen && (
                                <div className="absolute right-0 mt-3 w-64 bg-white shadow-xl rounded-2xl p-4 z-50 border border-gray-100">
                                    <p className="text-xs font-bold mb-3">{auth.isAuthenticated ? auth.userEmail : "Invitado"}</p>
                                    {auth.isAuthenticated ? (
                                        <>
                                            <Link to="/perfil" onClick={() => setMenuOpen(false)} className="block py-2 text-sm hover:translate-x-1 transition-transform">Mi Perfil</Link>
                                            <button onClick={handleLogout} className="flex items-center gap-2 py-2 text-sm text-red-500 w-full font-bold"><CiLogout /> Cerrar sesión</button>
                                        </>
                                    ) : (
                                        <Link to="/auth" onClick={() => setMenuOpen(false)} className="block text-center py-2 bg-black text-white rounded-xl text-sm font-bold">Iniciar sesión</Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* MENÚ MÓVIL ACTUALIZADO */}
            {mobileNavOpen && (
                <div className="fixed inset-0 z-[100] bg-white p-6 md:hidden animate-in slide-in-from-left duration-300">
                    <div className="flex justify-between items-center mb-10">
                        <div className="bg-black text-white w-9 h-9 flex items-center justify-center font-black rounded-xl">E</div>
                        <button onClick={() => setMobileNavOpen(false)} className="p-2 bg-gray-100 rounded-full">
                            <FiX size={24} />
                        </button>
                    </div>
                    
                    <nav className="flex flex-col gap-6 text-2xl font-black uppercase">
                        <Link to="/" onClick={() => setMobileNavOpen(false)}>Inicio</Link>
                        <Link to="/catalogo" onClick={() => setMobileNavOpen(false)}>Catálogo</Link>
                        <Link to="/nosotros" onClick={() => setMobileNavOpen(false)}>Nosotros</Link>
                        {/* Se agrega Pedidos aquí para que aparezca en el móvil */}
                        <Link to="/pedidos" onClick={() => setMobileNavOpen(false)}>Pedidos</Link>
                    </nav>

                </div>
            )}

            {/* OVERLAY */}
            {(menuOpen || mobileNavOpen) && (
                <div className="fixed inset-0 z-40 bg-black/5" onClick={() => { setMenuOpen(false); setMobileNavOpen(false); }} />
            )}
        </>
    );
}

export default Header;