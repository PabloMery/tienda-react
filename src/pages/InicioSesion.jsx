import React, { useState, useEffect } from "react";
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
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [authMsg, setAuthMsg] = useState("");

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

    const users = getUsers();
    const user = users.find(
      (u) => (u.correo || "").toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      setAuthMsg("Usuario no registrado.");
      return;
    }

    if (user.pass !== pass) {
      setAuthMsg("Contraseña incorrecta.");
      return;
    }

    try {
      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
          correo: user.correo,
          nombre: user.nombre,
          loginAt: Date.now(),
        })
      );
    } catch {}

    setAuthMsg("Inicio de sesión exitoso ✅");
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
                /exitoso|✅/i.test(authMsg) ? "ok" : "error"
              }`}
              style={{ marginTop: 8 }}
            >
              {authMsg}
            </div>
          )}

          <div className="row-btns">
            <button type="submit" className="btn-primary" disabled={!isValid}>
              Iniciar sesión
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
