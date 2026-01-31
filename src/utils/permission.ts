export const getPermissions = (): string[] => {
    try {
        return JSON.parse(localStorage.getItem('permissions') || '[]');
    } catch {
        return [];
    }
};

export const hasPermission = (permission: string): boolean => {
    return getPermissions().includes(permission);
};