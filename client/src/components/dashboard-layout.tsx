import { useState, ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Loader2, Home, User, PaintBucket, Settings, Menu, X } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  activeTab?: "dashboard" | "portfolio" | "themes" | "settings";
}

export function DashboardLayout({ children, activeTab = "dashboard" }: DashboardLayoutProps) {
  const { user, logoutMutation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location, navigate] = useLocation();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const menuItems = [
    {
      id: "dashboard",
      name: "Dashboard",
      href: "/dashboard",
      icon: <Home className="h-5 w-5" />
    },
    {
      id: "portfolio",
      name: "My Portfolio",
      href: "/portfolio",
      icon: <User className="h-5 w-5" />
    },
    {
      id: "themes",
      name: "Themes",
      href: "/themes",
      icon: <PaintBucket className="h-5 w-5" />
    },
    {
      id: "settings",
      name: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-black shadow-sm border-b border-slate-200 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/">
                <a className="flex-shrink-0 flex items-center cursor-pointer">
                  <span className=" text-xl font-bold mr-2  bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text">Edit</span>
                  <span className="font-bold text-xl bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text">Portfolio</span>
                </a>
              </Link>
              
              {/* Mobile menu button */}
              <div className="ml-4 md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? (
                    <X className="h-6 w-6 text-slate-300" />
                  ) : (
                    <Menu className="h-6 w-6 text-slate-300" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="flex items-center">
              <span className="mr-4 text-slate-300 hidden sm:block">
                {user?.username}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
              >
                {logoutMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu, show/hide based on menu state */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {menuItems.map((item) => (
              <Link key={item.id} href={item.href}>
                <a
                  className={`${
                    activeTab === item.id
                      ? "bg-primary-50 text-primary"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  } block px-3 py-2 rounded-md text-base font-medium cursor-pointer`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                  </div>
                </a>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="flex-grow flex">
        {/* Sidebar for desktop */}
        <aside className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64 border-r border-gray-700 pt-5 pb-4 bg-slate-950">
            <div className="flex-grow flex flex-col">
              <nav className="flex-1 px-2 space-y-1">
                {menuItems.map((item) => (
                  <Link key={item.id} href={item.href}>
                    <a
                      className={`${
                        activeTab === item.id
                          ? "bg-primary-50 text-indigo-400 transition-colors"
                          : "text-slate-300 hover:bg-slate-50 hover:text-slate-900"
                      } group flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer`}
                    >
                      <div className="mr-3 text-slate-300 group-hover:text-slate-900">
                        {item.icon}
                      </div>
                      {item.name}
                    </a>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto bg-black p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}