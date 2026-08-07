import Image from "next/image";
import { Download, Heart, Music2, Send } from "lucide-react";
import type { ComponentType } from "react";
import { InstagramIcon } from "./InstagramIcon";

// Destinos de la página de enlaces; ajustar aquí los handles definitivos.
const LINKS: {
  href: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
  sub: string;
  external: boolean;
}[] = [
  {
    href: "/",
    icon: Download,
    label: "Abrir Opobook",
    sub: "La app gratuita para tu oposición",
    external: false,
  },
  {
    href: "https://www.instagram.com/opobook/",
    icon: InstagramIcon,
    label: "Instagram",
    sub: "Técnicas de estudio y motivación",
    external: true,
  },
  {
    href: "https://www.tiktok.com/@opobook",
    icon: Music2,
    label: "TikTok",
    sub: "Consejos en un minuto",
    external: true,
  },
  {
    href: "https://revolut.me/opobook",
    icon: Heart,
    label: "Apoya el proyecto",
    sub: "Donación voluntaria por Revolut",
    external: true,
  },
  {
    href: "mailto:opobook@protonmail.com",
    icon: Send,
    label: "Sugerencias",
    sub: "Cuéntanos cómo mejorar la app",
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
        {LINKS.map(({ href, icon: Icon, label, sub, external }) => (
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
        ))}
      </nav>

      <p className="mt-10 text-xs text-muted-foreground">
        Hecho con calma para opositores · Opobook
      </p>
    </div>
  );
}
