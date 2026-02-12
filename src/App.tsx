import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from "react";

import HomeElectri from "./Pages/HomeElectri";
import AddForm from "./components/AddForm";
import Auth from "./components/auth/Auth";
import DetalleProducto from "./components/DetalleProducto";
import Carrito from "./components/Carrito";
import Pago from "./components/Pagos";
import Header from "./components/Header"; // 1. Asegúrate de importar el Header

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Funciones de control claras
  const abrirCarrito = () => setIsCartOpen(true);
  const cerrarCarrito = () => setIsCartOpen(false);

  return (
    <BrowserRouter>
      {/* 2. El Header debe estar AQUÍ para que sea global y reciba la función */}
      <Header onOpenCart={abrirCarrito} />

      {/* 3. El Carrito global */}
      <Carrito
        isOpen={isCartOpen}
        onClose={cerrarCarrito}
      />

      <main>
        <Routes>
          <Route
            path="/"
            element={<HomeElectri />}
          />
          <Route path="/auth" element={<Auth />} />
          <Route path="/nuevo-producto" element={<AddForm />} />
          <Route path="/editar-producto/:id" element={<AddForm />} />
          <Route
            path="/producto/:id"
            element={<DetalleProducto onOpenCart={abrirCarrito} />}
          />
          <Route path="/pago" element={<Pago />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;