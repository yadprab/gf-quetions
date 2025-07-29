import React from "react";
import Navigation from "../components/navigation";
import Header from "../components/header";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="grid grid-cols-[auto_1fr] h-screen w-screen bg-background text-font overflow-hidden">
      <Navigation />

      <div className="flex flex-col overflow-auto">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
