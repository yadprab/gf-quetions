import { tv } from "tailwind-variants";
import { GRADIENT_COLORS } from "./constants";
import type { GradientColors } from "./constants";

const gradientChip = tv({
  base: "w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl",
  variants: {
    isRounded: {
      true: "rounded-full",
      false: "rounded-lg",
    },
    from: {
      [GRADIENT_COLORS.BLUE]: "from-blue-500",
      [GRADIENT_COLORS.GREEN]: "from-green-500",
      [GRADIENT_COLORS.RED]: "from-red-500",
      [GRADIENT_COLORS.PURPLE]: "from-purple-500",
    },
    to: {
      [GRADIENT_COLORS.BLUE]: "to-blue-600",
      [GRADIENT_COLORS.GREEN]: "to-green-600",
      [GRADIENT_COLORS.RED]: "to-red-600",
      [GRADIENT_COLORS.PURPLE]: "to-purple-600",
    },
  },
  defaultVariants: {
    from: GRADIENT_COLORS.BLUE,
    to: GRADIENT_COLORS.PURPLE,
    isRounded: false,
  },
});

interface GradientChipProps {
  from?: GradientColors;
  to?: GradientColors;
  className?: string;
  isRounded?: boolean;
  children: string | React.ReactNode;
}

export const GradientChip = ({
  from,
  to,
  children,
  isRounded,
  className,
}: GradientChipProps) => {
  return (
    <div className={gradientChip({ from, to, isRounded, className })}>
      {children}
    </div>
  );
};
