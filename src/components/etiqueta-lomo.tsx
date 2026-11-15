export function EtiquetaLomo({ signatura }: { signatura: string }) {
  return (
    <p
      role="img"
      aria-label={`Signatura ${signatura}`}
      className="w-20 shrink-0 self-start rounded-selector border border-base-300 border-t-4 border-t-primary bg-base-200 px-1.5 py-2 text-center font-mono text-[13px] font-medium leading-snug"
    >
      {signatura.split(" ").map((parte) => (
        <span key={parte} className="block">
          {parte}
        </span>
      ))}
    </p>
  );
}
