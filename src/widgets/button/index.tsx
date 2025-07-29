import React from "react";
import { tv } from "tailwind-variants";
import {
  BUTTON_SIZES,
  BUTTON_TYPES,
  type ButtonSizes,
  type ButtonTypes,
} from "./constants";

const button = tv({
  base: "font-medium font-inherit rounded-lg border border-transparent transition-colors",
  variants: {
    type: {
      [BUTTON_TYPES.PRIMARY]: "bg-primary text-white hover:bg-primary/80",
      [BUTTON_TYPES.SECONDARY]: "bg-background-white hover:bg-active-nav-bg",
    },
    size: {
      [BUTTON_SIZES.SMALL]: "px-4 py-2 text-sm",
      [BUTTON_SIZES.MEDIUM]: "px-6 py-3 text-base",
      [BUTTON_SIZES.LARGE]: "px-8 py-4 text-lg",
    },
  },
  defaultVariants: {
    type: BUTTON_TYPES.PRIMARY,
    size: BUTTON_SIZES.MEDIUM,
  },
});

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonTypes;
  size?: ButtonSizes;
}

const Button = ({
  children,
  variant,
  size,
  className,
  ...props
}: ButtonProps) => {
  return (
    <button className={button({ type: variant, size, className })} {...props}>
      {children}
    </button>
  );
};

export default Button;
