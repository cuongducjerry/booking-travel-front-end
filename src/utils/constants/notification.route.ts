import { ROLE, type RoleType } from "./global.var";
import {
  NOTIFICATION_TYPE,
  type NotificationType,
} from "./notification.type";

export const NOTIFICATION_ROUTE_BY_ROLE: Record<
  string,
  Partial<Record<NotificationType, string>>
> = {
  [ROLE.ADMIN]: {
    BOOKING: "/admin/booking",
    CONTRACT: "/admin/contract",
    PROPERTY: "/admin/property",
    PAYOUT: "/admin/payout"
  },

  [ROLE.HOST]: {
    BOOKING: "/host/booking",
    CONTRACT: "/host/contract",
    PROPERTY: "/host/property",
    PAYOUT: "/host/payout"
  },

  [ROLE.USER]: {
    BOOKING: "/booking-history",
  },
};

