/* ============================================================
   AndreaOS — Configuración de Supabase
   ------------------------------------------------------------
   Estos datos son PÚBLICOS por diseño (la clave "publishable"
   está pensada para vivir en el frontend). La seguridad real la
   da Row Level Security en la base: cualquiera puede LEER la
   galería, pero solo la cuenta admin puede escribir.
   ============================================================ */
window.SUPA = {
  url: "https://ibxqhgwyqqzczsxxjsyh.supabase.co",
  key: "sb_publishable_jvCzsZ3y7VnR6-M5bm4rYQ_m4WL8ReS",
  bucket: "portfolio",
  table: "portfolio_gallery",
  adminId: "e65df7a9-322e-4801-b70b-9d504460948c", // uid de andreamperezp31@gmail.com
};
