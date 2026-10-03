# Trivento

Sitio de presentación del proyecto inmobiliario **Trivento** (San Martín Bolívar, junto a la UIDE).

Una sola página editorial: fachada a pantalla completa, recorrido visual por los renders del
proyecto con parallax suave y un formulario de visita validado que guarda cada solicitud en
Supabase (`contact_submissions`). Adaptado a móvil y escritorio, respeta `prefers-reduced-motion`.

## Stack

- TanStack Start + TanStack Router
- React 19 + TypeScript
- Tailwind CSS v4
- Supabase (server function con `service_role` para el formulario) + Drizzle para migraciones
- Vitest para pruebas

## Desarrollo

Requiere Node.js 20+ (o Bun).

```sh
bun install        # o npm install
bun run dev        # servidor de desarrollo
bun run build      # build de producción
bun run test       # pruebas
bun run lint
```

## Variables de entorno

Crea un `.env` en la raíz:

```
SUPABASE_URL=
SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=   # solo servidor, nunca al cliente
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
DATABASE_URL=                # para `drizzle-kit` (migraciones)
CRON_SECRET=                 # opcional, para endpoints de cron
```

## Estructura

- `src/routes/index.tsx` — la página (una sola ruta)
- `src/lib/trivento-data.ts` — datos comerciales del proyecto
- `src/lib/contact.functions.ts` — server function del formulario (validación + rate limit)
- `src/integrations/supabase/` — clientes de Supabase (público y admin)
- `public/renders/` — imágenes del proyecto
- `drizzle/migrations/` — migraciones de la tabla `contact_submissions`
