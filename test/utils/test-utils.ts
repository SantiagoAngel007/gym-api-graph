// Utilidades para testing con Jest en NestJS + GraphQL

/**
 * Crea un mock de repositorio TypeORM con todos los métodos comunes
 */
export const createMockRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  findByIds: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  remove: jest.fn(),
  softRemove: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    innerJoin: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
    getMany: jest.fn(),
    getCount: jest.fn(),
  })),
});

/**
 * Mock de Role por defecto
 */
export const mockRole = {
  id: 'test-role-id',
  name: 'client',
  users: [],
};

/**
 * Mock de User por defecto
 */
export const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  fullName: 'Test User',
  age: 25,
  password: 'hashedPassword',
  isActive: true,
  roles: [mockRole],
  subscriptions: [],
  attendances: [],
  checkFieldsBeforeChanges: jest.fn(),
};

/**
 * Mock de Membership por defecto
 */
export const mockMembership = {
  id: 'test-membership-id',
  name: 'Basic',
  cost: 50,
  status: true,
  max_classes_assistance: 10,
  max_gym_assistance: 20,
  duration_months: 1,
  created_at: new Date(),
  updated_at: new Date(),
  Subscription: [],
};

/**
 * Mock de Subscription por defecto
 */
export const mockSubscription = {
  id: 'test-subscription-id',
  name: 'Test Subscription',
  cost: 100,
  max_classes_assistance: 20,
  max_gym_assistance: 30,
  duration_months: 1,
  purchase_date: new Date(),
  isActive: true,
  created_at: new Date(),
  updated_at: new Date(),
  user: mockUser,
  memberships: [mockMembership],
};

/**
 * Mock de Attendance por defecto
 */
export const mockAttendance = {
  id: 'test-attendance-id',
  user: mockUser,
  type: 'GYM',
  entranceDatetime: new Date(),
  exitDatetime: null,
  isActive: true,
  dateKey: '2025-01-01',
  created_at: new Date(),
  updated_at: new Date(),
};

/**
 * Crea un contexto de ejecución mock para GraphQL
 */
export const createMockExecutionContext = (user: any = mockUser) => {
  return {
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        user,
      }),
    }),
    getClass: jest.fn(),
    getHandler: jest.fn(),
    getArgs: jest.fn(),
    getArgByIndex: jest.fn(),
    switchToRpc: jest.fn(),
    switchToWs: jest.fn(),
    getType: jest.fn(),
  };
};

/**
 * Crea un contexto de ejecución mock para GraphQL
 */
export const createMockGqlExecutionContext = (user: any = mockUser) => {
  return {
    getContext: jest.fn().mockReturnValue({
      req: {
        user,
      },
    }),
    getArgs: jest.fn(),
    getInfo: jest.fn(),
    getRoot: jest.fn(),
    getType: jest.fn(),
  };
};
