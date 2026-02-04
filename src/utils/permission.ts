export const getPermissions = (): string[] => {
    try {
        return JSON.parse(localStorage.getItem('permissions') || '[]');
    } catch {
        return [];
    }
};

/**
 * Check if the user has the necessary permissions.
 * @param permission string | string[]
 * @param mode "ANY" | "ALL"
 */
export const hasPermission = (
    permission: string | string[],
    mode: "ANY" | "ALL" = "ANY"
): boolean => {
    const permissions = getPermissions();

    if (!permission) return true;

    // check 1 permission
    if (typeof permission === "string") {
        return permissions.includes(permission);
    }

    // check multiple permissions
    if (Array.isArray(permission)) {
        if (mode === "ALL") {
            // They have ALL rights
            return permission.every(p => permissions.includes(p));
        }

        // ANY (default): has AT LEAST 1 permission
        return permission.some(p => permissions.includes(p));
    }

    return false;
};