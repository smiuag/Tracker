import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, Download, ShieldCheck } from "lucide-react";

/** Página pública "¿Qué es Opobook?": explica la app con maquetas de sus pantallas. */
export function AyudaView() {
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
          <h1 className="text-xl font-semibold text-foreground">¿Qué es Opobook?</h1>
          <p className="text-sm text-muted-foreground">Tu oposición, bajo control y con calma.</p>
        </div>
      </div>

      <p className="mt-5 text-sm text-foreground">
        Opobook es una app gratuita para opositores: planifica tu estudio,
        registra tus sesiones y ve tu progreso real — cuántas horas llevas, qué
        toca hoy y cuánto temario te queda. Sin cuentas ni registros: tus datos
        viven solo en tu dispositivo.
      </p>

      {/* Progreso */}
      <section className="mt-8">
        <h2 className="font-semibold text-foreground">¿Cómo voy?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          La pantalla de Progreso resume tu semana de un vistazo: horas frente a
          tu objetivo, tu racha de días cumplidos y un calendario que se pinta
          de verde con cada día de estudio.
        </p>
        <div className="mt-3 rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-4">
            <div
              className="flex size-20 shrink-0 items-center justify-center rounded-full"
              style={{ background: "conic-gradient(var(--primary) 0 64%, var(--secondary) 64% 100%)" }}
            >
              <div className="flex size-14 flex-col items-center justify-center rounded-full bg-card">
                <span className="text-sm font-semibold text-foreground">64%</span>
                <span className="text-[10px] text-muted-foreground">semana</span>
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-lg font-semibold text-foreground">9 h esta semana</p>
              <p className="text-xs text-muted-foreground">Objetivo: 14 h</p>
              <div className="mt-2 flex gap-1">
                <span className="h-2.5 flex-1 rounded-full bg-primary" />
                <span className="h-2.5 flex-1 rounded-full bg-primary" />
                <span className="h-2.5 flex-1 rounded-full bg-accent" />
                <span className="h-2.5 flex-1 rounded-full bg-primary" />
                <span className="h-2.5 flex-1 rounded-full bg-primary" />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Racha activa: 6 días 🔥</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hoy */}
      <section className="mt-7">
        <h2 className="font-semibold text-foreground">¿Qué hago hoy?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          En Hoy tienes tu objetivo del día, tus tareas y el registro de
          sesiones: por bloques, con cronómetro o apuntando los minutos a mano.
        </p>
        <div className="mt-3 flex flex-col gap-2 rounded-2xl border border-border bg-card p-4">
          <div className="flex items-baseline justify-between">
            <p className="text-sm text-muted-foreground">Objetivo del día</p>
            <p className="text-sm font-semibold text-foreground">2 h 30 min / 2 h ⭐</p>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div className="h-full w-full rounded-full bg-primary" />
          </div>
          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <span className="flex size-4 items-center justify-center rounded bg-primary">
              <Check className="size-3 text-primary-foreground" />
            </span>
            <span className="line-through">Repasar tema 12</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground">
            <span className="size-4 rounded border border-border" />
            Test del bloque 2
          </div>
        </div>
      </section>

      {/* Estadísticas */}
      <section className="mt-7">
        <h2 className="font-semibold text-foreground">¿Estoy mejorando?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Estadísticas convierte tus sesiones en respuestas: evolución semanal,
          horas por bloque y por tema, y cuánto dedicas a leer, estudiar o hacer
          test.
        </p>
        <div className="mt-3 rounded-2xl border border-border bg-card p-4">
          <div className="flex h-24 items-end gap-3">
            {[35, 55, 40, 75, 100].map((h, i) => (
              <div
                key={i}
                className={`flex-1 rounded-t-lg ${i === 4 ? "bg-primary" : "bg-primary/50"}`}
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">Evolución semanal</p>
        </div>
      </section>

      {/* Temario, en breve */}
      <section className="mt-7">
        <h2 className="font-semibold text-foreground">¿Qué me queda?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          En Temario organizas tus bloques y temas, con su estado (pendiente, en
          progreso, acabado), el tiempo invertido y tus notas. Siempre sabes
          exactamente dónde estás.
        </p>
      </section>

      {/* Cómo empezar */}
      <section className="mt-8 rounded-2xl bg-secondary/40 p-4">
        <h2 className="font-semibold text-foreground">Cómo empezar</h2>
        <ol className="mt-2 flex flex-col gap-1.5 text-sm text-foreground">
          <li>1 · Configura tus días y horas de estudio en Configuración.</li>
          <li>2 · Crea tus bloques y temas en Temario.</li>
          <li>3 · Registra tus sesiones desde Hoy.</li>
          <li>4 · Mira tu progreso crecer, día a día.</li>
        </ol>
      </section>

      {/* Privacidad */}
      <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-border bg-card p-3.5 text-sm">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-foreground" />
        <p className="text-muted-foreground">
          <strong className="text-foreground">Gratis y privada.</strong> Sin
          cuenta, sin anuncios y sin nube: todo se guarda en tu dispositivo, y
          puedes exportar una copia de seguridad cuando quieras.
        </p>
      </div>

      <Link
        href="/"
        className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-primary p-4 font-medium text-primary-foreground transition-transform hover:scale-[1.01]"
      >
        Abrir Opobook
      </Link>
      <Link
        href="/instalar"
        className="mt-2.5 flex items-center justify-center gap-2 rounded-2xl border border-border bg-card p-4 font-medium text-foreground transition-transform hover:scale-[1.01]"
      >
        <Download className="size-4" />
        Cómo instalar la app
      </Link>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Hecho con calma para opositores · Opobook
      </p>
    </div>
  );
}
