export const BUTTON_TYPES = {
  PRIMARY: "primary",
  SECONDARY: "secondary",
} as const;

export type ButtonTypes = (typeof BUTTON_TYPES)[keyof typeof BUTTON_TYPES];

export const BUTTON_SIZES = {
  SMALL: "sm",
  MEDIUM: "md",
  LARGE: "lg",
} as const;

export type ButtonSizes = (typeof BUTTON_SIZES)[keyof typeof BUTTON_SIZES];
