import { Outlet } from "react-router-dom";
import "./styles.css";
import { SideBar } from "./sidebar";
import { TopNav } from "./topnav";

function Layout() {
  return (
    <div className="layout">
      <aside className="sidebar">
        <SideBar />
      </aside>
      <div className="content-wrapper">
        <div className="topnav">
          <TopNav />
        </div>
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
