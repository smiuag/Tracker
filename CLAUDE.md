@AGENTS.md

# OpoFlow

OpoFlow es una aplicación diseñada específicamente para opositores.

No es una app de tareas.
No es un calendario.
No es un Pomodoro.

Es un sistema completo para planificar, seguir y analizar el progreso durante toda la preparación de una oposición.

La aplicación debe sentirse como una mezcla entre:

- Apple Health
- Notion
- Duolingo
- GitHub Contributions
- Todoist

La prioridad absoluta es que el usuario abra la aplicación y en menos de 5 segundos sepa:

- Cómo va.
- Qué tiene que hacer hoy.
- Qué porcentaje lleva.
- Qué repasos le tocan.

El diseño debe ser extremadamente limpio.

---

## Nota de arquitectura (decisión del usuario, prevalece sobre "Arquitectura" más abajo)

- **Sin login ni cuentas de usuario.** Cualquiera que abra el dispositivo ve los mismos datos.
- **Almacenamiento 100% local en el dispositivo** (IndexedDB vía Dexie.js). Se descarta Supabase/Postgres/Auth/Storage/Realtime.
- **React Query no se usa en el MVP** — no hay red que cachear; `dexie-react-hooks` (`useLiveQuery`) da reactividad local.
- Next.js en modo **static export** (`output: "export"`) + **PWA instalable y offline** (Serwist, no next-pwa), para poder envolver la app más adelante con **Capacitor** y publicarla en App Store/Google Play sin reescritura.
- **shadcn/ui**, no Material Design/MUI — la estética debe seguir siendo Apple/Notion/Linear, no el lenguaje visual de Google.
- Ver el plan completo de implementación (arquitectura de datos, estructura de carpetas, fases) en `C:\Users\diego\.claude\plans\quiero-una-pwa-para-nifty-pumpkin.md`.

---

# Filosofía

El objetivo no es añadir muchas funciones.

El objetivo es reducir la ansiedad del opositor.

Toda pantalla debe responder una pregunta.

Dashboard
→ ¿Cómo voy?

Hoy
→ ¿Qué hago ahora?

Temario
→ ¿Qué me queda?

Repasos
→ ¿Qué toca hoy?

Estadísticas
→ ¿Estoy mejorando?

---

# Público objetivo

Personas preparando oposiciones durante meses o años.

Necesitan:

- visualizar progreso
- mantener motivación
- controlar repasos
- registrar tiempo
- evitar olvidar temas

---

# Diseño

Inspiración:

Apple
Notion
Linear
Things 3

No utilizar:

- colores estridentes
- tablas de Excel
- interfaces saturadas

Utilizar:

mucho espacio en blanco

tarjetas

esquinas redondeadas

animaciones suaves

gráficos simples

paleta:

Crema

#F7F4EE

Verde salvia

#CAD7C5

Rosa empolvado

#E7D9D4

Beige

#E9E1D3

Texto

#333333

---

# Navegación

Dashboard

↓

Hoy

↓

Temario

↓

Repasos

↓

Estadísticas

↓

Configuración

---

# Dashboard

Debe mostrar:

Horas estudiadas esta semana

Objetivo semanal

%

Donut de progreso

Racha

Temas completados

Test realizados

Próximo repaso

Tiempo por bloques

Calendario tipo GitHub

Objetivos mensuales

---

# Página "Hoy"

Debe responder:

¿Qué hago hoy?

Mostrar:

Objetivo del día

Temas

Repasos

Test

Pomodoros

Temporizador

Notas rápidas

Estado de energía

Concentración

Al terminar el día:

Resumen

Horas

Productividad

Reflexión

---

# Temario

Cada tema tendrá:

nombre

bloque

estado

porcentaje

dificultad

último estudio

próximo repaso

tiempo invertido

notas

test asociados

subtemas

Cada tema tendrá una tarjeta.

Nunca una tabla enorme.

---

# Sistema de repasos

Implementar repetición espaciada.

El usuario puede elegir:

1-3-7-15-30

o

personalizado

El sistema calcula automáticamente los próximos repasos.

---

# Registro de estudio

Registrar:

inicio

fin

tiempo

tema

tipo

lectura

esquema

memorización

test

repaso

legislación

observaciones

energía

concentración

---

# Estadísticas

Mostrar:

horas

horas por tema

horas por bloque

tiempo por tipo

test

aciertos

errores

racha

mejor semana

media

objetivos

gráficos

---

# Objetivos

Objetivos:

diarios

semanales

mensuales

anuales

Cada objetivo tendrá:

valor

progreso

%

barra

fecha

---

# Gamificación

No infantil.

No poner trofeos absurdos.

Sí:

rachas

niveles

insignias elegantes

progreso

calendario GitHub

score semanal

---

# Calendario

Vista anual.

Cada día cambia de color según:

0 horas

1 hora

2 horas

4 horas

6+ horas

---

# UX

Cada acción debe hacerse en menos de tres clics.

Nunca abrir modales innecesarios.

Todo debe sentirse rápido.

---

# Arquitectura

Frontend

Next.js

TypeScript

TailwindCSS

shadcn/ui

Framer Motion

Backend

Ninguno — almacenamiento local (ver "Nota de arquitectura" arriba). El texto original de este brief mencionaba Supabase/PostgreSQL/Auth/Storage/Realtime; queda descartado por decisión explícita del usuario.

---

# Código

Siempre:

Componentes pequeños

Tipado estricto

Sin duplicación

Funciones puras

Código limpio

No generar archivos gigantes.

---

# Convenciones

Un componente por archivo.

No superar 300 líneas por archivo.

Separar:

UI

Lógica

Hooks

Servicios

Tipos

---

# Prioridades de desarrollo

MVP

1 Dashboard

2 Registro diario

3 Temario

4 Repasos

5 Objetivos

6 Estadísticas

Después:

Calendario

Gamificación

IA

Sincronización

Exportación PDF

Widgets móviles

---

# Funciones futuras

IA que analice hábitos.

Predicción de fecha de preparación.

Estimación de horas necesarias.

Análisis de puntos débiles.

Recomendaciones automáticas.

---

# Objetivo final

Cuando un opositor abra OpoFlow debe sentir calma.

Nunca debe sentirse perdido.

Toda la aplicación debe transmitir:

"Sabes exactamente dónde estás y cuál es el siguiente paso."
