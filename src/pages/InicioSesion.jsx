import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/inicioSesion.css";

const EMAIL_RX = /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
const USERS_KEY = "usuarios_v1";
const SESSION_KEY = "session_user";

const getUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
};

export default function InicioSesion() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [errors, setErrors] = useState({ email: "", pass: "" });
  const [isValid, setIsValid] = useState(false);
  const [authMsg, setAuthMsg] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | ok | error

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;

    setStatus("loading");
    setAuthMsg("Iniciando sesión...");

    const users = getUsers();
    // Buscar con las mismas llaves que guarda Registro.jsx
    const found = users.find(
      (u) =>
        (u?.correo || "").toLowerCase() === email.toLowerCase() &&
        String(u?.pass) === String(pass)
    );

    if (!found) {
      setStatus("error");
      setAuthMsg("Credenciales inválidas ❌");
      return;
    }

    const nombre =
      found.nombre ??
      found.nombreCompleto ??
      found.nombreComercial ??
      "Usuario";

    // Guardar sesión
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        id: found.id ?? null,
        nombre,
        email: found.correo,
      })
    );

    // Notificar a la app (mismo tab) que cambió la sesión
    window.dispatchEvent(new Event("session-updated"));

    setStatus("ok");
    setAuthMsg("Inicio de sesión exitoso ✅ Redirigiendo...");

    setTimeout(() => navigate("/"), 1500);
  };

  // === MISMO HTML/CSS ===
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
