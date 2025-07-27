export const GRADIENT_COLORS = {
  BLUE: "blue",
  GREEN: "green",
  RED: "red",
  PURPLE: "purple",
};

export type GradientColors =
  (typeof GRADIENT_COLORS)[keyof typeof GRADIENT_COLORS];
