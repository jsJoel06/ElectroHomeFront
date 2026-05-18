import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from "react";

import HomeElectri from "./Pages/HomeElectri";
import AddForm from "./components/AddForm";
import Auth from "./components/auth/Auth";
import DetalleProducto from "./components/DetalleProducto";
import Carrito from "./components/Carrito";
import Pago from "./components/Pagos";
import Header from "./components/Header";
import Pedidos from "./components/Pedidos";
import DashboardAdmin from "./Pages/DashboardAdmin";
import CategoriaCard from "./components/CategoriaCard";
import AddCategoria from "./components/AddCategoria";
import Nosotros from "./components/Nosotros";
                                                                                                        
function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const abrirCarrito = () => setIsCartOpen(true);
  const cerrarCarrito = () => setIsCartOpen(false);

  return (
    <BrowserRouter>
      {/* El Carrito puede seguir siendo global si lo necesitas */}
      <Carrito isOpen={isCartOpen} onClose={cerrarCarrito} />

      <Routes>
        {/* RUTA SIN HEADER */}
        <Route path="/auth" element={<Auth />} />

        {/* RUTAS CON HEADER (Agrupadas) */}
        <Route
          path="/*"
          element={
            <>
              <Header onOpenCart={abrirCarrito} />
              <main>
                <Routes>
                  <Route path="/" element={<HomeElectri />} />

                  <Route path="/pedidos" element={<Pedidos />} />
                  <Route path="/catalogo" element={<CategoriaCard />} />
                  <Route
                    path="/producto/:id"
                    element={<DetalleProducto onOpenCart={abrirCarrito} />}
                  />

                   <Route path="/nosotros" element={<Nosotros />} />
              
                  <>
                    <Route path="/admin/dashboard" element={<DashboardAdmin />} />
                  </>
                     <Route path="/nueva-categoria" element={<AddCategoria />} />
                  <Route path="/pago" element={<Pago />} />
                </Routes>
              </main>
            </>
          }
        />
        <Route path="/nuevo-producto" element={<AddForm />} />
        <Route path="/editar-producto/:id" element={<AddForm />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App