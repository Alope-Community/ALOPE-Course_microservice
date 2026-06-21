import { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Mail,
  Shield
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Instructor' | 'Student';
  status: 'Active' | 'Suspended' | 'Pending';
  joinedDate: string;
  avatar: string;
}

const initialUsers: User[] = [
  {
    id: 'USR-001',
    name: 'Budi Santoso',
    email: 'budi.santoso@alope.com',
    role: 'Admin',
    status: 'Active',
    joinedDate: '12 Jan 2026',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100',
  },
  {
    id: 'USR-002',
    name: 'Siti Rahma',
    email: 'siti.rahma@alope.com',
    role: 'Instructor',
    status: 'Active',
    joinedDate: '24 Feb 2026',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
  },
  {
    id: 'USR-003',
    name: 'Joko Widodo',
    email: 'joko.widodo@student.alope.com',
    role: 'Student',
    status: 'Pending',
    joinedDate: '01 Mar 2026',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
  },
  {
    id: 'USR-004',
    name: 'Dewi Lestari',
    email: 'dewi.lestari@alope.com',
    role: 'Instructor',
    status: 'Active',
    joinedDate: '15 Mar 2026',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100',
  },
  {
    id: 'USR-005',
    name: 'Adi Wijaya',
    email: 'adi.wijaya@student.alope.com',
    role: 'Student',
    status: 'Suspended',
    joinedDate: '02 Apr 2026',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100',
  },
  {
    id: 'USR-006',
    name: 'Rian Hidayat',
    email: 'rian.hidayat@student.alope.com',
    role: 'Student',
    status: 'Active',
    joinedDate: '10 Apr 2026',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=100',
  },
  {
    id: 'USR-007',
    name: 'Mega Utami',
    email: 'mega.utami@student.alope.com',
    role: 'Student',
    status: 'Pending',
    joinedDate: '18 Apr 2026',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100',
  }
];

export function UsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filtered & Searched Users
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) || 
                            user.email.toLowerCase().includes(search.toLowerCase()) ||
                            user.id.toLowerCase().includes(search.toLowerCase());
      return matchesSearch;
    });
  }, [users, search]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Actions handler
  const handleDeleteUser = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      setUsers(prev => prev.filter(user => user.id !== id));
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Data Users
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Manage your course platform users, roles, and system permissions.
          </p>
        </div>
        <Button className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-sm h-10 gap-2">
          <Plus className="h-4 w-4" />
          Add New User
        </Button>
      </div>

      {/* Main Table Card */}
      <Card className="overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm rounded-xl">
        {/* Table Filters header - Search Only */}
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-zinc-500" />
            <input
              type="text"
              placeholder="Search user, email or ID..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-4 py-2 text-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-700 text-zinc-900 dark:text-zinc-50 transition-colors"
            />
          </div>
        </div>

        {/* Table layout */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                <th className="p-4 pl-6 w-16 text-center">No.</th>
                <th className="p-4">User</th>
                <th className="p-4">Email & ID</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user, index) => (
                  <tr 
                    key={user.id} 
                    className="hover:bg-zinc-50/60 dark:hover:bg-zinc-900/20 transition-colors duration-150 group"
                  >
                    <td className="p-4 pl-6 text-center text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={user.avatar} 
                          alt={user.name} 
                          className="h-10 w-10 rounded-full object-cover shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800"
                        />
                        <span className="font-semibold text-zinc-900 dark:text-zinc-50 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-0.5 text-sm">
                        <span className="text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                          {user.email}
                        </span>
                        <span className="text-xs text-zinc-400 font-mono">ID: {user.id}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        <Shield className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold leading-none
                        ${user.status === 'Active' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' : ''}
                        ${user.status === 'Pending' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400' : ''}
                        ${user.status === 'Suspended' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400' : ''}
                      `}>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-zinc-500 dark:text-zinc-400">
                      {user.joinedDate}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50"
                          title="Edit User"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteUser(user.id)}
                          className="h-8 w-8 text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400"
                          title="Delete User"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-zinc-500 dark:text-zinc-400">
                    Tidak ada data user yang sesuai dengan pencarian Anda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Pagination */}
        {filteredUsers.length > 0 && (
          <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              Showing <span className="font-semibold text-zinc-900 dark:text-zinc-50">{Math.min((currentPage - 1) * itemsPerPage + 1, filteredUsers.length)}</span> to{' '}
              <span className="font-semibold text-zinc-900 dark:text-zinc-50">{Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span> of{' '}
              <span className="font-semibold text-zinc-900 dark:text-zinc-50">{filteredUsers.length}</span> entries
            </span>

            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-9 w-9 rounded-lg"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {Array.from({ length: totalPages }).map((_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? 'primary' : 'outline'}
                  onClick={() => handlePageChange(i + 1)}
                  className={`h-9 w-9 rounded-lg text-sm font-semibold p-0`}
                >
                  {i + 1}
                </Button>
              ))}

              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-9 w-9 rounded-lg"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

export default UsersPage;
