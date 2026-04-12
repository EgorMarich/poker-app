import { z } from 'zod'

export const UserRoleSchema = z.enum(['user', 'admin'])
export const AuthProviderSchema = z.enum(['telegram', 'email'])
export const SubscriptionPlanSchema = z.enum(['free', 'basic', 'pro', 'unlimited'])

export const PositionSchema = z.enum(['UTG', 'UTG+1', 'UTG+2', 'MP', 'HJ', 'CO', 'BTN', 'SB', 'BB'])
export const ActionTypeSchema = z.enum(['raise', 'call', 'fold', '3bet', 'open'])
export const GameTypeSchema = z.enum(['NLH', 'PLO', 'PLO5', 'MTT', 'SNG', 'CASH'])
export const SessionStatusSchema = z.enum(['active', 'completed', 'abandoned'])


export const UserSchema = z.object({
  id: z.string().uuid(),
  telegramId: z.number().nullable(),
  telegramUsername: z.string().nullable(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  telegramPhotoUrl: z.string().nullable(),
  email: z.string().email().nullable(),
  role: UserRoleSchema,
  authProvider: AuthProviderSchema,
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  subscription: z.object({
    id: z.string(),
    plan: SubscriptionPlanSchema,
    status: z.string(),
    maxRanges: z.number(),
    dailyAiQuota: z.number(),
    monthlyAiQuota: z.number(),
    dailyAiUsed: z.number(),
    monthlyAiUsed: z.number(),
    expiresAt: z.string().nullable(),
  }).nullable(),
})

export type User = z.infer<typeof UserSchema>
export type SubscriptionPlan = z.infer<typeof SubscriptionPlanSchema>

export const AuthResponseSchema = z.object({
  user: UserSchema,
  accessToken: z.string(),
  tokenType: z.string(),
  isNewUser: z.boolean().optional(),
})

export type AuthResponse = z.infer<typeof AuthResponseSchema>

export const LoginFormSchema = z.object({
  email: z.string().email('Введите корректный email'),
  password: z.string().min(8, 'Минимум 8 символов'),
})

export const RegisterFormSchema = z.object({
  email: z.string().email('Введите корректный email'),
  password: z.string().min(8, 'Минимум 8 символов'),
  username: z.string().max(30).optional(),
})

export type LoginForm = z.infer<typeof LoginFormSchema>
export type RegisterForm = z.infer<typeof RegisterFormSchema>

export const HandActionSchema = z.union([
  z.enum(['raise', 'call', 'fold', 'mixed']),
  z.object({ raise: z.number(), call: z.number(), fold: z.number() }),
  z.null(),
])

export const RangeSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  position: PositionSchema.nullable(),
  actionType: ActionTypeSchema.nullable(),
  matrix: z.record(z.string(), HandActionSchema),
  tags: z.array(z.string()),
  isPublic: z.boolean(),
  comboCount: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const CreateRangeSchema = z.object({
  name: z.string().min(1, 'Название обязательно').max(100),
  description: z.string().max(500).optional(),
  position: PositionSchema.optional(),
  actionType: ActionTypeSchema.optional(),
  matrix: z.record(z.string(), HandActionSchema).optional(),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean().optional(),
})

export type Range = z.infer<typeof RangeSchema>
export type CreateRangeForm = z.infer<typeof CreateRangeSchema>
export type UpdateRangeForm = Partial<CreateRangeForm>

export const RangeQuotaSchema = z.object({
  plan: SubscriptionPlanSchema,
  used: z.number(),
  limit: z.number(),
  isUnlimited: z.boolean(),
  canCreate: z.boolean(),
})

export type RangeQuota = z.infer<typeof RangeQuotaSchema>

export const AiAdviceSchema = z.object({
  prompt: z.string().min(1).max(1000),
  street: z.enum(['preflop', 'flop', 'turn', 'river']).optional(),
  context: z.object({
    position: z.string().optional(),
    hand: z.string().optional(),
    board: z.string().optional(),
    pot: z.number().optional(),
    stackSize: z.number().optional(),
    opponents: z.number().optional(),
    previousActions: z.array(z.string()).optional(),
    rangeId: z.string().optional(),
  }).optional(),
})

export const AiAdviceFormSchema = z.object({
  prompt: z.string().min(3, 'Опишите ситуацию').max(1000, 'Слишком длинный запрос'),
})

export type AiAdviceRequest = z.infer<typeof AiAdviceSchema>
export type AiAdviceForm = z.infer<typeof AiAdviceFormSchema>

export const AiQuotaSchema = z.object({
  plan: SubscriptionPlanSchema,
  dailyUsed: z.number(),
  dailyLimit: z.number(),
  monthlyUsed: z.number(),
  monthlyLimit: z.number(),
  isUnlimited: z.boolean(),
  canQuery: z.boolean(),
  resetsAt: z.string(),
})

export type AiQuota = z.infer<typeof AiQuotaSchema>

export const SessionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  name: z.string(),
  gameType: GameTypeSchema,
  status: SessionStatusSchema,
  smallBlind: z.number(),
  bigBlind: z.number(),
  buyIn: z.number(),
  cashOut: z.number(),
  profit: z.number().nullable(),
  startedAt: z.string().nullable(),
  endedAt: z.string().nullable(),
  venue: z.string().nullable(),
  handNotes: z.array(z.any()),
  generalNotes: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const CreateSessionSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  gameType: GameTypeSchema.optional(),
  smallBlind: z.number().min(0).optional(),
  bigBlind: z.number().min(0).optional(),
  buyIn: z.number().min(0, 'Введите сумму'),
  venue: z.string().optional(),
})

export const UpdateSessionSchema = z.object({
  cashOut: z.number().min(0).optional(),
  status: SessionStatusSchema.optional(),
  generalNotes: z.string().optional(),
  handNotes: z.array(z.any()).optional(),
})

export type Session = z.infer<typeof SessionSchema>
export type CreateSessionForm = z.infer<typeof CreateSessionSchema>
export type UpdateSessionForm = z.infer<typeof UpdateSessionSchema>

export const SessionStatsSchema = z.object({
  totalSessions: z.number(),
  totalProfit: z.number(),
  totalBuyIn: z.number(),
  winRate: z.number(),
  totalHours: z.number(),
  hourlyRate: z.number(),
  bestSession: SessionSchema.nullable(),
})

export type SessionStats = z.infer<typeof SessionStatsSchema>

export const SubscriptionSchema = z.object({
  id: z.string(),
  plan: SubscriptionPlanSchema,
  status: z.string(),
  maxRanges: z.number(),
  dailyAiQuota: z.number(),
  monthlyAiQuota: z.number(),
  dailyAiUsed: z.number(),
  monthlyAiUsed: z.number(),
  startsAt: z.string().nullable(),
  expiresAt: z.string().nullable(),
})

export const PaymentSchema = z.object({
  id: z.string(),
  amount: z.number(),
  currency: z.string(),
  status: z.string(),
  plan: SubscriptionPlanSchema,
  description: z.string().nullable(),
  paidAt: z.string().nullable(),
  createdAt: z.string(),
})

export type Subscription = z.infer<typeof SubscriptionSchema>
export type Payment = z.infer<typeof PaymentSchema>


export const AdminStatsSchema = z.object({
  users: z.object({ total: z.number(), active: z.number() }),
  ranges: z.object({ total: z.number() }),
  sessions: z.object({ total: z.number() }),
  aiQueries: z.object({ total: z.number() }),
  revenue: z.object({ total: z.number(), currency: z.string() }),
  planDistribution: z.array(z.object({ plan: z.string(), count: z.string() })),
  recentSignups: z.array(z.object({
    id: z.string(),
    email: z.string().nullable(),
    firstName: z.string().nullable(),
    createdAt: z.string(),
  })),
})

export type AdminStats = z.infer<typeof AdminStatsSchema>
