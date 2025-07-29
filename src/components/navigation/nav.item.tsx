import React from "react";
import { tv } from "tailwind-variants";
import { NavLink } from "react-router-dom";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isSidebarOpened: boolean;
}

const navLink = tv({
  base: "block p-3 rounded-lg font-medium flex items-center hover:bg-background",
  variants: {
    active: {
      true: "bg-active-nav-bg text-primary border-e-[2px] border-primary",
    },
    isSidebarOpened: {
      true: "gap-3",
      false: "justify-center",
    },
  },
});

const NavItem: React.FC<NavItemProps> = ({
  to,
  icon,
  label,
  isSidebarOpened,
}) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        navLink({
          active: isActive,
          isSidebarOpened: isSidebarOpened,
        })
      }
    >
      <span className="text-lg">{icon}</span>
      {isSidebarOpened && <span>{label}</span>}
    </NavLink>
  );
};

export default NavItem;
