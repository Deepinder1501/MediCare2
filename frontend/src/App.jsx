import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import AdminPanel from "./pages/AdminPanel";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ContactUs from "./pages/ContactUs";
import AboutUs from "./pages/AboutUs"; 
import Profile from "./pages/Profile";
import Reminders from "./pages/Reminders";
import Checkout from "./pages/Checkout";
import OrderHistory from "./pages/OrderHistory";
import ScrollToTop from "./components/ScrollToTop";

// Protected Route Component
const ProtectedRoute = ({ children, isAdminRequired = false }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (isAdminRequired && role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};

function AppContent() {
  const location = useLocation();
  const isAdminPath = location.pathname === "/admin";

  return (
    <>
      <ScrollToTop />
      {!isAdminPath && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute isAdminRequired={true}>
              <AdminPanel />
            </ProtectedRoute>
          } 
        />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/products" element={<Products/>} />
        <Route 
          path="/cart" 
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } 
        />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<AboutUs />} />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/reminders" 
          element={
            <ProtectedRoute>
              <Reminders />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/checkout" 
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/orders" 
          element={
            <ProtectedRoute>
              <OrderHistory />
            </ProtectedRoute>
          } 
        />
      </Routes>
      {!isAdminPath && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

