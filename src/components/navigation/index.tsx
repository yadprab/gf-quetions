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
import Button from "../../widgets/button";
import { BUTTON_SIZES, BUTTON_TYPES } from "../../widgets/button/constants";
import { BsLayoutSidebar } from "react-icons/bs";

// const navigationClass = tv({
//   base: "p-6 border-r border-gray-300 flex flex-col justify-between transition-all duration-300 ease-in-out",
//   variants: {
//     sideBarOpened: {
//       true: "w-64",
//       false: "w-16 ps-2 pe-2",
//     },
//   },
// });

const navigationClass = tv({
  base: `p-6 fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
    md:relative md:translate-x-0 md:flex md:flex-col
    bg-card border-r border-gray-300 flex-col justify-between`,
  variants: {
    sideBarOpened: {
      true: "translate-x-0 w-64",
      false: "-translate-x-full w-0 md:w-16",
    },
  },
});

const Navigation = () => {
  const { sideBarOpened, toggleSidebar } = useStore();

  return (
    <aside
      className={navigationClass({
        sideBarOpened,
      })}
    >
      <nav className="flex-1">
        <div className="flex justify-between items-center">
          <h3
            className={`text-xs text-secondary uppercase tracking-wider ${
              !sideBarOpened && "invisible"
            }`}
          >
            NAVIGATION
          </h3>
          {sideBarOpened && (
            <Button
              variant={BUTTON_TYPES.SECONDARY}
              size={BUTTON_SIZES.SMALL}
              onClick={toggleSidebar}
              className="md:hidden p-0"
            >
              <BsLayoutSidebar />
            </Button>
          )}
        </div>
        <ul className="flex flex-col gap-2 mt-4">
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
