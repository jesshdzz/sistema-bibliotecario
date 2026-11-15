"use client";

const CLARO = "biblioteca-light";
const OSCURO = "biblioteca-dark";

/** Alterna el tema y lo guarda en `localStorage` */
export function BotonTema() {
  function alternar() {
    const raiz = document.documentElement;
    const actual =
      raiz.dataset.theme ??
      (matchMedia("(prefers-color-scheme: dark)").matches ? OSCURO : CLARO);
    const nuevo = actual === OSCURO ? CLARO : OSCURO;
    raiz.dataset.theme = nuevo;
    try {
      localStorage.setItem("tema", nuevo);
    } catch {}
  }
  return (
    <button
      type="button"
      onClick={alternar}
      aria-label="Cambiar entre tema claro y oscuro"
      title="Cambiar tema"
      className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-field hover:bg-current/15"
    >
      <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
        <circle
          cx="12"
          cy="12"
          r="8.25"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="M12 3.75a8.25 8.25 0 0 1 0 16.5z" fill="currentColor" />
      </svg>
    </button>
  );
}
