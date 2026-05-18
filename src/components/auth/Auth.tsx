import React, { useState } from "react";
import { postLogin, PostRegister } from "../../service/authService";
import { useNavigate } from "react-router-dom";

interface LoginResponse {
  authenticated: boolean;
  name: string;
  authorities: { authority: string }[];
  principal: {
    id: number;
    email: string;
  };
}

function Auth() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const response: LoginResponse = await postLogin(email, password);
        const role = response.authorities[0]?.authority || "USER";
        localStorage.setItem('authority', role);
        localStorage.setItem('email', response.name); 
        localStorage.setItem('password', password);
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/');
      } else {
        await PostRegister(email, password);
        alert("¡Cuenta creada! Ahora puedes explorar nuestra colección.");
        setIsLogin(true);
      }
    } catch (error) {
      alert("Credenciales incorrectas. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      
      {/* SECCIÓN IZQUIERDA: Visual/Brand (Oculta en móviles) */}
      <div className="hidden md:flex md:w-1/2 bg-[#f4f4f4] items-center justify-center p-20">
        <div className="max-w-md">
          <h2 className="text-6xl font-black tracking-tighter leading-none mb-6">
            LA MEJOR <br /> TECNOLOGÍA <br /> PARA TU HOGAR.
          </h2>
          <p className="text-gray-400 font-medium text-lg leading-relaxed">
            Únete a nuestra comunidad y accede a lanzamientos exclusivos y envíos prioritarios.
          </p>
          <div className="mt-12 flex gap-4">
             <div className="w-12 h-1 bg-black"></div>
             <div className="w-12 h-1 bg-gray-200"></div>
             <div className="w-12 h-1 bg-gray-200"></div>
          </div>
        </div>
      </div>

      {/* SECCIÓN DERECHA: Formulario */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-sm">
          <header className="mb-12">
            <h1 className="text-2xl font-black tracking-tighter italic mb-2">ELECTROHOME</h1>
            <h3 className="text-4xl font-bold tracking-tight text-gray-900">
              {isLogin ? '¡Hola de nuevo!' : 'Crea tu perfil'}
            </h3>
          </header>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">
                Correo Electrónico
              </label>
              <input 
                type="email"
                value={email}
                placeholder="ejemplo@correo.com"
                className="w-full border-b-2 border-gray-100 py-3 focus:border-black outline-none transition-colors font-bold text-lg placeholder:text-gray-200"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">
                Contraseña
              </label>
              <input 
                type="password"
                value={password}
                placeholder="Tu contraseña secreta"
                className="w-full border-b-2 border-gray-100 py-3 focus:border-black outline-none transition-colors font-bold text-lg placeholder:text-gray-200"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-black text-white py-4 mt-8 font-bold text-xs uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all active:scale-[0.98] disabled:bg-gray-200"
            >
              {loading ? 'Cargando...' : (isLogin ? 'Entrar a la tienda' : 'Empezar ahora')}
            </button>
          </form>

          <footer className="mt-10 pt-6 border-t border-gray-50 flex flex-col gap-4">
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-center text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
            >
              {isLogin ? '¿Nuevo en ElectroHome? Regístrate' : '¿Ya tienes cuenta? Conéctate'}
            </button>
            <button className="text-center text-[10px] text-gray-300 font-bold uppercase tracking-tighter">
              ¿Olvidaste tu contraseña?
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default Auth;