# Bar Menu

Panel de administración y menú público para restaurantes. Permite gestionar productos, categorías e información del local con carga de imágenes, y muestra un menú público responsive con vista en lista o cuadrícula.

## Stack

- **Runtime:** Next.js 16 + React 19 + TypeScript
- **Hosting:** Cloudflare (con @opennextjs/cloudflare)
- **DB:** Cloudflare D1 (SQLite)
- **Imágenes:** Cloudflare R2
- **Auth:** bcryptjs + jose (JWT en cookies httpOnly)
- **Estilos:** Tailwind CSS 4

## Requisitos

- Node.js 20+
- pnpm 11+
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) (`pnpm add -g wrangler`)

## Variables de entorno

Crear `.env.local` en la raíz:

```env
AUTH_SECRET=un-secreto-de-64-caracteres-hex
AUTH_CHANGE_PASSWORD_TOKEN=un-uuid-como-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

| Variable | Descripción |
|----------|-------------|
| `AUTH_SECRET` | Clave para firmar los JWT de sesión |
| `AUTH_CHANGE_PASSWORD_TOKEN` | Token para la API de crear/cambiar/eliminar usuarios |

## Setup local

```bash
# 1. Instalar dependencias
pnpm install

# 2. Crear la base D1 local
wrangler d1 create bar-menu-db 2>/dev/null || true  # ignorar si ya existe
wrangler d1 migrations apply bar-menu-db --local

# 3. Iniciar dev server
pnpm dev
```

Abrir http://localhost:3000

### Admin

- **URL:** http://localhost:3000/admin/login
- **Usuario:** `admin`
- **Contraseña:** `adminBarMenu`

## Scripts

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Dev server local |
| `pnpm build` | Build de producción |
| `pnpm deploy` | Build + deploy a Cloudflare |
| `pnpm lint` | ESLint |
| `pnpm cf-typegen` | Regenerar tipos de Cloudflare |

## Cambiar contraseña / agregar usuario

Se hace via API con el token configurado en `AUTH_CHANGE_PASSWORD_TOKEN`.

```bash
# Crear usuario
curl -X POST http://localhost:3000/api/admin/users \
  -H "Content-Type: application/json" \
  -d '{"mode":"create","username":"editor","newPassword":"editor123","token":"el-token-que-configuraste"}'

# Cambiar contraseña
curl -X POST http://localhost:3000/api/admin/users \
  -H "Content-Type: application/json" \
  -d '{"mode":"update","username":"admin","newPassword":"nuevaPass","token":"el-token-que-configuraste"}'

# Eliminar usuario
curl -X POST http://localhost:3000/api/admin/users \
  -H "Content-Type: application/json" \
  -d '{"mode":"delete","username":"editor","token":"el-token-que-configuraste"}'
```

## Migraciones

Para resetear la DB local:
```bash
wrangler d1 migrations apply bar-menu-db --local --reset
```
