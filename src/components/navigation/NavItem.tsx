import React from "react";
import { NavLink } from "react-router-dom";
import { tv } from "tailwind-variants";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const navLink = tv({
  base: "block p-3 rounded-lg font-medium flex items-center gap-3 hover:bg-background",
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
      className={({ isActive }) => navLink({ active: isActive })}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
};

export default NavItem;
