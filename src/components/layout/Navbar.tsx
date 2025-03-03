
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt, PieChart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    {
      label: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: '/',
    },
    {
      label: 'Transactions',
      icon: <Receipt className="h-5 w-5" />,
      href: '/transactions',
    },
    {
      label: 'Budget',
      icon: <PieChart className="h-5 w-5" />,
      href: '/budget',
    },
  ];

  return (
    <nav className="fixed top-0 z-50 w-full bg-white shadow-sm px-4 sm:px-6 py-3">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-primary p-1.5 rounded-md">
            <PieChart className="h-5 w-5 text-white" />
          </div>
          <span className="font-semibold text-xl tracking-tight">BudgetTrack</span>
        </Link>

        {/* Mobile menu button */}
        <button
          onClick={toggleMenu}
          className="sm:hidden flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          {isOpen ? (
            <X className="block h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="block h-6 w-6" aria-hidden="true" />
          )}
        </button>

        {/* Desktop navigation */}
        <div className="hidden sm:flex sm:items-center space-x-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "relative px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out flex items-center space-x-1.5",
                location.pathname === item.href
                  ? "text-primary bg-blue-50"
                  : "text-gray-600 hover:text-primary hover:bg-blue-50"
              )}
            >
              {item.icon}
              <span>{item.label}</span>
              {location.pathname === item.href && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="sm:hidden animate-fade-in">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium flex items-center space-x-3",
                  location.pathname === item.href
                    ? "text-primary bg-blue-50"
                    : "text-gray-600 hover:text-primary hover:bg-blue-50"
                )}
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
