
import React from "react";
import { NavLink } from "react-router-dom";
import { Settings, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="sticky top-0 z-10 w-full bg-nova-dark-surface border-b border-nova-purple/20 px-4 py-3">
      <div className="container mx-auto flex justify-between items-center">
        <NavLink to="/" className="flex items-center space-x-2">
          <div className="relative h-8 w-8 rounded-full bg-nova-purple flex items-center justify-center">
            <span className="text-white font-bold text-xl">N</span>
          </div>
          <span className="text-xl font-bold text-white">NovaTube</span>
        </NavLink>
        
        <div className="flex items-center space-x-2">
          <NavLink to="/" className={({ isActive }) => 
            isActive ? "text-nova-purple" : "text-white hover:text-nova-teal transition-colors"
          }>
            <Button variant="ghost" size="icon" className="relative">
              <Home className="h-5 w-5" />
            </Button>
          </NavLink>
          
          <NavLink to="/settings" className={({ isActive }) => 
            isActive ? "text-nova-purple" : "text-white hover:text-nova-teal transition-colors"
          }>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </NavLink>
        </div>
      </div>
    </header>
  );
};

export default Header;
