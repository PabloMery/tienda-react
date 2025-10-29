
export function productMainImage(product) {
  const p = product?.images?.[0];
  if (!p) return "/IMG/placeholder.png"; // crea este placeholder si quieres
  return p.startsWith("/") ? p : `/${p}`;
}
