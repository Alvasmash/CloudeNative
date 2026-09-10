# Pedidos360 - Backend REST API (Evaluacion Parcial N° 1)
**Asignatura:** Desarrollo Cloud Native I (DSY1107)  
**Seccion:** 002D  
**Tecnologias:** Java 21  Spring Boot 3.4  Spring Security  OAuth2 Resource Server (Azure AD)  Spring Data JPA  H2 Database / AWS RDS

---

## 1. Cmo se Prende el Backend? (Gua Paso a Paso)

### Requisitos Previos
Asegurate de tener instalados en tu computador:
1. **Java JDK 21** o superior. Verifica con:
   ```bash
   java -version
   ```
2. **Apache Maven 3.8+**. Verifica con:
   ```bash
   mvn -version
   ```

---

### Paso 1: Abrir la terminal en la carpeta del backend
En tu Visual Studio Code, abre una nueva terminal (PowerShell o CMD) y entra a la carpeta `backend`:
```powershell
cd backend
```

### Paso 2: Ejecutar los tests unitarios y de seguridad
Para comprobar que todo el codigo compila y pasa las pruebas de la rbrica al 100%:
```powershell
mvn clean test
```
*(Debe mostrar `BUILD SUCCESS` con 10 tests aprobados).*

### Paso 3: Encender el servidor Spring Boot
Para prender el backend en tu mquina local:
```powershell
mvn spring-boot:run
```

Listo! El servidor se iniciar en el puerto **8080** (`http://localhost:8080`). Vers el logo de Spring Boot y el mensaje:
```text
Started Pedidos360BackendApplication in X.XXX seconds
```

Para apagar el servidor en cualquier momento, presiona `Ctrl + C` en la terminal.

---

## 2. Comandos utiles de Maven

| Comando | Para que sirve |
|---|---|
| `mvn spring-boot:run` | **Prende el servidor** en modo desarrollo (`http://localhost:8080`). |
| `mvn clean test` | **Ejecuta las 10 pruebas automatizadas** de seguridad y persistencia. |
| `mvn clean package` | **Compila y genera el archivo JAR** ejecutable dentro de `target/` (ideal para desplegar en AWS EC2). |
| `java -jar target/pedidos360-backend-0.0.1-SNAPSHOT.jar` | **Corre el backend directamente desde el JAR compilado**. |

---

## 3. Cmo Probar que el Backend esta Funcionando?

### A. Prueba Rpida en el Navegador
Abre tu navegador web y visita:
- **Salud del sistema:** [http://localhost:8080/public/health](http://localhost:8080/public/health)
  - Respuesta esperada: `{"status":"UP","system":"Pedidos360 Backend - Seccion 002D","access":"public"}`
- **Catalogo de productos:** [http://localhost:8080/public/productos](http://localhost:8080/public/productos)
  - Respuesta esperada: La lista completa de pizzas, hamburguesas y bebidas cargadas desde `data.sql`.
- **Consola de Base de Datos H2:** [http://localhost:8080/h2-console](http://localhost:8080/h2-console)
  - JDBC URL: `jdbc:h2:mem:pedidosdb`
  - Usuario: `sa`
  - Password: *(en blanco)*

---

### B. Pruebas de Seguridad (Desde Visual Studio Code)
Abre el archivo `requests.http` en tu VS Code (con la extensin **REST Client** de Huachao Mao instalada). Vers un botn interactivo llamado **Send Request** sobre cada consulta:

1. **Caso Publico (200 OK):** Consulta `GET /public/productos` sin credenciales.
2. **Caso Protegido sin Token (401 Unauthorized):** Consulta `GET /api/pedidos` sin token -> El backend responde `401` con JSON estructurado.
3. **Caso Token Invalido (401 Unauthorized):** Enviaa un token falso -> El backend valida la firma criptogrfica y lo rechaza con `401`.
4. **Caso Token Valido sin Scope (403 Forbidden):** Intenta hacer `POST /api/pedidos` sin el scope `recurso.write` -> Responde `403`.
5. **Caso Token Valido con Scope (201 Created):** Enviaa el token con `recurso.write` -> Descuenta stock y crea la orden con `201 Created`.
6. **Caso Admin (200 OK con ROLE_ADMIN / 403 sin l):** Consulta `GET /api/admin/pedidos`.

---

## 4. Matriz de Endpoints y Seguridad

| Mtodo | Ruta | Acceso Requerido | Codigo Esperado |
|---|---|---|---|
| `GET` | `/public/health` | Publico (sin token) | `200 OK` |
| `GET` | `/public/productos` | Publico (sin token) | `200 OK` |
| `GET` | `/public/productos/{id}` | Publico (sin token) | `200 OK` / `404` |
| `GET` | `/api/profile` | Autenticado | `200 OK` / `401` |
| `GET` | `/api/pedidos` | Autenticado | `200 OK` / `401` |
| `GET` | `/api/pedidos/{id}` | Autenticado | `200 OK` / `401` / `404` |
| `POST` | `/api/pedidos` | Requiere scope `recurso.write` | `201 Created` / `403` |
| `GET` | `/api/admin/pedidos` | Requiere App Role `ROLE_ADMIN` | `200 OK` / `403` |
| `PATCH` | `/api/admin/pedidos/{id}/estado` | Requiere App Role `ROLE_ADMIN` | `200 OK` / `403` / `404` |
| `DELETE` | `/api/admin/pedidos/{id}` | Requiere App Role `ROLE_ADMIN` | `204 No Content` / `403` |

---

## 5. Variables de Entorno (Configuracion Cloud)

El backend sigue las buenas practicas **12-Factor App**: toda la configuracion sensible se puede sobreescribir con variables de entorno sin tocar el codigo Java.

| Variable | Descripcin | Valor por Defecto |
|---|---|---|
| `JWT_ISSUER` | URL de Microsoft Entra ID / Azure AD | `https://login.microsoftonline.com/common/v2.0` |
| `JWT_AUDIENCE` | Audiencia / Client ID de la API | `api://pedidos360-api` |
| `ALLOWED_ORIGINS` | Orgenes permitidos para CORS (Angular) | `http://localhost:4200,http://localhost:5173` |
| `SPRING_DATASOURCE_URL` | Conexin a Base de Datos (ej: AWS RDS) | `jdbc:h2:mem:pedidosdb` |
| `SPRING_DATASOURCE_USERNAME` | Usuario de base de datos | `sa` |
| `SPRING_DATASOURCE_PASSWORD` | Contrasea de base de datos | *(vacioo)* |

### Ejemplo: Cmo pasar variables en PowerShell antes de iniciar
```powershell
$env:JWT_ISSUER="https://login.microsoftonline.com/TU_TENANT_ID/v2.0"
$env:JWT_AUDIENCE="api://TU_API_CLIENT_ID"
mvn spring-boot:run
```
