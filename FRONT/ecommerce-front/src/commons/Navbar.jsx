import React, { useState } from "react";
import axios from "axios";

import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser, userInitialState } from "../state/user.js";
import { useEffect } from "react";
import "../styles/navbar.css";
import Cart from "../commons/Cart.jsx";
import { setCartVisible } from "../state/cart";
export default function Navbar() {
  const location = useLocation().pathname;
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const visible = useSelector((state) => state.cart.cartVisible);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/users/me", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
        credentials: "include",
      })
      .then((user) => {
        dispatch(setUser(user.data));
      })
      .catch((error) => {
        // console.error("Error de servidor");
      });
  }, []);

  const handleLogout = () => {
    axios
      .post("http://localhost:3000/api/users/logout", null, {
        withCredentials: true,
        credentials: "include",
      })
      .then((user) => {
        dispatch(setUser(userInitialState));
      });
  };

  const cartVisible = () => {
    dispatch(setCartVisible(!visible));
  };
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand text-6xl fontClass">
          {user.name ? `Hola! ${user.name}` : `.trash talk.`}
        </Link>
        <ul className="navbar-links">
          {user.email ? (
            <>
              {user.role == "admin" ? (
                <Link to="/admin">
                  {location == "/admin" ? null : (
                    <button
                      title="Panel de Admin"
                      className="cart-button-container mr-2"
                    >
                      👮‍♂️
                    </button>
                  )}
                </Link>
              ) : null}
              <Link to="/cart-history">
                {location == "/cart-history" ? null : (
                  <button
                    title="Mi Historial de Compras"
                    className="cart-button-container mr-2"
                  >
                    🕔
                  </button>
                )}
              </Link>
              <button
                className="cart-button-container"
                title="Ir al Carrito"
                onClick={cartVisible}
              >
                {visible && <Cart />}
                🛒
              </button>

              <Link onClick={handleLogout} className="navbar-link">
                <li title="Cerrar Sesión">Logout</li>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                <li>Login</li>
              </Link>
              <Link to="/register" className="navbar-link">
                <li>Register</li>
              </Link>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
