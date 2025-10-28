import { createContext, useContext, useMemo } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

// Estructura persistida:
// { fullName: string, email?: string, completedAt?: string }
const RegistroContext = createContext(null);

export function RegistroProvider({ children }) {
  const [registro, setRegistro] = useLocalStorage("registro", {
    fullName: "",
    email: "",
    completedAt: null,
  });

  const value = useMemo(() => {
    const fullName = (registro?.fullName || "").trim();
    const email = registro?.email || "";
    const isRegistered = Boolean(fullName && registro?.completedAt);

    return {
      fullName,
      email,
      isRegistered,
      setRegistro: (data) => setRegistro((prev) => ({ ...prev, ...data })),
      completeRegistro: (data = {}) =>
        setRegistro((prev) => ({
          ...prev,
          ...data,
          completedAt: new Date().toISOString(),
        })),
      logoutRegistro: () =>
        setRegistro({ fullName: "", email: "", completedAt: null }),
    };
  }, [registro, setRegistro]);

  return (
    <RegistroContext.Provider value={value}>{children}</RegistroContext.Provider>
  );
}

export function useRegistro() {
  const ctx = useContext(RegistroContext);
  if (!ctx) throw new Error("useRegistro debe usarse dentro de <RegistroProvider>");
  return ctx;
}
