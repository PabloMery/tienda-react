export function money(n) {
try { return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n||0); }
catch { return `$${(n||0).toLocaleString('es-CL')}`; }
}