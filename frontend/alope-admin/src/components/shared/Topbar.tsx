import { useState, useRef, useEffect } from 'react';
import { Menu, User, LogOut, Settings } from 'lucide-react';
import { Button } from '../ui/Button';
import { ThemeToggle } from './ThemeToggle';

interface TopbarProps {
  onToggleSidebar: () => void;
}

export function Topbar({ onToggleSidebar }: TopbarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-16 border-b border-zinc-200 bg-white/75 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/75 flex items-center justify-between px-6 sticky top-0 z-10 transition-colors duration-200">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          aria-label="Toggle Sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-0.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
            aria-expanded={isProfileOpen}
            aria-haspopup="true"
          >
            <img
              src="https://ui-avatars.com/api/?name=Admin+User&background=random"
              alt="Profile"
              className="h-8 w-8 rounded-full object-cover shrink-0 ring-2 ring-white dark:ring-zinc-900 shadow-sm"
            />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg py-1 z-50 animate-in fade-in zoom-in duration-200">
              <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
                <img
                  src="https://ui-avatars.com/api/?name=Admin+User&background=random"
                  alt="Profile"
                  className="h-10 w-10 rounded-full object-cover shrink-0 shadow-sm"
                />
                <div className="flex flex-col">
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 leading-none">Admin User</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">admin@alope.com</p>
                </div>
              </div>
              <div className="p-2">
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left">
                  <User className="h-[18px] w-[18px] shrink-0" />
                  My Profile
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left">
                  <Settings className="h-[18px] w-[18px] shrink-0" />
                  Account Settings
                </button>
              </div>
              <div className="border-t border-zinc-200 dark:border-zinc-800 p-2">
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors text-left">
                  <LogOut className="h-[18px] w-[18px] shrink-0" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
