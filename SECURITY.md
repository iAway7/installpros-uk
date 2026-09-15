# Security — estado y deuda abierta

Auditoría completa del código: **2026-09-11**. Este fichero recoge únicamente lo
que quedó **abierto**. Lo ya arreglado vive en el propio código, comentado en el
sitio donde importa.

---

## 1. Sin rate limiting — ABIERTO (aplazado conscientemente)

No hay límite de peticiones en ninguna ruta: ni middleware, ni CAPTCHA, ni WAF.
Lo relevante no es el spam, es que **hay endpoints públicos que gastan dinero**:

| Ruta | Qué pasa si la martillean | Coste |
|---|---|---|
| `/api/address/autocomplete` | Llamada a Google Places por request | Facturado por Google |
| `/api/address/details` | Ídem | Facturado por Google |
| `/api/broadband-coverage` | Propalt / Ofcom (mitigado por caché por postcode) | Créditos Propalt |
| `/api/property-photos` | Subida de 10 MB al bucket, sin auth | Storage Supabase |
| `/api/lead` | Fila en `leads` + fan-out de webhooks al CRM | Ruido en el CRM de Will |
| `/api/experiments/track` | Falsea conversiones A/B | Decisiones de producto sobre datos sucios |

`/api/property-photos` exige un UUID de lead válido y existente, así que no es
trivial de explotar a ciegas. Las de Google no exigen nada.

**Opciones evaluadas:**

1. **Upstash Redis** (`@upstash/ratelimit`) — la correcta en serverless: el
   contador es compartido entre instancias. Requiere cuenta + 2 env vars.
2. **En memoria** — cero deps, pero en Vercel cada lambda tiene su propio
   contador y repartir peticiones lo diluye. Parche, no solución.
3. **Vercel WAF** (Firewall → Rate Limiting) — sin tocar el repo, requiere Pro.

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
