import React from 'react';
import { LayoutDashboard, Users, Settings, HelpCircle, Menu, X, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from 'react-router-dom';
import Logo from '../NavBar/images.png';

const menuItems = [
  { id: 1, label: "Dashboard", icon: LayoutDashboard, link: "/admin/dashboard" },
  { id: 2, label: "Users", icon: Users, link: "/admin/users" },
  { id: 3, label: "Settings", icon: Settings, link: "/admin/settings", 
    submenu: [
      { id: 'general', label: "General", link: "/admin/settings/general" },
      { id: 'security', label: "Security", link: "/admin/settings/security" },
      { id: 'notifications', label: "Notifications", link: "/admin/settings/notifications" },
    ]
  },
  { id: 4, label: "Help", icon: HelpCircle, link: "/admin/help" },
];

export default function SideBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const pathname = window.location.pathname;

  const handleLogout = () => {
    console.log('Logging out...');
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        className={`fixed top-4 left-4 z-50 lg:hidden ${isMobileMenuOpen ? 'hidden' : 'block'}`}
        onClick={() => setIsMobileMenuOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-background border-r z-50 w-64
          transition-transform duration-300 ease-in-out flex flex-col
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center h-16 px-4 border-b">
          <Link to="/Home" className="flex items-center gap-2">
            <img className="h-8 w-8" src={Logo} alt="Logo" />
          </Link>
          
          {/* Mobile Close Button */}
          <Button
            variant="ghost"
            className="ml-auto lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Sidebar Content */}
        <nav className="flex-1 overflow-y-auto">
          <ul className="p-2 space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                {item.submenu ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button 
                        className={`w-full flex items-center p-3 rounded-lg hover:bg-muted transition-colors
                          ${pathname.startsWith(item.link) ? 'bg-muted' : ''}`}
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        <span className="ml-3 flex-grow text-left">{item.label}</span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48">
                      {item.submenu.map((subItem) => (
                        <DropdownMenuItem key={subItem.id}>
                          <Link to={subItem.link} className="w-full">
                            {subItem.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    to={item.link}
                    className={`flex items-center p-3 rounded-lg hover:bg-muted transition-colors
                      ${pathname === item.link ? 'bg-muted' : ''}`}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span className="ml-3">{item.label}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar Footer with Logout */}
        <div className="border-t">
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-4 text-left hover:bg-muted transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="ml-3  font-medium">Logout</span>
          </button>
          
          {/* Copyright */}
          <div className="p-4">
            <p className="text-sm text-muted-foreground text-center">© 2024 ODC Agadir</p>
          </div>
        </div>
      </aside>
    </>
  );
}