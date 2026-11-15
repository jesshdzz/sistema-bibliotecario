"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function EnlaceNav({
  href,
  exacto = false,
  className,
  children,
}: {
  href: string;
  exacto?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const ruta = usePathname();
  const activa = exacto ? ruta === href : ruta.startsWith(href);
  return (
    <Link
      href={href}
      aria-current={activa ? "page" : undefined}
      className={className}
    >
      {children}
    </Link>
  );
}
