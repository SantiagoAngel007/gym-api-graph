Authentication

## Usuarios del Seed (ya creados en la BD después de ejecutar Seed)

**Admin:**
- Email: admin@example.com
- Password: admin123
- Rol: admin

**Coach:**
- Email: coach@example.com
- Password: coach123
- Rol: coach

**Client:**
- Email: client@example.com
- Password: client123
- Rol: client

**Receptionist:**
- Email: receptionist@example.com
- Password: recep123
- Rol: receptionist

---

  Signup - Create User (Nuevo Usuario)
  {
    "createUserInput": {
      "email": "user@example.com",
      "fullName": "John Doe",
      "age": 28,
      "password": "securePassword123"
    }
  }

  Login - Admin (Datos del Seed)
  {
    "loginInput": {
      "email": "admin@example.com",
      "password": "admin123"
    }
  }

  Login - Coach (Datos del Seed)
  {
    "loginInput": {
      "email": "coach@example.com",
      "password": "coach123"
    }
  }

  Login - Client (Datos del Seed)
  {
    "loginInput": {
      "email": "client@example.com",
      "password": "client123"
    }
  }

  Login - Receptionist (Datos del Seed)
  {
    "loginInput": {
      "email": "receptionist@example.com",
      "password": "recep123"
    }
  }

  Get Current User (Me) - SIN VARIABLES (Requiere Auth)
  {}

  Get All Users - SIN VARIABLES (Requiere Auth)
  {}

  Get User by ID
  {
    "id": "{{USER_ID}}"
  }

  **Nota:** USER_ID = ID del usuario actual o cualquier usuario. Del seed puedes usar los IDs del Admin, Coach, Client o Receptionist después de hacer login.

  Update User
  {
    "updateUserInput": {
      "id": "{{USER_ID}}",
      "fullName": "Jane Doe",
      "age": 29,
      "isActive": true
    }
  }

  Remove User
  {
    "id": "user-id-to-delete"
  }

  ---

## Memberships del Seed (ya creadas en la BD después de ejecutar Seed)

**Básica Mensual:**
- Costo: $50.00
- Clases: 8
- Gym: 15 días
- Duración: 1 mes

**Premium Mensual:**
- Costo: $80.00
- Clases: 20
- Gym: 30 días
- Duración: 1 mes

**Básica Anual:**
- Costo: $500.00
- Clases: 96
- Gym: 180 días
- Duración: 12 meses

**Premium Anual:**
- Costo: $800.00
- Clases: 240
- Gym: 365 días
- Duración: 12 meses

**VIP Anual:**
- Costo: $1200.00
- Clases: 365
- Gym: 365 días
- Duración: 12 meses

---

  Get All Memberships - SIN VARIABLES (Requiere Auth)
  {}

  Get Membership by ID
  {
    "id": "{{MEMBERSHIP_ID}}"
  }

  Obtén los IDs exactos haciendo GET a "Get All Memberships" después de autenticarte.

  Create Membership - Ejemplo Nuevo
  {
    "createMembershipInput": {
      "name": "Premium Plus",
      "cost": 89.99,
      "max_classes_assistance": 50,
      "max_gym_assistance": 300,
      "duration_months": 1,
      "status": true
    }
  }

  Update Membership
  {
    "updateMembershipInput": {
      "id": "{{MEMBERSHIP_ID}}",
      "name": "Premium Plus Updated v1",
      "cost": 99.99,
      "max_classes_assistance": 60,
      "max_gym_assistance": 350
    }
  }

  **Nota:** El campo "name" es único en la base de datos. Si reutilizas este ejemplo, debes cambiar el nombre a algo único (ej: "Premium Plus Updated v2", "Premium Plus Updated v3", etc.).
  Si solo quieres actualizar otros campos (cost, max_classes_assistance, max_gym_assistance), puedes omitir el campo "name" en la solicitud.

  Toggle Membership Status
  {
    "id": "{{MEMBERSHIP_ID}}"
  }

  Remove Membership
  {
    "id": "{{MEMBERSHIP_ID}}"
  }

  ---

## Subscriptions

  Get All Subscriptions (Admin Only) - SIN VARIABLES
  {}

  Get Subscription by User ID
  {
    "userId": "{{USER_ID}}"
  }

  Get Subscription by ID
  {
    "id": "{{SUBSCRIPTION_ID}}"
  }

  Create Subscription for User
  {
    "userId": "{{USER_ID}}"
  }

  Update Subscription
  {
    "updateSubscriptionInput": {
      "id": "{{SUBSCRIPTION_ID}}",
      "name": "Updated Premium",
      "cost": 79.99,
      "max_classes_assistance": 40,
      "max_gym_assistance": 250,
      "duration_months": 1,
      "isActive": true
    }
  }

  **Nota:** Todos los campos excepto "id" son opcionales. Puedes actualizar solo los campos que quieras cambiar. Si no envías un campo, mantiene su valor actual.

  Deactivate Subscription
  {
    "id": "{{SUBSCRIPTION_ID}}"
  }

  Activate Subscription
  {
    "id": "{{SUBSCRIPTION_ID}}"
  }

  Remove Subscription
  {
    "id": "{{SUBSCRIPTION_ID}}"
  }

  Add Membership to Subscription
  {
    "addMembershipInput": {
      "subscriptionId": "{{SUBSCRIPTION_ID}}",
      "membershipId": "{{MEMBERSHIP_ID}}"
    }
  }

  **Nota:** Este endpoint agrega una membresía a la suscripción de un usuario, lo que le proporciona pases disponibles.
  Después de ejecutar este endpoint, el usuario tendrá acceso a:
  - Pases de gym según la membresía agregada
  - Pases de clases según la membresía agregada

  **Pasos recomendados:**
  1. Login como usuario (se guarda AUTH_TOKEN y USER_ID)
  2. Get All Memberships (se guarda MEMBERSHIP_ID)
  3. Create Subscription for User (se guarda SUBSCRIPTION_ID)
  4. Add Membership to Subscription (vincula la membresía a la suscripción)
  5. Ahora el usuario tendrá pases disponibles para hacer check-in

  ---
  Attendances

  **Nota para Attendances:** {{USER_ID}} = ID del usuario que quiere registrar asistencia. Del seed puedes usar los IDs del Admin, Coach, Client o Receptionist.
  Los registros de asistencia rastrean:
  - Entrada (check in) a GYM o CLASS
  - Salida (check out)
  - Fecha y hora de entrada (entranceDatetime)
  - Tipo de asistencia: "GYM" o "CLASS"
  - Clave de fecha en formato YYYY-MM-DD (dateKey) para agrupar asistencias diarias

  Get Attendance Status
  {
    "userId": "{{USER_ID}}"
  }

  **Respuesta esperada:**
  ```json
  {
    "isInside": true|false,         // ¿El usuario está actualmente dentro?
    "availableAttendances": {       // Pases disponibles
      "gym": 5,                     // Pases de gym disponibles en el mes
      "classes": 3                  // Pases de clases disponibles en el mes
    },
    "currentAttendance": {          // Si está dentro (null si está afuera)
      "id": "uuid-here",
      "type": "GYM" | "CLASS",
      "entranceDatetime": "2024-11-14T10:30:00Z"
    }
  }
  ```

  Check In - Gym
  {
    "createAttendanceInput": {
      "userId": "{{USER_ID}}",
      "entranceDatetime": "2024-11-14T10:30:00Z",
      "type": "GYM",
      "dateKey": "2024-11-14"
    }
  }

  Check In - Class
  {
    "createAttendanceInput": {
      "userId": "{{USER_ID}}",
      "entranceDatetime": "2024-11-14T14:00:00Z",
      "type": "CLASS",
      "dateKey": "2024-11-14"
    }
  }

  Check Out
  {
    "userId": "{{USER_ID}}"
  }