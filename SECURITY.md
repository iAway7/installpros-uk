# Security — estado y deuda abierta

Auditoría completa del código: **2026-09-11**. Este fichero recoge únicamente lo
que quedó **abierto**. Lo ya arreglado vive en el propio código, comentado en el
sitio donde importa.

---

## 1. Rate limiting - HECHO, con una parte manual pendiente

Dos capas, porque ninguna basta sola.

**Capa 1: cuotas de Google (lo que de verdad acota la factura).**
Consola de Google Cloud -> APIs y servicios -> Places API (New) -> Cuotas.
Los valores por defecto son enormes (175.000 autocompletados al dia). Ajustar:

| Fila | Por defecto | Poner |
|---|---|---|
| `AutocompletePlacesRequest per day` | 175.000 | 2.000 |
| `AutocompletePlacesRequest per minute` | 12.000 | 100 |
| `GetPlaceRequest per day` | 125.000 | 500 |
| `GetPlaceRequest per minute` | 600 | 30 |

Es lo unico que hace imposible una factura desbocada, en vez de solo
improbable: el rate limiting va por IP y un ataque distribuido lo esquiva.
Ojo al contrapeso: si se agota la cuota diaria, el autocompletado deja de dar
sugerencias y en los landings con direccion el visitante no puede completar el
formulario. Por eso 2.000 es deliberadamente generoso, unas 200 veces el uso
actual. Conviene tambien una alerta de presupuesto en Facturacion.

**Capa 2: limitador en memoria** (`src/lib/rate-limit.ts`), aplicado a las siete
rutas publicas. Sin cuenta, sin dependencia, sin variables de entorno.

| Ruta | Limite |
|---|---|
| `/api/address/autocomplete` | 60 / min |
| `/api/address/details` | 20 / min |
| `/api/broadband-coverage`, `/api/coverage` | 20 / min |
| `/api/lead` | 5 / min y 20 / hora |
| `/api/property-photos` | 20 / hora |
| `/api/experiments/track` | 120 / min |

El ancla es una medicion real: escribir "12 De La Bere Cl, Evesham" a ritmo
humano produce 6 llamadas de autocompletado (1 si se teclea rapido, por el
debounce de 250 ms). 60 por minuto es unas diez veces un mecanografo normal.

Limitacion conocida y aceptada: el contador vive en la memoria de una instancia
y Vercel levanta varias, asi que el limite efectivo es el numero configurado por
el numero de instancias calientes. Se acepto a cambio de no anadir una cuenta ni
un servicio antes del lanzamiento, y porque las cuotas de Google ya acotan el
dinero. Todo pasa por `rateLimit()`, asi que cambiar el Map por Upstash Redis
mas adelante es tocar un solo fichero.

## 2. CSP en Report-Only — ABIERTO por diseño

`next.config.mjs` envía `Content-Security-Policy-Report-Only`. Las demás
cabeceras (HSTS, nosniff, X-Frame-Options, Referrer-Policy, Permissions-Policy)
sí van aplicadas.

**Para promoverla a enforcing:** vigilar la consola en el funnel, el dashboard y
`/login` unos días, incorporar lo que reporte legítimamente, y renombrar la
cabecera a `Content-Security-Policy`.

`'unsafe-inline'` en `script-src` es load-bearing hoy: GTM inyecta snippets
inline y las páginas llevan JSON-LD inline. Quitarlo exige nonces.

## 3. Next.js 14.2.35 — parcheado hasta donde llega la rama

Se subió de 14.2.15 a 14.2.35, lo que cierra el bypass de autorización del
middleware (CVE-2025-29927), la confusión de claves de caché, el SSRF en
redirects y la inyección de contenido en el optimizador de imágenes.

Lo que **sigue listado y no tiene fix en 14.x** (solo en 16.3+):

- RCE en Windows (GHSA-p293) — no aplica: desplegamos en Vercel/Linux.
- RCE vía AVIF en el optimizador (GHSA-2xp9) — **mitigado** quitando
  `"image/avif"` de `images.formats`. `/_next/image` se sirve aunque nadie
  importe `next/image`, así que la ruta estaba viva. Restaurar AVIF al pasar a 16.
- Varios DoS y cache-poisoning cuyas features no usamos: sin Server Actions
  (cero ficheros con `"use server"`), sin i18n, sin `remotePatterns`, sin nonces.

Vaciar del todo `npm audit` exige **Next 16**, que es un major con breaking
changes. Merece planificarse.

## 4. Menores, aceptados

- `GET /api/webhooks` devuelve `secret` en claro. Admin-only, pero es superficie.
- Trustpilot acepta el token por `?token=` además de cabecera; por query queda en
  logs de acceso. La cabecera `x-webhook-token` ya funciona: es la preferible.
- `/api/leads/[id]/enrich` es anónima a propósito (el funnel la llama tras
  enviar). Idempotente y solo escribe datos derivados, pero gasta créditos.

---

## Lo que se verificó y está bien

No volver a auditarlo sin motivo:

- **RLS activo en las 15 tablas** (`alter table … enable row level security`).
- La **service-role key nunca llega al cliente**: ningún fichero `"use client"`
  la importa, ni directa ni transitivamente.
- **Sin secretos en git**, ni en HEAD ni en los 139 commits del historial.
- Bucket `property-photos` privado, servido con signed URLs de 1 h.
- Comparaciones timing-safe en el token de Trustpilot y en la firma interna.
- Guardas de admin en **todas** las rutas de administración.
- El dashboard revalida la sesión por su cuenta en `layout.tsx`, sin depender
  del middleware — por eso el CVE del middleware nunca expuso datos.
- JSON-LD construido sobre constantes estáticas: no es inyectable.
