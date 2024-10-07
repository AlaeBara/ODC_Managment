import React from 'react';
import { Link ,useNavigate } from 'react-router-dom';
import axios from 'axios'
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Cloud,
  LogOut,
  User,
  Calendar,
  CircleUser,
  Menu,
  ChevronDown
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Logo from './images.png';

const NavBar = () => {

  const navigate = useNavigate()




  const handleLogout = async () => {
    try {
        await axios.get(`${import.meta.env.VITE_API_LINK}/api/auth/logout`,{withCredentials:true});
        navigate('/'); 
        localStorage.clear();
    } catch (error) {
        console.error('Logout failed:', error);
        alert("Logout failed");
    }
  }





  return (
    <header className="z-10 sticky top-0 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
      {/* Left side: Logo */}
      <Link to="/Home" className="flex items-center gap-2 text-lg font-semibold">
        <img className="h-15 w-12" src={Logo} alt="Logo" />
      </Link>

      {/* Right side: Nav and User Menu */}
      <div className="flex items-center gap-4">
        {/* Navigation links (hidden on smaller screens) */}
        <nav className="hidden md:flex md:gap-5 lg:gap-6 text-sm font-medium">
          <Link to="/Home" className="text-muted-foreground transition-colors hover:text-foreground">Home</Link>
          <Link to="/Formation" className="text-muted-foreground transition-colors hover:text-foreground">Formation</Link>

          {/* Beneficiary Dropdown */}
          <Link to="/beneficiary/overview" className="flex items-center cursor-pointer text-muted-foreground hover:text-foreground">Beneficiary</Link>

          <Link to="/evaluation" className="text-muted-foreground transition-colors hover:text-foreground">Evaluation</Link>
        </nav>

        {/* Mobile Menu Button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link to="/Home" className="flex items-center gap-2 text-lg font-semibold">
                <img className="h-15 w-12" src={Logo} alt="Logo" />
              </Link>
              <Link to="/Home" className="text-muted-foreground hover:text-foreground">Home</Link>
              <Link to="/Formation" className="text-muted-foreground hover:text-foreground">Formation</Link>

              {/* Beneficiary Dropdown in Mobile Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center cursor-pointer text-muted-foreground hover:text-foreground">
                  <Link to="/beneficiary/overview" className="flex items-center cursor-pointer text-muted-foreground hover:text-foreground">Beneficiary</Link>
                    {/* <ChevronDown className="ml-1 h-4 w-4" /> */}
                  </div>
                </DropdownMenuTrigger>
                {/* <DropdownMenuContent side="bottom" align="start">
                  <DropdownMenuItem asChild>
                    <Link to="#">Overview</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="#">Register</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="#">Reports</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent> */}
              </DropdownMenu>

              <Link to="/evaluation" className="text-muted-foreground hover:text-foreground">Evaluation</Link>
            </nav>
          </SheetContent>
        </Sheet>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full ring-0 focus-visible:ring-offset-0 focus-visible:ring-0">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mt-5" align="end">
            <DropdownMenuLabel>Other Links</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link to="/cloud" className="flex items-center">
                  <Cloud className="mr-2 h-4 w-4" />
                  <span>Cloud</span>
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/calendar" className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Calendar</span>
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link onClick={handleLogout} className="flex items-center">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default NavBar;
