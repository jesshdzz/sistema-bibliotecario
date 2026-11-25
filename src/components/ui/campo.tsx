export function Campo({
  etiqueta,
  children,
}: {
  etiqueta: string;
  children: React.ReactNode;
}) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: viene del children
    <label className="fieldset">
      <span className="fieldset-legend">{etiqueta}</span>
      {children}
    </label>
  );
}
