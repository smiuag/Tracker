# Opobook

Sistema de planificación, seguimiento y análisis para la preparación de una oposición. No es una app de tareas ni un Pomodoro: es un dashboard con datos reales de tu progreso — cuántas horas llevas, qué te toca hoy, qué porcentaje del temario dominas, qué repasos tienes pendientes.

Ver [`CLAUDE.md`](./CLAUDE.md) para el brief de producto completo.

## Características

- **Dashboard** — horas de la semana, racha, progreso, próximo repaso, calendario de actividad.
- **Hoy** — cronómetro de sesiones (o registro manual), energía/concentración, pomodoros, notas.
- **Temario** — temas organizados por bloque, con subtemas y % de avance.
- **Repasos** — repetición espaciada automática (1-3-7-15-30 o patrón propio).
- **Objetivos** — diarios, semanales, mensuales y anuales.
- **Estadísticas** — horas por tema/bloque/tipo, aciertos en test, evolución semanal.

## Stack

Next.js (App Router, static export) · TypeScript · Tailwind CSS · shadcn/ui · Dexie.js (IndexedDB) · Serwist (PWA)

## Datos y privacidad

**Sin login, sin backend.** Todos los datos se guardan localmente en el dispositivo (IndexedDB), no salen del navegador. Instálala desde el navegador móvil ("Añadir a pantalla de inicio") para usarla como una app nativa, incluso sin conexión.

## Desarrollo

```bash
npm install
npm run dev       # http://localhost:3000 — con datos de ejemplo precargados
```

```bash
npm run build     # export estático en out/, con manifest y service worker reales
```

`npm run dev` usa Turbopack (sin service worker, más rápido para iterar). El build de producción usa webpack porque Serwist aún no soporta Turbopack — ver `next.config.ts`.
