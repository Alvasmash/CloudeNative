# Pedidos360 - Frontend SPA (Angular 19 & Azure AD MSAL)

> **Asignatura:** Desarrollo Cloud Native I (DSY1107)  
> **Sección:** 002D  
> **Evaluación Parcial N° 1**  
> **Tecnologías:** Angular 19 (Standalone Components, Signals), TypeScript 5.7, RxJS, Microsoft MSAL (`@azure/msal-browser`, `@azure/msal-angular`), CSS Moderno (Vanilla CSS Design System).

---

## 1. Descripción del Sistema

**Pedidos360** es una aplicación web SPA (*Single-Page Application*) comercial para pedidos gastronómicos en línea. Permite a los clientes explorar pizzas, hamburguesas y bebidas, gestionar su carrito de compras en tiempo real y crear órdenes de compra seguras. Los administradores disponen de un panel de control con métricas de recaudación global, actualización de estados de cocina y cancelación de órdenes.

El frontend está conectado de manera real y desacoplada a la API REST **Spring Boot 3.4** ubicada en el directorio `backend/`, implementando el flujo de seguridad basado en tokens criptográficos **JWT** emitidos por **Microsoft Entra ID (Azure AD)**.

```
┌─────────────────────────────────┐
│   Angular 19 SPA (Port 4200)   │
│   (MSAL Browser + Interceptor)  │
└────────────────┬────────────────┘
                 │ Authorization: Bearer <JWT>
                 ▼
┌─────────────────────────────────┐
│       AWS API Gateway /         │
│  Spring Boot 3.4 (Port 8080)    │
│  (OAuth2 Resource Server)       │
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│ Base de Datos: H2 / AWS RDS     │
└─────────────────────────────────┘
```

---

## 2. Requisitos Previos

Asegúrate de contar con el siguiente entorno instalado:
- **Node.js**: `v22.20.0` o superior (verificar con `node -v`).
- **NPM**: `10.9.0` o superior (verificar con `npm -v`).
- **Navegador Web Moderno**: Google Chrome, Microsoft Edge, Firefox o Brave.
- *(Para ejecutar el backend en paralelo)*: **Java JDK 21+** y **Maven 3.8+**.

---

## 3. Instalación y Puesta en Marcha

### Paso 1: Entrar al directorio del frontend
Abre una terminal en la raíz del repositorio y accede a la carpeta `frontend`:
```powershell
cd frontend
```

### Paso 2: Instalar las dependencias
Instala los paquetes de Angular y Microsoft MSAL:
```powershell
npm install
```

### Paso 3: Iniciar el servidor de desarrollo
Inicia la aplicación Angular en el puerto estándar `4200`:
```powershell
npm start
```
*(O ejecuta `npx ng serve`).*

Una vez compilado, abre en tu navegador:
👉 **[http://localhost:4200](http://localhost:4200)**

---

## 4. Estructura y Arquitectura Modular

El proyecto implementa una arquitectura limpia, modular y basada en **Standalone Components**:

```
frontend/
├── src/
│   ├── app/
│   │   ├── core/                      # Servicios transversales, seguridad y datos
│   │   │   ├── auth/
│   │   │   │   ├── auth.service.ts    # Gestión reactiva de sesión, MSAL y claims
│   │   │   │   └── msal.config.ts     # Factories de PublicClientApplication e Interceptor
│   │   │   ├── guards/
│   │   │   │   ├── auth.guard.ts      # Protege rutas privadas (/pedidos, /carrito)
│   │   │   │   └── admin.guard.ts     # Exige ROLE_ADMIN para acceder a /admin
│   │   │   ├── interceptors/
│   │   │   │   └── error.interceptor.ts # Manejo global de errores HTTP (401, 403, 404, 500)
│   │   │   ├── models/                # Interfaces mapeadas 1:1 a los DTOs del backend
│   │   │   │   ├── producto.model.ts
│   │   │   │   ├── pedido.model.ts
│   │   │   │   ├── pedido-create.model.ts
│   │   │   │   ├── estado-pedido.model.ts
│   │   │   │   ├── admin-dashboard.model.ts
│   │   │   │   └── user-profile.model.ts
│   │   │   └── services/              # Clientes HTTP separados por responsabilidad
│   │   │       ├── product.service.ts # GET /public/productos
│   │   │       ├── cart.service.ts    # Carrito reactivo con Signals
│   │   │       ├── order.service.ts   # POST y GET /api/pedidos
│   │   │       ├── admin.service.ts   # GET, PATCH, DELETE /api/admin/pedidos
│   │   │       ├── profile.service.ts # GET /api/profile
│   │   │       └── toast.service.ts   # Notificaciones flotantes tipo snackbar
│   │   ├── shared/                    # Componentes y pipes reutilizables
│   │   │   ├── components/
│   │   │   │   ├── status-badge/      # Badge con color e indicador de pulso
│   │   │   │   ├── timeline/          # Timeline visual de estados de entrega
│   │   │   │   ├── confirm-modal/     # Modal de confirmación (vaciar, eliminar)
│   │   │   │   └── toast-container/   # Contenedor de mensajes del sistema
│   │   │   └── pipes/
│   │   │       ├── clp-currency.pipe.ts # Formateo chileno: $8.990
│   │   │       └── order-status.pipe.ts # Etiquetas amigables en español
│   │   ├── features/                  # Vistas y páginas de la aplicación
│   │   │   ├── auth/                  # /login (Inicio con Microsoft + Demo)
│   │   │   ├── menu/                  # /menu (Catálogo, filtros, buscador)
│   │   │   ├── cart/                  # /carrito (Checkout real de órdenes)
│   │   │   ├── orders/                # /pedidos y /pedidos/:id (Detalle + Timeline)
│   │   │   └── admin/                 # /admin (Dashboard KPI, tabla, PATCH, DELETE)
│   │   ├── layout/                    # Header y Footer con diseño comercial
│   │   │   ├── header.component.ts
│   │   │   └── footer.component.ts
│   │   ├── app.component.ts           # Shell principal
│   │   ├── app.routes.ts              # Enrutador con Lazy Loading
│   │   └── app.config.ts              # Configuración y providers de Angular 19
│   ├── environments/                  # Variables de entorno y placeholders
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   ├── styles.css                     # Sistema de diseño CSS moderno
│   └── index.html                     # Tipografía Google Fonts y metadatos
```

---

## 5. Matriz de Endpoints y Contrato JSON

El frontend consume exclusivamente las rutas reales definidas en los controladores Spring Boot:

| Método | Endpoint Backend | Acceso Requerido | Contrato JSON / DTO |
| :--- | :--- | :--- | :--- |
| `GET` | `/public/health` | Público | `{ status: "UP", system: "Pedidos360..." }` |
| `GET` | `/public/productos` | Público | Lista `Producto[]` (`id`, `nombre`, `precio`, `categoria`, `stock`) |
| `GET` | `/public/productos/{id}`| Público | Objeto `Producto` |
| `GET` | `/api/profile` | Autenticado (`Bearer`) | `{ status: "ok", user: "...", authorities: [...] }` |
| `GET` | `/api/pedidos` | Autenticado (`Bearer`) | Lista `Pedido[]` del cliente |
| `GET` | `/api/pedidos/{id}` | Autenticado (`Bearer`) | Objeto `Pedido` con sus ítems desglosados |
| `POST` | `/api/pedidos` | Scope `recurso.write` | Payload: `PedidoCreateDTO` -> Responde `201 Created` con `Pedido` |
| `GET` | `/api/admin/pedidos` | Rol `ROLE_ADMIN` | `{ totalPedidos: n, totalRecaudado: n, pedidos: [...] }` |
| `PATCH`| `/api/admin/pedidos/{id}/estado` | Rol `ROLE_ADMIN` | Payload: `{ "estado": "EN_PREPARACION" }` -> Responde `200 OK` |
| `DELETE`| `/api/admin/pedidos/{id}` | Rol `ROLE_ADMIN` | Retorna `204 No Content` |

### Ejemplo: Payload exacto de creación (`POST /api/pedidos`)
```json
{
  "clienteNombre": "Nicolás García",
  "clienteEmail": "nicolas@duocuc.cl",
  "items": [
    { "productoId": 1, "cantidad": 2 },
    { "productoId": 5, "cantidad": 1 }
  ]
}
```

---

## 6. Configuración de Azure Active Directory (Microsoft Entra ID)

Para conectar el sistema a tu Tenant institucional o suscripción de Azure:

### 1. Registrar la Aplicación Frontend (SPA)
1. Ingresa a [portal.azure.com](https://portal.azure.com) &rarr; **Microsoft Entra ID** &rarr; **App registrations** &rarr; **New registration**.
2. **Name:** `Pedidos360-Frontend`.
3. **Supported account types:** *Accounts in this organizational directory only* (o Multitenant si aplica).
4. **Redirect URI:** Selecciona plataforma **Single-page application (SPA)** y escribe:
   ```text
   http://localhost:4200
   ```
5. Pulsa **Register**.
6. Copia el **Application (client) ID** y el **Directory (tenant) ID**.

### 2. Configurar Permisos de API y Scopes
1. En la aplicación registrada de la API Backend (`Pedidos360-Backend`):
   - Ve a **Expose an API**.
   - Define el Application ID URI: `api://pedidos360-api`.
   - Agrega un Scope:
     - Scope name: `recurso.write`
     - Who can consent: *Admins and users*
     - Display name: `Crear pedidos en Pedidos360`
2. En la aplicación del Frontend (`Pedidos360-Frontend`):
   - Ve a **API permissions** &rarr; **Add a permission** &rarr; **My APIs** &rarr; selecciona la API Backend.
   - Elige **Delegated permissions** y marca `recurso.write`.
   - Concede el consentimiento de administrador (*Grant admin consent*).

### 3. Configurar el Rol Administrativo (`ROLE_ADMIN`)
1. En la API Backend en Azure:
   - Ve a **App roles** &rarr; **Create app role**.
   - Display name: `Administrador de Pedidos`
   - Allowed member types: *Users/Groups*
   - Value: `ADMIN` *(¡Importante!: Spring Security `AuthoritiesConverter` toma `ADMIN` y le antepone `ROLE_` generando `ROLE_ADMIN`)*.
2. Asignar el rol a tu usuario:
   - Ve a **Enterprise applications** &rarr; selecciona la API &rarr; **Users and groups** &rarr; **Add user/group** &rarr; asigna tu usuario con el rol `Administrador de Pedidos`.

### 4. Configurar las Variables de Entorno en Angular
Abre `src/environments/environment.ts` y actualiza los valores:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080', // O URL de AWS API Gateway
  azure: {
    clientId: 'TU_AZURE_CLIENT_ID_REAL',
    tenantId: 'TU_AZURE_TENANT_ID_REAL',
    redirectUri: 'http://localhost:4200',
    authority: 'https://login.microsoftonline.com/TU_AZURE_TENANT_ID_REAL',
    apiScope: 'api://pedidos360-api/recurso.write',
    loginScopes: ['openid', 'profile', 'email']
  },
  demoMode: false // Pon en false cuando uses credenciales reales de Azure
};
```

---

## 7. Modo de Evaluación y Demostración Académica

Para facilitar la corrección inmediata de la rúbrica al docente/evaluador **sin necesidad de crear un tenant de Azure en ese momento**, la aplicación incluye un **Modo de Demostración**:

1. Ingresa a `/login`.
2. Verás dos accesos rápidos:
   - **Entrar como ADMIN**: Asigna el rol `ROLE_ADMIN`, desbloquea la pestaña **Administración**, permite ver todas las órdenes, métricas de recaudación, cambiar estados (PATCH) y eliminar pedidos (DELETE).
   - **Entrar como Cliente**: Permite navegar el catálogo, agregar al carrito, simular o enviar la orden real al backend y hacer seguimiento visual del pedido en su Timeline.
3. En cualquier momento puedes alternar entre **ADMIN** y **CLIENTE** directamente desde el selector de la barra de navegación superior (botón 🛡️/👤).

---

## 8. Compilación para Producción y Pruebas

### Generar Build de Producción
```powershell
npm run build
```
Genera los artefactos minificados y optimizados con `outputHashing: all` en la carpeta `dist/frontend`.

### Ejecutar Pruebas Unitarias
El proyecto incluye 19 pruebas automatizadas con Jasmine y Karma:
```powershell
npm test -- --watch=false --browsers=ChromeHeadless
```
*(Resultado: `TOTAL: 19 SUCCESS`).*

Valida:
- Comportamiento reactivo de `CartService` (adición, stock máximo, cálculo de total en CLP, vaciado).
- Construcción estricta de `PedidoCreateDTO`.
- Protección de rutas privadas con `authGuard`.
- Bloqueo y control de acceso por rol con `adminGuard` (`ROLE_ADMIN`).
- Peticiones REST con HttpClient.

---

## 9. Configuración CORS en el Backend

El backend en [SecurityConfig.java](file:///c:/Users/NicolasG/Desktop/backendcloud/CloudeNative/backend/src/main/java/cl/duoc/pedidos360/security/SecurityConfig.java) y [application.yml](file:///c:/Users/NicolasG/Desktop/backendcloud/CloudeNative/backend/src/main/resources/application.yml) ya tiene configurado:
```yaml
app:
  security:
    allowed-origins: http://localhost:4200,http://localhost:5173,http://localhost:3000
```
Por lo tanto, la aplicación en `http://localhost:4200` puede comunicarse de inmediato con `http://localhost:8080` sin bloqueos de origen cruzado.
