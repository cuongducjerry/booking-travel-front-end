export const NOTIFICATION_TYPE = {
  BOOKING: "BOOKING",
  CONTRACT: "CONTRACT",
  PROPERTY: "PROPERTY",
  PAYOUT: "PAYOUT",
} as const;

export type NotificationType =
  typeof NOTIFICATION_TYPE[keyof typeof NOTIFICATION_TYPE];
