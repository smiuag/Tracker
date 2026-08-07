"use client";

import { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Compass,
  EllipsisVertical,
  Globe,
  Share,
  SquarePlus,
  TriangleAlert,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ComponentType } from "react";

type Device = "ios" | "android";

interface Step {
  icon: ComponentType<{ className?: string }>;
  title: string;
  sub: string;
  /** Maqueta opcional: reproduce el control real del sistema que hay que tocar. */
  mock?: { icon: ComponentType<{ className?: string }>; label: string };
}

const STEPS: Record<Device, Step[]> = {
  ios: [
    {
      icon: Compass,
      title: "Abre Opobook en Safari",
      sub: "La instalación solo funciona desde Safari, no desde Chrome u otros navegadores.",
    },
    {
      icon: Share,
      title: "Toca el botón Compartir",
      sub: "El cuadrado con la flecha hacia arriba, en la barra inferior de Safari.",
      mock: { icon: Share, label: "Compartir" },
    },
    {
      icon: SquarePlus,
      title: "Elige «Añadir a pantalla de inicio»",
      sub: "Desliza hacia abajo en la lista si no lo ves a la primera.",
      mock: { icon: SquarePlus, label: "Añadir a pantalla de inicio" },
    },
    {
      icon: Check,
      title: "Toca «Añadir»",
      sub: "El icono de Opobook aparecerá en tu pantalla de inicio, como una app más.",
    },
  ],
  android: [
    {
      icon: Globe,
      title: "Abre Opobook en Chrome",
      sub: "Con el navegador Chrome de tu móvil.",
    },
    {
      icon: EllipsisVertical,
      title: "Abre el menú de Chrome",
      sub: "Los tres puntos verticales, arriba a la derecha.",
      mock: { icon: EllipsisVertical, label: "Menú" },
    },
    {
      icon: SquarePlus,
      title: "Toca «Instalar aplicación»",
      sub: "En algunos móviles aparece como «Añadir a pantalla de inicio».",
      mock: { icon: SquarePlus, label: "Instalar aplicación" },
    },
    {
      icon: Check,
      title: "Confirma «Instalar»",
      sub: "Tendrás Opobook en la pantalla de inicio y en tu cajón de aplicaciones.",
    },
  ],
};

const DEVICE_LABELS: { value: Device; label: string }[] = [
  { value: "ios", label: "iPhone / iPad" },
  { value: "android", label: "Android" },
];

function detectDevice(): Device {
  return /android/i.test(navigator.userAgent) ? "android" : "ios";
}

const noopSubscribe = () => () => {};

export function InstallGuideView() {
  // Preselecciona el dispositivo desde el que se visita; el usuario puede cambiarlo.
  const detected = useSyncExternalStore(noopSubscribe, detectDevice, () => "ios" as Device);
  const [override, setOverride] = useState<Device | null>(null);
  const device = override ?? detected;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-6 py-10">
      <Link
        href="/enlaces"
        className="mb-6 flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Volver
      </Link>

      <div className="flex items-center gap-4">
        <Image
          src="/icons/icon-192.png"
          alt="Logo de Opobook"
          width={64}
          height={64}
          className="rounded-[22%] shadow-sm"
          priority
        />
        <div>
          <h1 className="text-xl font-semibold text-foreground">Instalar Opobook</h1>
          <p className="text-sm text-muted-foreground">
            Gratis, sin cuenta y con tus datos solo en tu dispositivo.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <Tabs value={device} onValueChange={(v) => setOverride(v as Device)}>
          <TabsList className="w-full">
            {DEVICE_LABELS.map((d) => (
              <TabsTrigger key={d.value} value={d.value}>
                {d.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-accent/50 p-3.5 text-sm text-foreground">
        <TriangleAlert className="mt-0.5 size-4 shrink-0" />
        <p>
          ¿Vienes desde Instagram o TikTok? Su navegador interno no permite
          instalar: toca <strong>⋯</strong> y elige{" "}
          <strong>«Abrir en el navegador»</strong> primero.
        </p>
      </div>

      <ol className="mt-5 flex flex-col gap-3">
        {STEPS[device].map((step, i) => (
          <li
            key={step.title}
            className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4"
          >
            <div className="flex items-start gap-3.5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/40 text-sm font-semibold text-foreground">
                {i + 1}
              </span>
              <div className="min-w-0">
                <p className="font-medium text-foreground">{step.title}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{step.sub}</p>
              </div>
            </div>
            {step.mock && (
              <div className="ml-12 flex w-fit items-center gap-2.5 rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground shadow-sm">
                <step.mock.icon className="size-4.5 text-foreground" />
                {step.mock.label}
              </div>
            )}
          </li>
        ))}
      </ol>

      <Link
        href="/"
        className="mt-8 flex items-center justify-center gap-2 rounded-2xl bg-primary p-4 font-medium text-primary-foreground transition-transform hover:scale-[1.01]"
      >
        {device === "ios" ? "Abrir Opobook en Safari" : "Abrir Opobook en Chrome"}
      </Link>
    </div>
  );
}
