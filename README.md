# Shopify Orders Frontend

Panel operativo desarrollado con Vue 3 para consultar órdenes Shopify, trazabilidad de procesamiento e inventario de materiales de empaque.

## Tecnologías

- Vue 3 y TypeScript.
- Vite.
- Vue Router.
- Pinia.
- Fetch API con timeout y cancelación.
- CSS modular inspirado en Shopify Admin.
- Lucide Icons.
- Vitest, Testing Library y Playwright configurados.

## Funcionalidades

- Dashboard con indicadores generales y órdenes recientes.
- Listado paginado de órdenes.
- Filtros por estado, tienda, orden y fechas.
- Ordenamiento y filtros sincronizados con la URL.
- Detalle de productos, materiales, historial e intentos.
- Visualización de fallos de procesamiento.
- Inventario completo y filtro de stock bajo.
- Polling automático y actualización manual.
- Cancelación de solicitudes obsoletas.
- Estados de carga, vacío, error y desconexión.
- Diseño responsive para escritorio y móvil.

## Requisitos

- Node.js `^22.18.0` o `>=24.12.0`.
- npm.
- Backend ejecutándose en `http://localhost:3000`.

## Instalación

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

Abrir:

```text
http://localhost:5173
```

## Variables de entorno

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_POLLING_INTERVAL_MS=5000
VITE_REQUEST_TIMEOUT_MS=10000
```

| Variable                   | Descripción                            |
| -------------------------- | -------------------------------------- |
| `VITE_API_BASE_URL`        | URL base del backend                   |
| `VITE_POLLING_INTERVAL_MS` | Frecuencia de actualización automática |
| `VITE_REQUEST_TIMEOUT_MS`  | Timeout de solicitudes HTTP            |

## Rutas

```text
/                  Dashboard
/orders            Listado de órdenes
/orders/:id        Detalle de orden
/inventory         Inventario
/*                 Página no encontrada
```

## Arquitectura

El frontend utiliza organización modular por funcionalidades:

```text
src/
├── app/router/
├── assets/styles/
├── layouts/
├── modules/
│   ├── dashboard/
│   ├── orders/
│   └── inventory/
└── shared/
    ├── api/
    ├── components/
    ├── composables/
    ├── config/
    ├── types/
    └── utils/
```

Cada módulo contiene sus tipos, servicio, store, componentes y vista. `shared` concentra infraestructura HTTP y elementos reutilizables.

## Backend requerido

Antes de iniciar el frontend:

```powershell
cd ..\shopify-orders-challenge
docker compose up -d
npm run migration:run
npm run seed:test-shop
npm run start:dev
```

Comprobar:

```text
http://localhost:3000/api/health
http://localhost:3000/api/docs
```

## API consumida

```text
GET /api/dashboard/summary
GET /api/orders
GET /api/orders/:id
GET /api/orders/:id/materials
GET /api/inventory
GET /api/inventory/low-stock
```

## Scripts

```bash
npm run dev
npm run format
npm run format:check
npm run lint
npm run lint:fix
npm run type-check
npm run test:unit
npm run test:coverage
npm run test:e2e
npm run build
npm run preview
npm run verify
```

## Build de producción

```bash
npm run build
npm run preview
```

El resultado se genera en `dist/`.

## Pruebas

La infraestructura de Vitest, Testing Library, MSW y Playwright está configurada y existen pruebas base de contratos y configuración.

Por restricciones de tiempo de la prueba técnica, la cobertura automatizada completa de todas las vistas, componentes y stores quedó pendiente. La validación funcional principal se realizó manualmente contra el backend real.

Para ejecutar las pruebas existentes:

```bash
npm run test:unit
npm run test:coverage
```

Para ejecutar Playwright cuando estén disponibles los navegadores y escenarios definitivos:

```bash
npx playwright install chromium
npm run test:e2e
```

## Manejo de errores

El cliente HTTP diferencia:

- Error de red.
- Timeout.
- Cancelación.
- Error HTTP del backend.
- JSON inválido.
- Contrato de respuesta inválido.

Las recargas silenciosas conservan los datos válidos previamente cargados.

## Diseño

La interfaz utiliza un sistema visual propio inspirado en Shopify Admin:

- Navegación lateral.
- Tarjetas e indicadores.
- Badges por estado.
- Tablas administrativas.
- Estados de carga y error.
- Adaptación móvil.

## Estados de orden

```text
RECEIVED   → Recibida
QUEUED     → En cola
PROCESSING → Procesando
PROCESSED  → Procesada
FAILED     → Fallida
```

## Relación con el backend

Este proyecto debe entregarse como repositorio GitHub independiente del backend. Ambos repositorios se ejecutan conjuntamente, pero mantienen instalación, dependencias y configuración separadas.
