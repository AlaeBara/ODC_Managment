import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Menu, X, Home, Settings, Users, BarChart, LogOut, User } from 'lucide-react'

export default function Dashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { icon: Home, label: 'Home', href: '#' },
    { icon: Users, label: 'Users', href: '#users' },
    { icon: BarChart, label: 'Analytics', href: '#analytics' },
    { icon: Settings, label: 'Settings', href: '#settings' },
  ]

  const profileItems = [
    { label: 'Profile', href: '#profile' },
    { label: 'Settings', href: '#account-settings' },
    { label: 'Log out', href: '#logout', icon: LogOut },
  ]

  const NavItem = ({ item, isMobile }) => {
    const ButtonContent = () => (
      <>
        <item.icon className={`h-5 w-5 ${isMobile ? 'mr-3' : ''}`} />
        {isMobile && <span>{item.label}</span>}
      </>
    )

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size={isMobile ? "default" : "icon"}
              className={`w-full ${isMobile ? 'justify-start' : 'justify-center'} text-gray-600 hover:bg-gray-100 hover:text-gray-900`}
              asChild
            >
              <a href={item.href}>
                <ButtonContent />
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={10}>
            <p>{item.label}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  const Sidebar = ({ isMobile = false }) => (
    
    <aside className={`
      fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200
      transition-all duration-300 ease-in-out
      ${isMobile ? 'w-64' : 'w-20 lg:w-16'}
      ${isMobile ? (isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
      ${!isMobile && 'hidden lg:block'}
    `}>
      <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
        <h1 className={`text-xl font-semibold text-gray-800 ${!isMobile && 'hidden'}`}>Dashboard</h1>
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden">
            <X className="h-6 w-6" />
          </Button>
        )}
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item, index) => (
            <li key={index}>
              <NavItem item={item} isMobile={isMobile} />
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar */}
      <Sidebar isMobile />

      {/* Overlay for mobile sidebar */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-16">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex h-16 items-center justify-between px-4">
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden">
              <Menu className="h-6 w-6" />
            </Button>
            <div className="ml-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {profileItems.map((item, index) => (
                    <DropdownMenuItem key={index} asChild>
                      <a href={item.href} className="flex items-center w-full">
                        {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                        <span>{item.label}</span>
                      </a>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

      </div>
    </div>
  )
}