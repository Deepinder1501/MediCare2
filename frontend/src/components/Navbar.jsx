// // import React, { useState, useEffect } from "react";
// // import { Link, useNavigate } from "react-router-dom";
// // import { FaShoppingCart } from "react-icons/fa";
// // import "./Navbar.css";

// // function Navbar() {
// //   const [isLoggedIn, setIsLoggedIn] = useState(false);
// //   const [username, setUsername] = useState("");
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     const token = localStorage.getItem("token");
// //     const storedUsername = localStorage.getItem("username");
// //     if (token) {
// //       setIsLoggedIn(true);
// //       setUsername(storedUsername || "User");
// //     } else {
// //       setIsLoggedIn(false);
// //     }
// //   }, []);

// //   const handleLogout = () => {
// //     localStorage.removeItem("token");
// //     localStorage.removeItem("username");
// //     setIsLoggedIn(false);
// //     navigate("/login");
// //   };

// //   return (
// //     <nav className="navbar">
// //       <div className="navbar-left">
// //         <Link to="/" className="navbar-logo">MediCare</Link>
// //         <Link to="/">Home</Link>
// //         <Link to="/products">Products</Link>
// //         <Link to="/contact">Contact Us</Link>
// //         <Link to="/about">About Us</Link>
// //       </div>
// //       <div className="navbar-right">
// //         {!isLoggedIn ? (
// //           <>
// //             <Link to="/cart" className="btn"><FaShoppingCart style={{ marginRight: "5px" }} />Cart</Link>
// //             <Link to="/login" className="btn">Login</Link>
// //             <Link to="/signup" className="btn btn-primary">Sign Up</Link>
// //           </>
// //         ) : (
// //           <>
// //             <span className="navbar-user">Hi, {username}</span>
// //             <Link to="/cart" className="btn"><FaShoppingCart style={{ marginRight: "5px" }} />Cart</Link>
// //             <button onClick={handleLogout} className="btn btn-primary">Logout</button>
// //           </>
// //         )}
// //       </div>
// //     </nav>
// //   );
// // }

// // export default Navbar;







import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import "./Navbar.css";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    if (token) {
      setIsLoggedIn(true);
      setUsername(storedUsername || "User");
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">MediCare</Link>
      </div>
      <div className="navbar-center">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/contact">Contact Us</Link>
        <Link to="/about">About Us</Link>
      </div>
      <div className="navbar-right">
        {!isLoggedIn ? (
          <>
            <Link to="/cart" className="btn"><FaShoppingCart style={{ marginRight: "5px" }} />Cart</Link>
            <Link to="/login" className="btn">Login</Link>
            <Link to="/signup" className="btn btn-primary">Sign Up</Link>
          </>
        ) : (
          <>
            <Link to="/profile" className="btn"><span className="navbar-user">Hi, {username}</span></Link>
            <Link to="/cart" className="btn"><FaShoppingCart style={{ marginRight: "5px" }} />Cart</Link>
            <button onClick={handleLogout} className="btn btn-primary">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;









