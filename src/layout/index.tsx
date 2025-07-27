import React from 'react';
import Navigation from '../components/navigation';
import Header from '../components/header';
import NavItem from '../components/navigation/NavItem';
import { MdSettings } from "react-icons/md";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="grid grid-cols-[auto_1fr] h-screen w-screen bg-background">
      <aside className="bg-card w-64 p-6 border-r border-border flex flex-col justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          {/* Placeholder for Icon with gradient */}
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
            G
          </div>
          <span className="font-bold text-xl text-foreground">Growfin</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1">
          <h3 className="text-xs text-secondary uppercase tracking-wider mb-4">NAVIGATION</h3>
          <Navigation />
        </nav>

        {/* Settings Link */}
        <div className="mt-8">
          <NavItem to="/settings" icon={<MdSettings />} label="Settings" />
        </div>
      </aside>

      <div className="flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;