import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const location = useLocation();

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    if (items) return items;

    const pathname = location.pathname;
    const paths = pathname.split('/').filter(Boolean);
    
    // Determine the root "Dashboard" link
    const rootHref = paths.length > 0 && paths[0] !== 'dashboard' ? '/dashboard' : undefined;
    const list: BreadcrumbItem[] = [{ label: 'Dashboard', href: rootHref }];

    let currentLink = '';
    paths.forEach((path, index) => {
      currentLink += `/${path}`;
      if (path === 'dashboard') return;

      let label = path;
      if (path === 'users') {
        label = 'Data Users';
      } else if (path === 'categories') {
        list.push({ label: 'Master Data' });
        label = 'Category';
      } else if (path === 'courses') {
        list.push({ label: 'Master Data' });
        label = 'Course';
      } else if (path === 'modules') {
        list.push({ label: 'Master Data' });
        label = 'Module';
      } else if (!isNaN(Number(path))) {
        label = 'Detail';
      } else {
        label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
      }

      const isLast = index === paths.length - 1;
      list.push({
        label,
        href: isLast ? undefined : currentLink,
      });
    });

    return list;
  };

  const breadcrumbs = getBreadcrumbs();

  if (breadcrumbs.length === 0) return null;

  return (
    <nav className="flex items-center space-x-1.5 text-xs text-zinc-500 dark:text-zinc-400 mb-5 select-none overflow-x-auto whitespace-nowrap scrollbar-none py-1 animate-in fade-in slide-in-from-top-1 duration-300">
      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1;
        
        return (
          <div key={index} className="flex items-center gap-1.5">
            {index > 0 && (
              <ChevronRight className="h-3.5 w-3.5 text-zinc-300 dark:text-zinc-700 shrink-0" />
            )}
            
            {item.href ? (
              <Link
                to={item.href}
                className="flex items-center gap-1 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors font-medium"
              >
                {index === 0 && <Home className="h-3.5 w-3.5 shrink-0" />}
                <span>{item.label}</span>
              </Link>
            ) : (
              <span 
                className={`flex items-center gap-1 ${
                  isLast 
                    ? 'text-zinc-800 dark:text-zinc-200 font-semibold' 
                    : 'text-zinc-400 dark:text-zinc-500 font-medium'
                }`}
              >
                {index === 0 && <Home className="h-3.5 w-3.5 shrink-0" />}
                <span>{item.label}</span>
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}

export default Breadcrumbs;
