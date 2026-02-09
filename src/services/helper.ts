import { ROLE, type RoleType } from "@/utils/constants/global.var";
import { NOTIFICATION_ROUTE_BY_ROLE } from "@/utils/constants/notification.route";
import type { NotificationType } from "@/utils/constants/notification.type";
import dayjs from "dayjs";

export const FORMATE_DATE_DEFAULT = "YYYY-MM-DD";
export const FORMATE_DATE_VN = "DD-MM-YYYY";

export const dateRangeValidate = (dateRange: any) => {
    if (!dateRange) return undefined;

    const startDate = dayjs(dateRange[0], FORMATE_DATE_DEFAULT).toDate();
    const endDate = dayjs(dateRange[1], FORMATE_DATE_DEFAULT).toDate();

    return [startDate, endDate];
};

export const getNotificationRoute = (
  role?: string,
  type?: NotificationType
): string | undefined => {
  if (!role || !type) return undefined;
  return NOTIFICATION_ROUTE_BY_ROLE[role]?.[type];
};

export const toRoleType = (role?: string): RoleType | undefined => {
  if (!role) return undefined;
  return Object.values(ROLE).includes(role as RoleType)
    ? (role as RoleType)
    : undefined;
};
