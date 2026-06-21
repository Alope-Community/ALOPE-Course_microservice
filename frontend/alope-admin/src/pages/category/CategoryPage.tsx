import { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  FolderOpen,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import api from '../../api/api';

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

interface ApiResponse<T> {
  message: string;
  status: string;
  code: string;
  data: T;
}

export function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch all categories
  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<ApiResponse<Category[]>>('/api/cms/categories');
      if (response.data && response.data.status === 'success') {
        setCategories(response.data.data || []);
      } else {
        setError(response.data.message || 'Gagal mengambil data kategori.');
      }
    } catch (err: any) {
      console.error('Error fetching categories:', err);
      setError(
        err.response?.data?.message || 
        'Tidak dapat terhubung ke server backend cms-service.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Helper to auto-generate slug from name
  const handleNameChange = (val: string) => {
    setName(val);
    if (modalMode === 'create') {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric (except space/dash)
        .trim()
        .replace(/\s+/g, '-'); // Replace spaces with dashes
      setSlug(generatedSlug);
    }
  };

  // Open modal for Create
  const handleOpenCreate = () => {
    setModalMode('create');
    setCurrentId(null);
    setName('');
    setSlug('');
    setDescription('');
    setFormError(null);
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (category: Category) => {
    setModalMode('edit');
    setCurrentId(category.id);
    setName(category.name);
    setSlug(category.slug);
    setDescription(category.description);
    setFormError(null);
    setIsModalOpen(true);
  };

  // Delete Category
  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      try {
        const response = await api.delete<ApiResponse<any>>(`/api/cms/categories/${id}`);
        if (response.data && response.data.status === 'success') {
          setCategories(prev => prev.filter(c => c.id !== id));
        } else {
          alert(response.data.message || 'Gagal menghapus kategori.');
        }
      } catch (err: any) {
        console.error('Error deleting category:', err);
        alert(err.response?.data?.message || 'Gagal menghapus kategori.');
      }
    }
  };

  // Submit form (Create / Edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim() || !slug.trim()) {
      setFormError('Nama Kategori dan Slug wajib diisi!');
      return;
    }

    setSubmitting(true);
    try {
      if (modalMode === 'create') {
        const response = await api.post<ApiResponse<Category>>('/api/cms/categories', {
          name,
          slug,
          description
        });
        if (response.data && response.data.status === 'success') {
          setCategories(prev => [response.data.data, ...prev]);
          setIsModalOpen(false);
        } else {
          setFormError(response.data.message || 'Gagal membuat kategori.');
        }
      } else if (modalMode === 'edit' && currentId !== null) {
        const response = await api.put<ApiResponse<Category>>(`/api/cms/categories/${currentId}`, {
          name,
          slug,
          description
        });
        if (response.data && response.data.status === 'success') {
          setCategories(prev => 
            prev.map(c => c.id === currentId ? response.data.data : c)
          );
          setIsModalOpen(false);
        } else {
          setFormError(response.data.message || 'Gagal mengupdate kategori.');
        }
      }
    } catch (err: any) {
      console.error('Error submitting form:', err);
      setFormError(err.response?.data?.message || 'Gagal menyimpan kategori.');
    } finally {
      setSubmitting(false);
    }
  };

  // Local Search & Filter
  const filteredCategories = useMemo(() => {
    return categories.filter(category => 
      category.name.toLowerCase().includes(search.toLowerCase()) ||
      category.slug.toLowerCase().includes(search.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(search.toLowerCase()))
    );
  }, [categories, search]);

  // Pagination
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const paginatedCategories = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCategories.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCategories, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Manage Categories
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Create, edit, and organize categories for courses in ALOPE.
          </p>
        </div>
        <Button 
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-sm h-10 gap-2 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Main Content Card */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-zinc-500" />
          <p className="text-zinc-500 text-sm">Loading categories...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 border border-red-200/50 dark:border-red-900/30 bg-red-50/20 dark:bg-red-950/10 rounded-2xl gap-3 text-center">
          <AlertCircle className="h-10 w-10 text-red-500" />
          <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
          <Button variant="outline" onClick={fetchCategories} className="mt-2">
            Coba Lagi
          </Button>
        </div>
      ) : (
        <Card className="overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm rounded-xl">
          {/* Table Filters header - Search Only */}
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-zinc-500" />
              <input
                type="text"
                placeholder="Search category name, slug or description..."
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
                  <th className="p-4">Category Name</th>
                  <th className="p-4">Slug</th>
                  <th className="p-4">Description</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {paginatedCategories.length > 0 ? (
                  paginatedCategories.map((category, index) => (
                    <tr 
                      key={category.id} 
                      className="hover:bg-zinc-50/60 dark:hover:bg-zinc-900/20 transition-colors duration-150 group"
                    >
                      <td className="p-4 pl-6 text-center text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center border border-zinc-200 dark:border-zinc-800 shrink-0">
                            <FolderOpen className="h-4.5 w-4.5 text-zinc-500 dark:text-zinc-400" />
                          </div>
                          <span className="font-semibold text-zinc-900 dark:text-zinc-50 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors">
                            {category.name}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-mono text-xs text-zinc-650 dark:text-zinc-350 bg-zinc-100 dark:bg-zinc-900 px-2 py-1 rounded border border-zinc-200 dark:border-zinc-800">
                          {category.slug}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-zinc-500 dark:text-zinc-400 max-w-xs truncate">
                        {category.description || '-'}
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleOpenEdit(category)}
                            className="h-8 w-8 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 cursor-pointer"
                            title="Edit Category"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDelete(category.id)}
                            className="h-8 w-8 text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
                            title="Delete Category"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-zinc-500 dark:text-zinc-400">
                      Tidak ada kategori yang sesuai dengan pencarian Anda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Pagination */}
          {filteredCategories.length > 0 && (
            <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                Showing <span className="font-semibold text-zinc-900 dark:text-zinc-50">{Math.min((currentPage - 1) * itemsPerPage + 1, filteredCategories.length)}</span> to{' '}
                <span className="font-semibold text-zinc-900 dark:text-zinc-50">{Math.min(currentPage * itemsPerPage, filteredCategories.length)}</span> of{' '}
                <span className="font-semibold text-zinc-900 dark:text-zinc-50">{filteredCategories.length}</span> entries
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
      )}

      {/* Modal Form */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={modalMode === 'create' ? 'Add New Category' : 'Edit Category'}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {formError && (
            <div className="p-3 text-xs font-semibold bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-450 rounded-lg flex items-center gap-2 border border-rose-100 dark:border-rose-900/30">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Category Name
            </label>
            <input
              type="text"
              placeholder="e.g. Web Programming"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-700 text-zinc-900 dark:text-zinc-50"
              disabled={submitting}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Slug (URL Identifier)
            </label>
            <input
              type="text"
              placeholder="e.g. web-programming"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-700 text-zinc-900 dark:text-zinc-50 font-mono"
              disabled={submitting}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Description
            </label>
            <textarea
              placeholder="Provide a brief description of this category..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-700 text-zinc-900 dark:text-zinc-50 h-24 resize-none"
              disabled={submitting}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-150 dark:border-zinc-800">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => setIsModalOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="inline-flex items-center gap-1.5 cursor-pointer">
              {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>{modalMode === 'create' ? 'Save Category' : 'Update Category'}</span>
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default CategoryPage;
