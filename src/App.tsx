import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import { Navbar } from "./components/layout/Navbar";
import { Home } from "./pages/Home";
import { Login } from "./pages/admin/Login";
import { Catalog } from "./pages/Catalog";
import { ProductDetail } from "./features/products/components/ProductDetail";

import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { AdminLayout } from "./pages/admin/AdminLayout";
// import { useAuth } from "./context/AuthContext"; // Agregar un boton de Cerrar Sesion.-
import { FavoritesProvider } from "./context/FavoritesContext";
import { CartProvider } from "./context/CartContext";
import { Checkout } from "./pages/Checkout";
import { OrderProvider } from "./context/OrderContext";
import { MyOrders } from "./pages/MyOrders";

function App() {

  return (
    <AuthProvider>

      <FavoritesProvider>
        <CartProvider>
          <OrderProvider>
            <BrowserRouter>
              <Routes>

                {/* Rutas Públicas.- */}
                <Route
                  element={
                    <>
                      <Navbar />
                      <Outlet />
                    </>
                  }
                >
                  {/* Rutas que estaran en el Navbar.- */}
                  <Route path="/" element={<Home />} />
                  <Route path="/catalog" element={<Catalog />} />
                  <Route path="/catalog/:id" element={<ProductDetail />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/my-orders" element={<MyOrders />} />
                </Route>

                {/* Ruta para el Login.- */}
                <Route path="/login" element={<Login />} />

                {/* Rutas Protegidas de Administración.- */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/admin" element={<AdminLayout />}>

                    {/* 'Index' hace se que renderice esto por defecto cuando se entra a '/admin'.- */}
                    <Route index element={<AdminDashboard />} />
                    {/* En un futuro, rutas como '/admin/orders'; '/admin/user'; etc.- */}
                  </Route>
                </Route>

              </Routes>
            </BrowserRouter>
          </OrderProvider>
        </CartProvider>
      </FavoritesProvider>
    </AuthProvider>
  )
}

export default App
