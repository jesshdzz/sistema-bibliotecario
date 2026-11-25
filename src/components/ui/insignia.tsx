const COLORES = {
  primary: "badge-primary",
  secondary: "badge-secondary",
  accent: "badge-accent",
  info: "badge-info",
  success: "badge-success",
  warning: "badge-warning",
  error: "badge-error",
  ghost: "badge-ghost",
} as const;

export function Insignia({
  color = "ghost",
  className = "",
  children,
}: {
  color?: keyof typeof COLORES;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`badge ${COLORES[color]} badge-sm shrink-0 whitespace-nowrap ${className}`.trim()}
    >
      {children}
    </span>
  );
}
