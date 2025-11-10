import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import Checkout from "./pages/Checkout";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>

        {/* Admin Panel route */}
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminPanel />} />
           <Route path="/login" element={<Login/>} />
           <Route path="/signup" element={<Signup/>} />
           <Route path="/products" element={<Products/>} />
           <Route path="/cart" element={<Cart/>} />
           <Route path="/product/:id" element={<ProductDetails />} />
           <Route path="/contact" element={<ContactUs />} />
           <Route path="/about" element={<AboutUs />} />
           <Route path="/profile" element={<Profile />} />
           <Route path="checkout" element={<Checkout />} />


      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
