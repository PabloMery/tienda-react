import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// --- INICIO DE LA MODIFICACIÓN (1/3): Se añade la importación de la API ---
import { iniciarSesion } from "../services/api";
import "../styles/inicioSesion.css";

const EMAIL_RX = /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
// --- INICIO DE LA MODIFICACIÓN (2/3): Se eliminan estas constantes y funciones ---
// const USERS_KEY = "usuarios_v1"; // Ya no se necesita
const SESSION_KEY = "session_user";

// La función getUsers() ya no es necesaria porque la validación se hace en el backend
// const getUsers = () => { ... };

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
    if (pass.length < 4 || pass.length > 10)
      return "Debe tener entre 4 y 10 caracteres.";
    return "";
  };

  useEffect(() => {
    const emailError = validateEmail();
    const passError = validatePassword();
    setErrors({ email: emailError, pass: passError });
    setIsValid(!emailError && !passError);
    setAuthMsg("");
  }, [email, pass]);

  // --- INICIO DE LA MODIFICACIÓN (3/3): Se reemplaza la función handleSubmit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    setStatus("loading");
    setAuthMsg("Iniciando sesión...");

    try {
      // 1. Llama a la API con las credenciales para que las valide en el backend
      const usuarioLogueado = await iniciarSesion({ correo: email, pass });

      // 2. Si la API responde exitosamente, guarda la sesión del usuario
      //    con los datos que devolvió el servidor.
      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
          id: usuarioLogueado.id,
          nombre: usuarioLogueado.nombre,
          email: usuarioLogueado.correo,
        })
      );

      window.dispatchEvent(new Event("session-updated"));

      setStatus("ok");
      setAuthMsg("Inicio de sesión exitoso ✅ Redirigiendo...");

      setTimeout(() => navigate("/"), 1500);

    } catch (error) {
      // 3. Si la API devuelve un error (ej: 401 Unauthorized),
      //    se muestra el mensaje de error que definimos en api.js.
      setStatus("error");
      setAuthMsg(`${error.message} ❌`);
    }
  };

  return (
    // El JSX del return no necesita ningún cambio
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
              (máx. 100).
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
            <div className="help">Requerida, entre 4 y 10 caracteres.</div>
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