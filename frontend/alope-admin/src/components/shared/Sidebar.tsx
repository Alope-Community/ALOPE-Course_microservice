import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  ChevronDown,
  FileText,
  LogOut 
} from 'lucide-react';

interface SidebarItem {
  title: string;
  href?: string;
  icon: React.ReactNode;
  submenu?: { title: string; href: string }[];
}

const navItems: SidebarItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="h-[22px] w-[22px] shrink-0" />,
  },
  {
    title: 'Users',
    href: '/users',
    icon: <Users className="h-[22px] w-[22px] shrink-0" />,
  },
  {
    title: 'Content',
    href: '/content',
    icon: <FileText className="h-[22px] w-[22px] shrink-0" />,
  },
  {
    title: 'Settings',
    icon: <Settings className="h-[22px] w-[22px] shrink-0" />,
    submenu: [
      { title: 'Profile', href: '/settings/profile' },
      { title: 'Security', href: '/settings/security' },
    ],
  },
];

interface SidebarProps {
  isOpen: boolean;
}

export function Sidebar({ isOpen }: SidebarProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (title: string) => {
    if (!isOpen) return;
    setOpenDropdown(openDropdown === title ? null : title);
  };

  const handleLogout = () => {
    console.log("User logged out");
  };

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-30 md:relative md:z-20 shrink-0 border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 flex flex-col h-full 
        transition-all duration-300 ease-in-out shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.2)]
        ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-[80px] w-64'}
      `}
    >
      <div className="h-16 flex items-center justify-center border-b border-zinc-200 dark:border-zinc-800 shrink-0 px-4">
        <div className={`flex items-center w-full ${isOpen ? 'justify-start gap-3' : 'justify-center'}`}>
          {isOpen && (
            <span className="font-bold text-xl tracking-tight text-zinc-900 dark:text-zinc-50 transition-opacity duration-300 whitespace-nowrap">
              Alope Admin
            </span>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-6 flex flex-col gap-2 px-3">
        {navItems.map((item) => (
          <div key={item.title}>
            {item.submenu ? (
              <div className="group relative">
                <button
                  onClick={() => toggleDropdown(item.title)}
                  className={`w-full flex items-center h-11 rounded-xl text-sm font-medium transition-all duration-200 ease-in-out
                    ${isOpen ? 'px-3 justify-between' : 'justify-center'}
                    text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-50 dark:hover:bg-zinc-800/60 hover:shadow-sm
                  `}
                >
                  <div className={`flex items-center ${isOpen ? 'gap-3' : ''}`}>
                    {item.icon}
                    {isOpen && <span className="whitespace-nowrap">{item.title}</span>}
                  </div>
                  {isOpen && (
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 transition-transform duration-200 ${openDropdown === item.title ? 'rotate-180' : ''}`}
                    />
                  )}
                </button>
                {!isOpen && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 hidden group-hover:block px-2.5 py-1.5 bg-zinc-800 text-zinc-50 text-xs font-medium rounded-md whitespace-nowrap z-50 shadow-md">
                    {item.title}
                  </div>
                )}
                
                {isOpen && openDropdown === item.title && (
                  <div className="mt-1.5 flex flex-col gap-1 px-3 ml-[22px] border-l-2 border-zinc-100 dark:border-zinc-800/80 py-2">
                    {item.submenu.map((subItem) => (
                      <NavLink
                        key={subItem.title}
                        to={subItem.href}
                        className={({ isActive }) =>
                          `flex items-center px-4 py-2 rounded-lg text-sm transition-all duration-200 whitespace-nowrap ${
                            isActive
                              ? 'text-zinc-900 font-semibold bg-zinc-100/80 dark:bg-zinc-800/80 dark:text-zinc-50 shadow-sm'
                              : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:text-zinc-50 dark:hover:bg-zinc-800/40'
                          }`
                        }
                      >
                        {subItem.title}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="group relative">
                <NavLink
                  to={item.href!}
                  className={({ isActive }) =>
                    `flex items-center h-11 rounded-xl text-sm font-medium transition-all duration-200 ease-in-out
                      ${isOpen ? 'px-3 gap-3' : 'justify-center'}
                      ${isActive
                        ? 'text-zinc-900 bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-50 shadow-sm'
                        : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-50 dark:hover:bg-zinc-800/60 hover:shadow-sm'
                      }
                    `
                  }
                >
                  {item.icon}
                  {isOpen && <span className="whitespace-nowrap">{item.title}</span>}
                </NavLink>
                {!isOpen && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 hidden group-hover:block px-2.5 py-1.5 bg-zinc-800 text-zinc-50 text-xs font-medium rounded-md whitespace-nowrap z-50 shadow-md">
                    {item.title}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      

      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 shrink-0">
        <div className="group relative">
          <button 
            onClick={handleLogout}
            className={`
              w-full flex items-center h-11 rounded-xl text-sm font-medium transition-all duration-200 ease-in-out
              ${isOpen ? 'px-3 gap-3 justify-start' : 'justify-center'}
              text-zinc-600 dark:text-zinc-400
              hover:bg-red-50 hover:text-red-600 hover:shadow-sm hover:border-red-100
              dark:hover:bg-red-500/10 dark:hover:text-red-400 dark:hover:border-red-500/20
              border border-transparent
            `}
          >
            <LogOut className="h-[22px] w-[22px] shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5" />
            {isOpen && (
              <span className="whitespace-nowrap">Logout</span>
            )}
          </button>
        
          {!isOpen && (
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 hidden group-hover:block px-2.5 py-1.5 bg-red-600 text-white text-xs font-medium rounded-md whitespace-nowrap z-50 shadow-md">
              Logout
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}