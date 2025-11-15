# Postman Collections para Gym API GraphQL

Este directorio contiene dos colecciones de Postman para probar la API GraphQL del Gym Management System.

## 📁 Archivos Disponibles

### 1. **Gym-API-GraphQL.postman_collection.json**
Colección estándar de pruebas GraphQL sin scripts automáticos.
- **Uso**: Pruebas manuales
- **Ventaja**: Más simple, control total sobre las variables
- **Mejor para**: Aprender y entender la API

### 2. **Gym-API-GraphQL-Auto-Vars.postman_collection.json** ⭐ RECOMENDADO
Colección mejorada con scripts automáticos que guardan variables.
- **Uso**: Automatización de flujos de testing
- **Ventaja**: Las variables se guardan automáticamente después de cada acción
- **Mejor para**: Workflow eficiente y testing integrado

### 3. **Gym-API-Env.postman_environment.json**
Variables de entorno necesarias para ambas colecciones.
- **BASE_URL**: URL completa del servidor (ej: http://localhost:3000)
- **BASE_URL_HOST**: Host del servidor (ej: localhost)
- **BASE_URL_PORT**: Puerto (ej: 3000)
- **AUTH_TOKEN**: Token JWT de autenticación (se autoguarda)
- **ADMIN_ID**: ID del usuario admin (se autoguarda)
- **USER_ID**: ID del usuario actual (se autoguarda)
- **MEMBERSHIP_ID**: ID de membresía (se autoguarda)
- **SUBSCRIPTION_ID**: ID de suscripción (se autoguarda)
- **ATTENDANCE_ID**: ID de asistencia (se autoguarda)

### 4. **GRAPHQL VARIABLES.md**
Documentación con ejemplos de variables para todas las queries/mutations.

---

## 🚀 Cómo Usar

### Paso 1: Importar Environment
1. Abre Postman
2. Click en **Environments** (lado izquierdo)
3. Click en **Import**
4. Selecciona `Gym-API-Env.postman_environment.json`

### Paso 2: Importar Colección
1. Click en **Collections** (lado izquierdo)
2. Click en **Import**
3. Selecciona `Gym-API-GraphQL-Auto-Vars.postman_collection.json`

### Paso 3: Seleccionar Environment
1. En la esquina superior derecha, selecciona el environment: **Gym API Environment**

### Paso 4: Comenzar a Probar
La colección está organizada en carpetas:
- **Authentication**: Login/Signup
- **Memberships**: Crud de membresías
- **Subscriptions**: Crud de suscripciones
- **Attendances**: Control de asistencias
- **Seed**: Poblar base de datos

---

## ✨ Variables Automáticas (Colección Auto-Vars)

### Login/Signup
Después de hacer login o signup, se guardan automáticamente:
- ✓ `AUTH_TOKEN` - Token JWT para requests autenticados
- ✓ `USER_ID` - ID del usuario que hizo login
- ✓ `ADMIN_ID` - ID del admin (solo si haces login como admin)

**Flujo de ejemplo:**
```
1. Login - Admin
   ↓ (script guarda AUTH_TOKEN y ADMIN_ID)
2. Get All Memberships (usa AUTH_TOKEN automáticamente)
   ↓ (script guarda MEMBERSHIP_ID)
3. Get Membership by ID (usa MEMBERSHIP_ID automáticamente)
```

### Memberships
- ✓ `MEMBERSHIP_ID` - Se guarda al hacer Get All Memberships o Create Membership

### Subscriptions
- ✓ `SUBSCRIPTION_ID` - Se guarda al hacer Get All Subscriptions o Create Subscription

### Attendances
- ✓ `ATTENDANCE_ID` - Se guarda al hacer Check In (Gym o Class)

---

## 📝 Ejemplo de Flujo Completo

### 1️⃣ Ejecutar Seed
```
GET /seed
```
Crea usuarios y membresías iniciales

### 2️⃣ Login
```
POST /graphql
mutation login($loginInput: LoginInput!) {
  login(loginInput: $loginInput) {
    token
    user { id email }
  }
}
```
✓ Se guardan: `AUTH_TOKEN`, `USER_ID`

### 3️⃣ Obtener Membresías
```
POST /graphql
query memberships {
  memberships {
    id
    name
    cost
    ...
  }
}
```
✓ Se guarda: `MEMBERSHIP_ID` (primera membresía)

### 4️⃣ Crear Suscripción
```
POST /graphql
mutation createSubscriptionForUser($userId: String!) {
  createSubscriptionForUser(userId: $userId) {
    id
    ...
  }
}
```
✓ Se guarda: `SUBSCRIPTION_ID`

### 5️⃣ Check In
```
POST /graphql
mutation createAttendance($createAttendanceInput: CreateAttendanceInput!) {
  createAttendance(createAttendanceInput: $createAttendanceInput) {
    id
    ...
  }
}
```
✓ Se guarda: `ATTENDANCE_ID`

---

## 🔧 Personalizar Scripts

Los scripts están en la sección **Tests** de cada request. Para modificar qué variable se guarda:

```javascript
// Ejemplo: Guardar variable personalizada
pm.environment.set('MI_VARIABLE', valor);
console.log('✓ Variable guardada:', valor);
```

---

## ❓ Preguntas Frecuentes

**¿Qué pasa si un request falla?**
Los scripts solo se ejecutan si el response es 200. Si falla, la variable no se guarda.

**¿Cómo resetear las variables?**
Click derecho en el Environment → Edit → Reset all

**¿Puedo usar ambas colecciones simultáneamente?**
Sí, ambas usan el mismo environment.

**¿Los scripts se ejecutan automáticamente?**
Sí, se ejecutan después de cada request exitoso.

---

## 📚 Documentación Adicional

- Ver `GRAPHQL VARIABLES.md` para ejemplos de variables en cada endpoint
- Ver `GRAPHQL QUERIES.md` (si existe) para estructura de queries complejas
- Revisar `postman/schema.gql` para ver el esquema GraphQL completo
