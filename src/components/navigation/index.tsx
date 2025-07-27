import { tv } from "tailwind-variants";
import useStore from "../../store/useStore";
import NavItem from "./nav.item";

import {
  RiDashboardLine,
  RiFileList2Line,
  RiTeamLine,
  RiBarChart2Line,
  RiArrowUpLine,
  RiIdCardLine,
  RiPulseLine,
  RiSettings3Line,
} from "react-icons/ri";

const navigationClass = tv({
  base: "p-6 border-r border-gray-300 flex flex-col justify-between transition-all duration-300 ease-in-out",
  variants: {
    sideBarOpened: {
      true: "w-64",
      false: "w-16 ps-2 pe-2",
    },
  },
});

const Navigation = () => {
  const { sideBarOpened } = useStore();

  return (
    <aside
      className={navigationClass({
        sideBarOpened,
      })}
    >
      <nav className="flex-1">
        <h3
          className={`text-xs text-secondary uppercase tracking-wider mb-4 ${
            !sideBarOpened && "invisible"
          }`}
        >
          NAVIGATION
        </h3>
        <ul className="flex flex-col gap-2">
          <li>
            <NavItem
              to="/dashboard"
              icon={<RiDashboardLine />}
              label="Dashboard"
              isSidebarOpened={sideBarOpened}
            />
          </li>
          <li>
            <NavItem
              to="/customer-details"
              icon={<RiFileList2Line />}
              label="Invoices"
              isSidebarOpened={sideBarOpened}
            />
          </li>
          <li>
            <NavItem
              to="/customers"
              icon={<RiTeamLine />}
              label="Customers"
              isSidebarOpened={sideBarOpened}
            />
          </li>
          <li>
            <NavItem
              to="/analytics"
              icon={<RiBarChart2Line />}
              label="Analytics"
              isSidebarOpened={sideBarOpened}
            />
          </li>
          <li>
            <NavItem
              to="/collections"
              icon={<RiArrowUpLine />}
              label="Collections"
              isSidebarOpened={sideBarOpened}
            />
          </li>
          <li>
            <NavItem
              to="/payments"
              icon={<RiIdCardLine />}
              label="Payments"
              isSidebarOpened={sideBarOpened}
            />
          </li>
          <li>
            <NavItem
              to="/activity"
              icon={<RiPulseLine />}
              label="Activity"
              isSidebarOpened={sideBarOpened}
            />
          </li>
          <li>
            <NavItem
              to="/settings"
              icon={<RiSettings3Line />}
              label="Settings"
              isSidebarOpened={sideBarOpened}
            />
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Navigation;
