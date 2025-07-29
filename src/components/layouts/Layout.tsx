import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import './Layout.css';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="layout">
      <Sidebar collapsed={collapsed} />
      <div className="layout-main">
        <Header onToggle={() => setCollapsed(!collapsed)} />
        <div className="layout-content">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
