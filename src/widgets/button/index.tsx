import React from "react";
import { tv } from "tailwind-variants";

const button = tv({
  base: "font-medium font-inherit rounded-lg border border-transparent transition-colors",
  variants: {
    color: {
      primary: "bg-primary text-white hover:bg-primary/80",
      secondary: "bg-secondary text-white hover:bg-secondary/80",
      success: "bg-success text-white hover:bg-success/80",
      danger: "bg-error text-white hover:bg-error/80",
      warning: "bg-warning text-white hover:bg-warning/80",
      info: "bg-info text-white hover:bg-info/80",
      light: "bg-background text-foreground hover:bg-background/80",
      dark: "bg-foreground text-background hover:bg-foreground/80",
    },
    size: {
      sm: "text-sm px-3 py-1.5",
      md: "text-base px-5 py-2.5",
      lg: "text-lg px-6 py-3",
    },
  },
  defaultVariants: {
    color: "primary",
    size: "md",
  },
});

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "light"
    | "dark";
  size?: "sm" | "md" | "lg";
}

const Button = ({
  children,
  color,
  size,
  className,
  ...props
}: ButtonProps) => {
  return (
    <button className={button({ color, size, className })} {...props}>
      {children}
    </button>
  );
};

export default Button;