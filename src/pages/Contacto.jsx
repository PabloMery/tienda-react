import React, { useState, useEffect } from "react";
import "../styles/contacto.css";
import logo from "../../public/IMG/logo/logo.png";

function Contacto() {
  // ================= ESTADOS =================
  const [fullname, setFullname] = useState(localStorage.getItem("fullname") || "");
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [message, setMessage] = useState(localStorage.getItem("message") || "");

  const [errorFullname, setErrorFullname] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // ================= VALIDAR AL CARGAR =================
  useEffect(() => {
    validateFullname(fullname);
    validateEmail(email);
    validateMessage(message);
  }, []); // Solo una vez, al montar

  // ================= GUARDAR EN localStorage =================
  useEffect(() => {
    localStorage.setItem("fullname", fullname);
  }, [fullname]);

  useEffect(() => {
    localStorage.setItem("email", email);
  }, [email]);

  useEffect(() => {
    localStorage.setItem("message", message);
  }, [message]);

  // ================= VALIDACIONES =================
  const validateFullname = (value) => {
    if (value.length > 100) {
      setErrorFullname("El nombre debe tener menos de 100 caracteres.");
    } else {
      setErrorFullname("");
    }
  };

  const validateEmail = (value) => {
    const atIndex = value.indexOf("@");
    const valido =
      value.endsWith("@gmail.com") ||
      value.endsWith("@duoc.cl") ||
      value.endsWith("@profesor.duoc.cl");

    if (value.length === 0) {
      setErrorEmail("");
    } else if (value.length > 100 || atIndex <= 0) {
      setErrorEmail(
        "El correo no puede superar 100 caracteres y debe tener al menos un caracter antes de @."
      );
    } else if (!valido) {
      setErrorEmail(
        "El correo debe terminar en @gmail.com, @duoc.cl o @profesor.duoc.cl"
      );
    } else {
      setErrorEmail("");
    }
  };

  const validateMessage = (value) => {
    if (value.length > 500) {
      setErrorMessage("El contenido debe tener menos de 500 caracteres.");
    } else {
      setErrorMessage("");
    }
  };

  // ================= HANDLERS =================
  const handleFullnameChange = (e) => {
    const value = e.target.value;
    setFullname(value);
    validateFullname(value);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  const handleMessageChange = (e) => {
    const value = e.target.value;
    setMessage(value);
    validateMessage(value);
  };

  // ================= SUBMIT =================
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!errorFullname && !errorEmail && !errorMessage && fullname && email && message) {
      alert("Formulario enviado correctamente");

      // Limpiar almacenamiento
      localStorage.removeItem("fullname");
      localStorage.removeItem("email");
      localStorage.removeItem("message");

      // Limpiar campos
      setFullname("");
      setEmail("");
      setMessage("");
    } else {
      alert("Revisa los campos antes de enviar.");
    }
  };

  return (
    <div>
      <main>
        <div className="wrap">
          <section className="text-center my-4">
            <img src={logo} alt="Logo de Tangana" style={{ maxWidth: "220px" }} />
            <h1 className="h3 h-md1 fw-bold">TANGANA</h1>
          </section>

          <section aria-labelledby="contact-title">
            <div className="contact-wrap" role="form">
              <div className="contact-header" id="contact-title">
                FORMULARIO DE CONTACTOS
              </div>

              <div className="contact-body">
                <form onSubmit={handleSubmit} noValidate>
                  
                  {/* =========== NOMBRE COMPLETO =========== */}
                  <div className="field">
                    <label htmlFor="fullname">NOMBRE COMPLETO</label>
                    <input
                      id="fullname"
                      type="text"
                      className={`form-control ${
                        fullname.length === 0
                          ? ""
                          : errorFullname
                          ? "is-invalid"
                          : "is-valid"
                      }`}
                      placeholder="Ingresa tu nombre completo"
                      value={fullname}
                      onChange={handleFullnameChange}
                      required
                    />
                    {errorFullname && <p className="error-text">{errorFullname}</p>}
                  </div>

                  {/* =========== CORREO =========== */}
                  <div className="field">
                    <label htmlFor="email">CORREO</label>
                    <input
                      id="email"
                      type="email"
                      className={`form-control ${
                        email.length === 0
                          ? ""
                          : errorEmail
                          ? "is-invalid"
                          : "is-valid"
                      }`}
                      placeholder="nombre@ejemplo.com"
                      value={email}
                      onChange={handleEmailChange}
                      required
                    />
                    {errorEmail && (
                      <p id="parrafo_2" className="error-text">
                        {errorEmail}
                      </p>
                    )}
                  </div>

                  {/* =========== CONTENIDO =========== */}
                  <div className="field">
                    <label htmlFor="message">CONTENIDO</label>
                    <textarea
                      id="message"
                      className={`form-control ${
                        message.length === 0
                          ? ""
                          : errorMessage
                          ? "is-invalid"
                          : "is-valid"
                      }`}
                      placeholder="Escribe tu mensaje..."
                      value={message}
                      onChange={handleMessageChange}
                      required
                    />
                    {errorMessage && <p className="error-text">{errorMessage}</p>}
                  </div>

                  {/* =========== BOTÓN =========== */}
                  <div className="btn-row">
                    <button type="submit" className="btn-primary">
                      ENVIAR MENSAJE
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer>
        © {new Date().getFullYear()} Tangana · Todos los derechos reservados
      </footer>
    </div>
  );
}

export default Contacto;