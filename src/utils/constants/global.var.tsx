export const ROLE = {
    SUPER_ADMIN: 'SUPER_ADMIN',
    ADMIN: 'ADMIN',
    HOST: 'HOST',
    USER: 'USER',
} as const;

export type RoleType = typeof ROLE[keyof typeof ROLE];