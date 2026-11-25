const TONOS = {
  info: "alert-info",
  success: "alert-success",
  warning: "alert-warning",
  error: "alert-error",
} as const;

export function Alerta({
  tono,
  className = "",
  children,
}: {
  tono: keyof typeof TONOS;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      role={tono === "error" ? "alert" : "status"}
      className={`alert ${TONOS[tono]} ${className}`.trim()}
    >
      <span>{children}</span>
    </div>
  );
}
