import Image from "next/image";
import { CircleHelp, Download, Heart, Music2, Send } from "lucide-react";
import type { ComponentType } from "react";
import { InstagramIcon } from "./InstagramIcon";

// Destinos de la página de enlaces; ajustar aquí los handles definitivos.
const LINKS: {
  href: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
  sub: string;
  external: boolean;
  /** Aún sin destino real: se muestra apagado y sin enlace. */
  disabled?: boolean;
}[] = [
  {
    href: "/ayuda",
    icon: CircleHelp,
    label: "¿Qué es Opobook?",
    sub: "Qué hace y cómo funciona",
    external: false,
  },
  {
    href: "/instalar",
    icon: Download,
    label: "Descargar la app",
    sub: "Cómo instalarla en tu móvil",
    external: false,
  },
  {
    href: "https://www.instagram.com/opobook/",
    icon: InstagramIcon,
    label: "Instagram",
    sub: "Muy pronto",
    external: true,
    disabled: true,
  },
  {
    href: "https://www.tiktok.com/@opobook",
    icon: Music2,
    label: "TikTok",
    sub: "Muy pronto",
    external: true,
    disabled: true,
  },
  {
    href: "mailto:opobook@protonmail.com?subject=Sugerencia%20Opobook",
    icon: Send,
    label: "Sugerencias",
    sub: "Cuéntanos cómo mejorar la app",
    external: true,
  },
  {
    href: "https://revolut.me/opobook",
    icon: Heart,
    label: "Apoya el proyecto",
    sub: "Donación voluntaria por Revolut",
    external: true,
  },
];

export function LinksView() {
  return (
    <div className="flex min-h-dvh flex-col items-center px-6 py-14">
      <Image
        src="/icons/icon-192.png"
        alt="Logo de Opobook"
        width={88}
        height={88}
        className="rounded-[22%] shadow-sm"
        priority
      />
      <h1 className="mt-4 text-2xl font-semibold text-foreground">Opobook</h1>
      <p className="mt-1 text-center text-sm text-muted-foreground">
        Planifica, organiza y progresa en tu oposición
      </p>

      <nav aria-label="Enlaces de Opobook" className="mt-8 flex w-full max-w-sm flex-col gap-3">
        {LINKS.map(({ href, icon: Icon, label, sub, external, disabled }) =>
          disabled ? (
            <div
              key={href}
              aria-disabled
              className="flex items-center gap-3.5 rounded-2xl border border-border bg-card p-4 opacity-55"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary">
                <Icon className="size-5 text-muted-foreground" />
              </span>
              <span className="min-w-0">
                <span className="block font-medium text-muted-foreground">{label}</span>
                <span className="block truncate text-xs text-muted-foreground">{sub}</span>
              </span>
            </div>
          ) : (
            <a
              key={href}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className="flex items-center gap-3.5 rounded-2xl border border-border bg-card p-4 transition-transform hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-ring"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/40">
                <Icon className="size-5 text-foreground" />
              </span>
              <span className="min-w-0">
                <span className="block font-medium text-foreground">{label}</span>
                <span className="block truncate text-xs text-muted-foreground">{sub}</span>
              </span>
            </a>
          )
        )}
      </nav>

      <p className="mt-10 text-xs text-muted-foreground">
        Hecho con calma para opositores · Opobook
      </p>
    </div>
  );
}
