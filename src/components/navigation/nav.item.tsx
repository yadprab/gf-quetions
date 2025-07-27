import React from "react";
import { tv } from "tailwind-variants";
import { NavLink } from "react-router-dom";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const navLink = tv({
  base: "block rounded-md",
  variants: {
    active: {
      true: "bg-active-nav-bg text-primary",
      false: "text-foreground",
    },
  },
});

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        navLink({
          active: isActive,
          class:
            "flex items-center gap-3 p-3 rounded-lg font-medium hover:bg-background",
        })
      }
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
};

export default NavItem;
