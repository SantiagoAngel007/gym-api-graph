# INFORME TÉCNICO: GYM-API-GRAPH

---

## 1. ESTRUCTURA GENERAL DEL PROYECTO Y DIRECTORIOS PRINCIPALES

Gym-API-Graph es una API de gestión de gimnasio construida con NestJS y GraphQL. La estructura del proyecto es la siguiente:

```
gym-api-graph/
├── src/
│   ├── auth/                   # Módulo de autenticación
│   ├── memberships/            # Módulo de membresías
│   ├── subscriptions/          # Módulo de suscripciones
│   ├── attendances/            # Módulo de asistencias
│   ├── seed/                   # Datos de inicialización
│   ├── app.module.ts           # Módulo principal
│   ├── app.controller.ts       # Controlador principal
│   ├── app.service.ts          # Servicio principal
│   └── main.ts                 # Punto de entrada
├── test/                       # Tests de integración
├── __mocks__/                  # Mocks para testing
├── dist/                       # Compilación de producción
├── postman/                    # Colecciones de Postman
├── graphql-examples/           # Ejemplos de GraphQL
├── node_modules/               # Dependencias
├── docker-compose.yml          # Configuración Docker
├── package.json                # Dependencias NPM
├── tsconfig.json              # Configuración TypeScript
├── nest-cli.json              # Configuración NestJS CLI
├── jest.config.js             # Configuración Jest
├── eslint.config.mjs          # Configuración ESLint
├── .prettierrc                 # Configuración Prettier
├── render.yaml                # Configuración Render
├── vercel.json                # Configuración Vercel
├── schema.gql                 # Schema GraphQL generado
└── .env.example               # Variables de entorno ejemplo
```

---

## 2. TECNOLOGÍAS Y DEPENDENCIAS UTILIZADAS

### Dependencias Principales

| Categoría | Paquete | Versión | Propósito |
|-----------|---------|---------|----------|
| **Framework** | @nestjs/core | ^11.0.1 | Framework principal |
| | @nestjs/common | ^11.0.1 | Utilidades comunes |
| | @nestjs/platform-express | ^11.0.1 | Servidor HTTP |
| **GraphQL** | @nestjs/graphql | ^13.2.0 | Integración GraphQL |
| | @nestjs/apollo | ^13.2.1 | Driver Apollo |
| | @apollo/server | ^5.1.0 | Servidor Apollo |
| | graphql | ^16.12.0 | Motor GraphQL |
| **Base de Datos** | @nestjs/typeorm | ^11.0.0 | ORM para NestJS |
| | typeorm | ^0.3.27 | ORM relacional |
| | pg | ^8.16.3 | Driver PostgreSQL |
| **Autenticación** | @nestjs/jwt | ^11.0.1 | JWT para NestJS |
| | @nestjs/passport | ^11.0.5 | Integración Passport |
| | passport | ^0.7.0 | Middleware autenticación |
| | passport-jwt | ^4.0.1 | Estrategia JWT |
| | bcryptjs | ^3.0.2 | Encriptación contraseñas |
| **Validación** | class-validator | ^0.14.2 | Validación de clases |
| | class-transformer | ^0.5.1 | Transformación objetos |
| **Configuración** | @nestjs/config | ^4.0.2 | Gestión de configuración |
| | @nestjs/swagger | ^11.2.1 | Documentación Swagger |
| **Utilidades** | reflect-metadata | ^0.2.2 | Metadatos decoradores |
| | rxjs | ^7.8.1 | Programación reactiva |

### Dependencias de Desarrollo

| Categoría | Paquete | Versión | Propósito |
|-----------|---------|---------|----------|
| **Build** | typescript | ^5.7.3 | Lenguaje TypeScript |
| | @nestjs/cli | ^11.0.10 | CLI de NestJS |
| | ts-jest | ^29.2.5 | Jest + TypeScript |
| **Testing** | jest | ^30.0.0 | Framework testing |
| | @nestjs/testing | ^11.0.1 | Utilidades testing |
| | supertest | ^7.0.0 | Testing HTTP |
| **Linting** | eslint | ^9.18.0 | Linter JavaScript |
| | prettier | ^3.4.2 | Formateador código |
| **Types** | @types/node | ^22.10.7 | Tipos Node.js |
| | @types/express | ^5.0.0 | Tipos Express |

### Requisitos del Sistema

- Node.js: >=18.0.0
- NPM: >=9.0.0
- Bun: >=1.0.0 (opcional)

---

## 3. PROPÓSITO DEL PROYECTO Y DESCRIPCIÓN GENERAL

Gym-API-Graph es un sistema de gestión integral para gimnasios que proporciona funcionalidades para administrar:

- **Gestión de Usuarios**: Registro, autenticación, gestión de roles y perfiles
- **Membresías**: Crear y gestionar tipos de membresía con diferentes beneficios
- **Suscripciones**: Asignar membresías a usuarios con control de acceso y límites
- **Asistencias**: Registrar check-in/check-out de miembros con seguimiento de uso

El proyecto está diseñado para despliegue en entornos cloud, con soporte para Vercel y Render.

**Objetivos principales:**

- Proporcionar una API GraphQL segura y documentada
- Gestionar múltiples roles de usuario (admin, coach, client, receptionist)
- Controlar acceso basado en suscripciones activas
- Registrar y analizar asistencia de miembros
- Mantener base de datos relacional PostgreSQL

---

## 4. PRINCIPALES COMPONENTES/MÓDULOS

### A. Módulo de Autenticación (Auth)

**Ubicación**: `src/auth/`

**Responsabilidades**:
- Registro de nuevos usuarios
- Autenticación con JWT
- Gestión de roles y permisos
- Validación de tokens
- Encriptación de contraseñas

**Componentes principales**:
- `AuthService`: Lógica de autenticación
- `AuthResolver`: Queries y mutations GraphQL
- `JwtStrategy`: Validación JWT con Passport
- `GqlAuthGuard`: Guard para proteger resolvers GraphQL
- `User` Entity: Usuarios del sistema
- `Role` Entity: Roles y permisos

**DTOs**:
- `CreateUserInput`: Registro de usuario
- `LoginInput`: Autenticación
- `UpdateUserInput`: Actualización de usuario
- `AddRoleInput` / `RemoveRoleInput`: Gestión de roles

---

### B. Módulo de Membresías (Memberships)

**Ubicación**: `src/memberships/`

**Responsabilidades**:
- CRUD de tipos de membresía
- Definición de beneficios y límites
- Control de estado de membresías

**Componentes principales**:
- `MembershipsService`: Lógica de membresías
- `MembershipsResolver`: Queries y mutations GraphQL
- `Membership` Entity: Datos de membresía

**Propiedades principales**:
- `name`: Nombre de la membresía
- `cost`: Costo de la membresía
- `max_classes_assistance`: Límite de clases
- `max_gym_assistance`: Límite de uso de gimnasio
- `duration_months`: Duración en meses
- `status`: Estado activo/inactivo

---

### C. Módulo de Suscripciones (Subscriptions)

**Ubicación**: `src/subscriptions/`

**Responsabilidades**:
- Crear suscripciones para usuarios
- Asignar membresías a suscripciones
- Gestionar estado de suscripciones
- Cálculo de límites disponibles

**Componentes principales**:
- `SubscriptionsService`: Lógica de suscripciones
- `SubscriptionsResolver`: Queries y mutations GraphQL
- `Subscription` Entity: Datos de suscripción

**Propiedades principales**:
- `name`: Nombre de la suscripción
- `cost`: Costo total
- `purchase_date`: Fecha de compra
- `isActive`: Estado activo/inactivo
- `max_classes_assistance` / `max_gym_assistance`: Límites agregados

---

### D. Módulo de Asistencias (Attendances)

**Ubicación**: `src/attendances/`

**Responsabilidades**:
- Registrar check-in/check-out de usuarios
- Validar límites de acceso disponibles
- Obtener estado actual de asistencia
- Histórico de asistencias

**Componentes principales**:
- `AttendancesService`: Lógica de registros
- `AttendancesResolver`: Queries y mutations GraphQL
- `Attendance` Entity: Registro de asistencia

**Propiedades principales**:
- `type`: Tipo de asistencia (GYM o CLASS)
- `entranceDatetime`: Hora de entrada
- `exitDatetime`: Hora de salida (nullable)
- `isActive`: Si el usuario está dentro
- `dateKey`: Clave de fecha para agrupación

---

### E. Módulo de Seed (Inicialización de datos)

**Ubicación**: `src/seed/`

**Responsabilidades**:
- Poblar base de datos con datos iniciales
- Crear roles por defecto
- Crear usuarios de ejemplo
- Crear membresías de ejemplo

---

## 5. CONFIGURACIÓN (ARCHIVOS DE CONFIGURACIÓN)

### A. TypeScript (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "module": "nodenext",
    "target": "ES2023",
    "outDir": "./dist",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "sourceMap": true,
    "strict": true
  }
}
```

- Compila TypeScript a ES2023
- Habilita decoradores experimentales de NestJS
- Genera source maps para debugging
- Output en carpeta `dist/`

### B. NestJS CLI (`nest-cli.json`)

- Usa esquemas de NestJS para generación de código
- Root source en carpeta `src/`
- Limpia directorio de salida antes de compilar

### C. Jest (`jest.config.js`)

- rootDir: 'src'
- testRegex: '.*\.spec\.ts$'
- transform: 'ts-jest'
- collectCoverageFrom: '**/*.(t|j)s'
- coverageDirectory: '../coverage'

### D. ESLint (`eslint.config.mjs`)

- Configuración flat config moderna
- Integración con TypeScript ESLint
- Integración con Prettier
- Rules personalizadas según necesidades

### E. Prettier (`.prettierrc`)

- Comillas simples
- Comas finales en arrays/objetos multilínea

### F. GraphQL (`schema.gql`)

- Schema generado automáticamente de los resolvers
- Define tipos, queries, mutations e inputs
- Se genera en `src/schema.gql` en desarrollo
- Se genera en memoria en producción (Vercel)

### G. Variables de Entorno (`.env.example`)

```
DB_HOST=localhost
DB_PORT=5433
DB_NAME=gym_api_graphql
DB_USERNAME=gymuser
DB_PASSWORD=gympass123

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

NODE_ENV=development
PORT=9091
```

### H. Docker Compose (`docker-compose.yml`)

**Servicio PostgreSQL**:
- Imagen: `postgres:15-alpine`
- Puerto: 5433
- Volumen persistente para datos

**Servicio PgAdmin**:
- Imagen: `dpage/pgadmin4:latest`
- Puerto: 5051

### I. Configuración de Despliegue

**Render (`render.yaml`)**:
```yaml
buildCommand: npm install && npx tsc -p tsconfig.json
startCommand: node dist/main.js
Environment: production
Port: 9092
```

**Vercel (`vercel.json`)**:
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "nestjs"
}
```

---

## 6. SCRIPTS DISPONIBLES

### Scripts de Desarrollo

```bash
npm run start          # Inicia la aplicación
npm run start:dev      # Inicia con watch mode
npm run start:debug    # Inicia con debugger
npm run start:prod     # Inicia producción
npm run start:bun      # Alterna runtime a Bun
```

### Scripts de Build

```bash
npm run build          # Compila TypeScript
```

### Scripts de Testing

```bash
npm run test           # Tests unitarios
npm run test:watch     # Tests en watch mode
npm run test:cov       # Tests con reporte de cobertura
npm run test:debug     # Tests con debugger
npm run test:e2e       # Tests de integración
npm run test:unit      # Tests unitarios
npm run test:integration # Tests de integración
npm run test:all       # Todos los tests
npm run test:coverage  # Reporte de cobertura
```

### Scripts de Linting & Formatting

```bash
npm run lint           # Ejecuta ESLint
npm run format         # Formatea código
```

---

## 7. ESTRUCTURA DE CARPETAS Y PROPÓSITO

| Carpeta | Propósito |
|---------|-----------|
| `src/` | Código fuente TypeScript |
| `src/auth/` | Módulo de autenticación |
| `src/memberships/` | Módulo de membresías |
| `src/subscriptions/` | Módulo de suscripciones |
| `src/attendances/` | Módulo de asistencias |
| `src/seed/` | Módulo de inicialización |
| `test/` | Tests de integración |
| `__mocks__/` | Datos mock para testing |
| `dist/` | Código compilado a JavaScript |
| `postman/` | Colecciones para testing manual |
| `graphql-examples/` | Ejemplos de consultas GraphQL |
| `node_modules/` | Dependencias del proyecto |

---

## 8. ARCHIVOS PRINCIPALES DE ENTRADA

### `src/main.ts` - Punto de Entrada de la Aplicación

**Responsabilidades**:
1. Crear la instancia de aplicación NestJS
2. Habilitar CORS
3. Aplicar ValidationPipe global
4. Inicializar la aplicación
5. Iniciar servidor local o exportar para Vercel

**Características principales**:
- CORS habilitado para cualquier origen
- ValidationPipe con whitelist y transformación automática
- Logger personalizado para debug
- Soporte dual: desarrollo (puerto 9091) y producción (Vercel serverless)

### `src/app.module.ts` - Módulo Principal

**Configuración**:
- ConfigModule: Gestión de variables de entorno
- GraphQLModule: Apollo Driver con schema auto-generation
- TypeOrmModule: Conexión PostgreSQL
- Módulos de negocio

**Database Config**:
- Host, Port, Database: Desde .env
- Username/Password: Desde .env
- AutoLoadEntities: true
- Synchronize: true en desarrollo, false en producción
- SSL: Habilitado en producción

---

## 9. ARQUITECTURA Y PATRONES IMPLEMENTADOS

### Patrón Modular NestJS

- Cada dominio (Auth, Memberships, etc.) es un módulo independiente
- Cada módulo contiene: Controller, Service, Resolver, Entities, DTOs
- Reutilización a través de exports en módulos

### GraphQL + REST Dual

- Resolvers GraphQL para operaciones principales
- Controllers REST como alternativa o complemento
- Esquema GraphQL generado automáticamente

### Seguridad

- JWT para autenticación
- Guards personalizados para GraphQL
- Decoradores `@Auth()` y `@GetUser()` para proteger resolvers
- Sistema de roles: admin, coach, client, receptionist
- Bcrypt para encriptación de contraseñas

### Base de Datos

- TypeORM como ORM
- PostgreSQL como base de datos relacional
- Relaciones: OneToMany, ManyToMany
- Timestamps automáticos
- Soft deletes

### DTOs & Validación

- Class-validator para validación
- Class-transformer para transformación
- Inputs específicos para GraphQL

---

## 10. CARACTERÍSTICAS TÉCNICAS CLAVE

1. API GraphQL completa con queries y mutations
2. Autenticación JWT
3. Gestión de roles con 4 niveles diferentes
4. Control de acceso basado en suscripciones
5. Base de datos relacional con integridad referencial
6. Docker support para desarrollo local
7. Despliegue cloud ready (Render, Vercel)
8. Testing framework Jest
9. Code quality con ESLint + Prettier
10. Type safety con TypeScript strict mode

---

## 11. RESUMEN

Gym-API-Graph es un proyecto de gestión de gimnasio construido con tecnologías modernas. Proporciona una API GraphQL robusta, sistema completo de autenticación y autorización, gestión flexible de membresías y suscripciones, y seguimiento detallado de asistencias.

**Stack Técnico**: NestJS + GraphQL + TypeORM + PostgreSQL
**Lenguaje**: TypeScript
**Despliegue**: Docker, Render, Vercel
**Versión Node**: >=18.0.0

---

*Informe técnico del proyecto gym-api-graph*
*Fecha de generación: 18 de noviembre de 2025*
