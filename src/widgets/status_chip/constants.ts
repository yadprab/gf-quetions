export const STATUS_CHIP_TYPES = {
  INFO: "info",
  SUCCESS: "success",
  WARNING: "warning",
  ERROR: "error",
};

export type StatusChipType =
  (typeof STATUS_CHIP_TYPES)[keyof typeof STATUS_CHIP_TYPES];
