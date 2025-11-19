import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// 1. IMPORTANTE: Importamos también getUserProfile
import { loginUser, getUserProfile } from "../services/api"; 
import "../styles/inicioSesion.css";

const EMAIL_RX = /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
const SESSION_KEY = "session_user";

export default function InicioSesion() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [errors, setErrors] = useState({ email: "", pass: "" });
  const [isValid, setIsValid] = useState(false);
  const [authMsg, setAuthMsg] = useState("");
  const [status, setStatus] = useState("idle"); 

  const validateEmail = () => {
    if (!email) return "El correo es requerido.";
    if (email.length > 100) return "Máximo 100 caracteres.";
    if (!EMAIL_RX.test(email))
      return "Usa @duoc.cl, @profesor.duoc.cl o @gmail.com.";
    return "";
  };

  const validatePassword = () => {
    if (!pass) return "La contraseña es requerida.";
    if (pass.length < 4) return "Debe tener al menos 4 caracteres."; 
    return "";
  };

  useEffect(() => {
    const emailError = validateEmail();
    const passError = validatePassword();
    setErrors({ email: emailError, pass: passError });
    setIsValid(!emailError && !passError);
    setAuthMsg("");
  }, [email, pass]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    setStatus("loading");
    setAuthMsg("Iniciando sesión...");

    try {
      // PASO 1: Login contra Node.js (Seguridad)
      const data = await loginUser({ correo: email, pass });

      // PASO 2 (NUEVO): Buscar el nombre real en Java usando el email
      let nombreUsuario = data.user.email; // Por defecto usamos el email
      
      try {
          const perfilJava = await getUserProfile(email);
          if (perfilJava && perfilJava.nombre) {
              nombreUsuario = perfilJava.nombre; // ¡Aquí recuperamos el nombre!
          }
      } catch (errorPerfil) {
          console.warn("No se pudo obtener el nombre del usuario:", errorPerfil);
      }

      // PASO 3: Guardar la sesión con el nombre correcto
      const sessionUser = {
        id: data.user.id,
        email: data.user.email, 
        nombre: nombreUsuario, // Ahora sí lleva el nombre real
        token: data.token
      };

      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
      localStorage.setItem("correo", email);

      window.dispatchEvent(new Event("session-updated"));

      setStatus("ok");
      setAuthMsg(`¡Hola ${nombreUsuario}! Redirigiendo...`);

      setTimeout(() => navigate("/"), 1500);

    } catch (error) {
      setStatus("error");
      setAuthMsg(`${error.error || "Error de autenticación"} ❌`);
    }
  };

  return (
    <main className="wrap auth">
      <section className="auth__card" aria-labelledby="titulo-login">
        <div className="auth__head">
          <div className="auth__logo">
            <img src="/IMG/logo/logo.png" alt="TANGANA" />
          </div>
          <h1 id="titulo-login">TANGANA</h1>
          <p className="help">Ingresa con tu correo y contraseña.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="email">Correo</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? "is-invalid" : ""}
            />
            <div className="help">
              Sólo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com
            </div>
            {errors.email && <div className="error">{errors.email}</div>}
          </div>

          <div className="field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className={errors.pass ? "is-invalid" : ""}
            />
            <div className="help">Requerida, mín. 4 caracteres.</div>
            {errors.pass && <div className="error">{errors.pass}</div>}
          </div>

          {authMsg && (
            <div
              className={`auth-msg ${
                status === "ok" ? "ok" : status === "error" ? "error" : ""
              }`}
              style={{ marginTop: 8 }}
            >
              {authMsg}
            </div>
          )}

          <div className="row-btns">
            <button
              type="submit"
              className="btn-primary"
              disabled={!isValid || status === "loading"}
            >
              {status === "loading" ? "Ingresando..." : "Iniciar sesión"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}