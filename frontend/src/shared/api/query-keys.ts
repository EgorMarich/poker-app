export const queryKeys = {

  profile: ['profile'] as const,

  ranges: {
    all: ['ranges'] as const,
    one: (id: string) => ['ranges', id] as const,
    quota: ['ranges', 'quota'] as const,
  },

  ai: {
    quota: ['ai', 'quota'] as const,
  },

  sessions: {
    all: ['sessions'] as const,
    one: (id: string) => ['sessions', id] as const,
    stats: ['sessions', 'stats'] as const,
  },

  payments: {
    subscription: ['payments', 'subscription'] as const,
    history: ['payments', 'history'] as const,
  },

  admin: {
    stats: ['admin', 'stats'] as const,
    users: (page: number) => ['admin', 'users', page] as const,
  },
} as const
