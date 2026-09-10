# Pedidos360 - Backend REST API (Evaluaci�n Parcial N� 1)
**Asignatura:** Desarrollo Cloud Native I (DSY1107)  
**Secci�n:** 002D  
**Tecnolog�as:** Java 21 � Spring Boot 3.4 � Spring Security � OAuth2 Resource Server (Azure AD) � Spring Data JPA � H2 Database / AWS RDS

---

## 1. �C�mo se Prende el Backend? (Gu�a Paso a Paso)

### Requisitos Previos
Aseg�rate de tener instalados en tu computador:
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
Para comprobar que todo el c�digo compila y pasa las pruebas de la r�brica al 100%:
```powershell
mvn clean test
```
*(Debe mostrar `BUILD SUCCESS` con 10 tests aprobados).*

### Paso 3: Encender el servidor Spring Boot
Para prender el backend en tu m�quina local:
```powershell
mvn spring-boot:run
```

�Listo! El servidor se iniciar� en el puerto **8080** (`http://localhost:8080`). Ver�s el logo de Spring Boot y el mensaje:
```text
Started Pedidos360BackendApplication in X.XXX seconds
```

Para apagar el servidor en cualquier momento, presiona `Ctrl + C` en la terminal.

---

## 2. Comandos �tiles de Maven

| Comando | Para qu� sirve |
|---|---|
| `mvn spring-boot:run` | **Prende el servidor** en modo desarrollo (`http://localhost:8080`). |
| `mvn clean test` | **Ejecuta las 10 pruebas automatizadas** de seguridad y persistencia. |
| `mvn clean package` | **Compila y genera el archivo JAR** ejecutable dentro de `target/` (ideal para desplegar en AWS EC2). |
| `java -jar target/pedidos360-backend-0.0.1-SNAPSHOT.jar` | **Corre el backend directamente desde el JAR compilado**. |

---

## 3. �C�mo Probar que el Backend est� Funcionando?

### A. Prueba R�pida en el Navegador
Abre tu navegador web y visita:
- **Salud del sistema:** [http://localhost:8080/public/health](http://localhost:8080/public/health)
  - Respuesta esperada: `{"status":"UP","system":"Pedidos360 Backend - Seccion 002D","access":"public"}`
- **Cat�logo de productos:** [http://localhost:8080/public/productos](http://localhost:8080/public/productos)
  - Respuesta esperada: La lista completa de pizzas, hamburguesas y bebidas cargadas desde `data.sql`.
- **Consola de Base de Datos H2:** [http://localhost:8080/h2-console](http://localhost:8080/h2-console)
  - JDBC URL: `jdbc:h2:mem:pedidosdb`
  - Usuario: `sa`
  - Password: *(en blanco)*

---

### B. Pruebas de Seguridad (Desde Visual Studio Code)
Abre el archivo `requests.http` en tu VS Code (con la extensi�n **REST Client** de Huachao Mao instalada). Ver�s un bot�n interactivo llamado **Send Request** sobre cada consulta:

1. **Caso P�blico (200 OK):** Consulta `GET /public/productos` sin credenciales.
2. **Caso Protegido sin Token (401 Unauthorized):** Consulta `GET /api/pedidos` sin token -> El backend responde `401` con JSON estructurado.
3. **Caso Token Inv�lido (401 Unauthorized):** Env�a un token falso -> El backend valida la firma criptogr�fica y lo rechaza con `401`.
4. **Caso Token V�lido sin Scope (403 Forbidden):** Intenta hacer `POST /api/pedidos` sin el scope `recurso.write` -> Responde `403`.
5. **Caso Token V�lido con Scope (201 Created):** Env�a el token con `recurso.write` -> Descuenta stock y crea la orden con `201 Created`.
6. **Caso Admin (200 OK con ROLE_ADMIN / 403 sin �l):** Consulta `GET /api/admin/pedidos`.

---

## 4. Matriz de Endpoints y Seguridad

| M�todo | Ruta | Acceso Requerido | C�digo Esperado |
|---|---|---|---|
| `GET` | `/public/health` | P�blico (sin token) | `200 OK` |
| `GET` | `/public/productos` | P�blico (sin token) | `200 OK` |
| `GET` | `/public/productos/{id}` | P�blico (sin token) | `200 OK` / `404` |
| `GET` | `/api/profile` | Autenticado | `200 OK` / `401` |
| `GET` | `/api/pedidos` | Autenticado | `200 OK` / `401` |
| `GET` | `/api/pedidos/{id}` | Autenticado | `200 OK` / `401` / `404` |
| `POST` | `/api/pedidos` | Requiere scope `recurso.write` | `201 Created` / `403` |
| `GET` | `/api/admin/pedidos` | Requiere App Role `ROLE_ADMIN` | `200 OK` / `403` |
| `PATCH` | `/api/admin/pedidos/{id}/estado` | Requiere App Role `ROLE_ADMIN` | `200 OK` / `403` / `404` |
| `DELETE` | `/api/admin/pedidos/{id}` | Requiere App Role `ROLE_ADMIN` | `204 No Content` / `403` |

---

## 5. Variables de Entorno (Configuraci�n Cloud)

El backend sigue las buenas pr�cticas **12-Factor App**: toda la configuraci�n sensible se puede sobreescribir con variables de entorno sin tocar el c�digo Java.

| Variable | Descripci�n | Valor por Defecto |
|---|---|---|
| `JWT_ISSUER` | URL de Microsoft Entra ID / Azure AD | `https://login.microsoftonline.com/common/v2.0` |
| `JWT_AUDIENCE` | Audiencia / Client ID de la API | `api://pedidos360-api` |
| `ALLOWED_ORIGINS` | Or�genes permitidos para CORS (Angular) | `http://localhost:4200,http://localhost:5173` |
| `SPRING_DATASOURCE_URL` | Conexi�n a Base de Datos (ej: AWS RDS) | `jdbc:h2:mem:pedidosdb` |
| `SPRING_DATASOURCE_USERNAME` | Usuario de base de datos | `sa` |
| `SPRING_DATASOURCE_PASSWORD` | Contrase�a de base de datos | *(vac�o)* |

### Ejemplo: C�mo pasar variables en PowerShell antes de iniciar
```powershell
$env:JWT_ISSUER="https://login.microsoftonline.com/TU_TENANT_ID/v2.0"
$env:JWT_AUDIENCE="api://TU_API_CLIENT_ID"
mvn spring-boot:run
```
