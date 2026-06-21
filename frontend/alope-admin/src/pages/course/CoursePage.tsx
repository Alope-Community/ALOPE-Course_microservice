import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen,
  User,
  Loader2,
  AlertCircle,
  FolderOpen,
  Upload,
  Eye
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import api from '../../api/api';

interface Course {
  id: number;
  title: string;
  category_id: number;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  slug: string;
  description: string;
  cover: string;
  visibilty?: string;
  visibility?: string;
  status: 'draft' | 'published' | 'archived';
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface ApiResponse<T> {
  message: string;
  status: string;
  code: string;
  data: T;
}

export function CoursePage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [currentId, setCurrentId] = useState<number | null>(null);
  
  // Confirm Delete Dialog States
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [cover, setCover] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>('draft');
  
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch courses
  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<ApiResponse<Course[]>>('/api/cms/courses');
      if (response.data && response.data.status === 'success') {
        setCourses(response.data.data || []);
      } else {
        setError(response.data.message || 'Gagal mengambil data course.');
      }
    } catch (err: any) {
      console.error('Error fetching courses:', err);
      setError(
        err.response?.data?.message || 
        'Tidak dapat terhubung ke server backend cms-service.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories (for dropdown selection)
  const fetchCategories = async () => {
    try {
      const response = await api.get<ApiResponse<Category[]>>('/api/cms/categories');
      if (response.data && response.data.status === 'success') {
        setCategories(response.data.data || []);
      }
    } catch (err) {
      console.warn('Gagal memuat kategori dari API, menggunakan fallback seeder:', err);
      // Fallback categories if backend redis is down so dropdown still functions
      setCategories([
        { id: 1, name: 'Web Programming', slug: 'web-programming' },
        { id: 2, name: 'Mobile Programming', slug: 'mobile-programming' }
      ]);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, []);

  // Helper to auto-generate slug from title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (modalMode === 'create') {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      setSlug(generatedSlug);
    }
  };

  // Handle local image upload simulation (to comply with VARCHAR 255 DB limit)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const randomId = Math.floor(Math.random() * 1000);
      setCover(`https://picsum.photos/seed/${randomId}/600/400`);
    }
  };

  const triggerFileInput = () => {
    document.getElementById('cover-file-input')?.click();
  };

  // Open modal for Create
  const handleOpenCreate = () => {
    setModalMode('create');
    setCurrentId(null);
    setTitle('');
    setSlug('');
    setCategoryId('');
    setDescription('');
    setCover('');
    setVisibility('public');
    setStatus('draft');
    setFormError(null);
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (course: Course) => {
    setModalMode('edit');
    setCurrentId(course.id);
    setTitle(course.title);
    setSlug(course.slug);
    setCategoryId(course.category_id);
    setDescription(course.description || '');
    setCover(course.cover || '');
    setVisibility((course.visibility || course.visibilty || 'public') as 'public' | 'private');
    setStatus(course.status || 'draft');
    setFormError(null);
    setIsModalOpen(true);
  };

  // Delete Course trigger dialog
  const handleDeleteClick = (id: number) => {
    setDeleteTargetId(id);
    setIsConfirmOpen(true);
  };

  // Confirm and run API Delete
  const handleConfirmDelete = async () => {
    if (deleteTargetId === null) return;
    setDeleting(true);
    try {
      const response = await api.delete<ApiResponse<any>>(`/api/cms/courses/${deleteTargetId}`);
      if (response.data && response.data.status === 'success') {
        setCourses(prev => prev.filter(c => c.id !== deleteTargetId));
        toast.success('Course berhasil dihapus!');
      } else {
        toast.error(response.data.message || 'Gagal menghapus course.');
      }
    } catch (err: any) {
      console.error('Error deleting course:', err);
      toast.error(err.response?.data?.message || 'Gagal menghapus course.');
    } finally {
      setDeleting(false);
      setIsConfirmOpen(false);
      setDeleteTargetId(null);
    }
  };

  // Submit form (Create / Edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim() || !slug.trim() || !categoryId) {
      setFormError('Judul Course, Slug, dan Kategori wajib diisi!');
      return;
    }

    setSubmitting(true);
    
    const payload = {
      title,
      category_id: Number(categoryId),
      slug,
      description,
      cover,
      visibility,
      visibilty: visibility,
      status
    };

    try {
      if (modalMode === 'create') {
        const response = await api.post<ApiResponse<Course>>('/api/cms/courses', payload);
        if (response.data && response.data.status === 'success') {
          fetchCourses(); 
          setIsModalOpen(false);
          toast.success('Course berhasil ditambahkan!');
        } else {
          setFormError(response.data.message || 'Gagal membuat course.');
          toast.error(response.data.message || 'Gagal membuat course.');
        }
      } else if (modalMode === 'edit' && currentId !== null) {
        const response = await api.put<ApiResponse<Course>>(`/api/cms/courses/${currentId}`, payload);
        if (response.data && response.data.status === 'success') {
          fetchCourses(); 
          setIsModalOpen(false);
          toast.success('Course berhasil diupdate!');
        } else {
          setFormError(response.data.message || 'Gagal mengupdate course.');
          toast.error(response.data.message || 'Gagal mengupdate course.');
        }
      }
    } catch (err: any) {
      console.error('Error submitting course:', err);
      const errMsg = err.response?.data?.message || 'Gagal menyimpan course.';
      setFormError(errMsg);
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  // Local Search & Filter
  const filteredCourses = useMemo(() => {
    return courses.filter(course => 
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.slug.toLowerCase().includes(search.toLowerCase()) ||
      (course.category && course.category.name.toLowerCase().includes(search.toLowerCase())) ||
      (course.description && course.description.toLowerCase().includes(search.toLowerCase()))
    );
  }, [courses, search]);

  // Pagination
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const paginatedCourses = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCourses.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCourses, currentPage]);

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
            Manage Courses
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Create, edit, and manage all courses on your learning platform.
          </p>
        </div>
        <Button 
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-sm h-10 gap-2 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add Course
        </Button>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-zinc-500" />
          <p className="text-zinc-500 text-sm">Loading courses...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 border border-red-200/50 dark:border-red-900/30 bg-red-50/20 dark:bg-red-950/10 rounded-2xl gap-3 text-center">
          <AlertCircle className="h-10 w-10 text-red-500" />
          <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
          <Button variant="outline" onClick={fetchCourses} className="mt-2">
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
                placeholder="Search course title, category, or slug..."
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
                  <th className="p-4">Course Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Slug</th>
                  <th className="p-4">Visibility</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {paginatedCourses.length > 0 ? (
                  paginatedCourses.map((course, index) => (
                    <tr 
                      key={course.id} 
                      className="hover:bg-zinc-50/60 dark:hover:bg-zinc-900/20 transition-colors duration-150 group"
                    >
                      <td className="p-4 pl-6 text-center text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {course.cover && !imageErrors[course.id] ? (
                            <div className="relative h-12 w-20 md:h-14 md:w-24 shrink-0 rounded-xl overflow-hidden border border-zinc-200/60 dark:border-zinc-800 bg-zinc-105 dark:bg-zinc-900 shadow-sm">
                              <img 
                                src={course.cover} 
                                alt={course.title} 
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                onError={() => { 
                                  setImageErrors(prev => ({ ...prev, [course.id]: true })); 
                                }}
                              />
                            </div>
                          ) : (
                            <div className="h-12 w-20 md:h-14 md:w-24 shrink-0 rounded-xl bg-zinc-100 dark:bg-zinc-905 flex items-center justify-center border border-zinc-200 dark:border-zinc-800 shadow-sm">
                              <BookOpen className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="font-semibold text-zinc-900 dark:text-zinc-50 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors">
                              {course.title}
                            </span>
                            <span className="text-xs text-zinc-400 font-mono">ID: {course.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-zinc-700 dark:text-zinc-300">
                        <span className="inline-flex items-center gap-1.5">
                          <FolderOpen className="h-3.5 w-3.5 text-zinc-400" />
                          {course.category?.name || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="p-4 text-sm font-mono text-zinc-500 dark:text-zinc-400">
                        {course.slug}
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1.5 text-sm text-zinc-700 dark:text-zinc-300 capitalize">
                          <User className="h-3.5 w-3.5 text-zinc-400" />
                          {course.visibility || course.visibilty || 'public'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold leading-none capitalize
                          ${(course.status === 'published') ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' : ''}
                          ${(course.status === 'draft') ? 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400' : ''}
                          ${(course.status === 'archived') ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-455' : ''}
                        `}>
                          {course.status || 'draft'}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => navigate(`/courses/${course.id}`)}
                            className="h-8 w-8 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 cursor-pointer"
                            title="View Details"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleOpenEdit(course)}
                            className="h-8 w-8 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 cursor-pointer"
                            title="Edit Course"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteClick(course.id)}
                            className="h-8 w-8 text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
                            title="Delete Course"
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
                      Tidak ada course yang sesuai dengan pencarian Anda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Pagination */}
          {filteredCourses.length > 0 && (
            <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                Showing <span className="font-semibold text-zinc-900 dark:text-zinc-50">{Math.min((currentPage - 1) * itemsPerPage + 1, filteredCourses.length)}</span> to{' '}
                <span className="font-semibold text-zinc-900 dark:text-zinc-50">{Math.min(currentPage * itemsPerPage, filteredCourses.length)}</span> of{' '}
                <span className="font-semibold text-zinc-900 dark:text-zinc-50">{filteredCourses.length}</span> entries
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

      {/* Reusable Modal for adding/editing course */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={modalMode === 'create' ? 'Add New Course' : 'Edit Course'}
        maxWidthClass="max-w-4xl"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
          {formError && (
            <div className="p-3.5 text-xs font-semibold bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-405 rounded-xl flex items-center gap-2 border border-rose-100 dark:border-rose-900/30 animate-in fade-in">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Form Fields: Two-Column Responsive Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Left Column (Upload and Badges/Settings) */}
            <div className="md:col-span-5 flex flex-col gap-5">
              
              {/* Cover image upload zone */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Course Cover Photo
                </label>
                
                {cover ? (
                  <div className="relative rounded-2xl overflow-hidden group aspect-[16/9] border border-zinc-200 dark:border-zinc-800 shadow-md bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
                    <img src={cover} alt="Cover Preview" className="w-full h-full object-cover transition-transform duration-305 group-hover:scale-102" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                      <Button 
                        type="button" 
                        onClick={triggerFileInput}
                        className="bg-white hover:bg-zinc-100 text-zinc-900 border-none rounded-xl text-xs py-1.5 px-3 font-semibold shadow cursor-pointer"
                      >
                        Change Photo
                      </Button>
                      <Button 
                        type="button" 
                        onClick={() => setCover('')}
                        className="bg-red-600 hover:bg-red-700 text-white border-none rounded-xl text-xs py-1.5 px-3 font-semibold shadow cursor-pointer"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={triggerFileInput}
                    className="border-2 border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl p-8 text-center hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition cursor-pointer flex flex-col items-center justify-center gap-3 group shadow-sm bg-zinc-50/20 aspect-[16/9]"
                  >
                    <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-905 flex items-center justify-center border border-zinc-200 dark:border-zinc-800 group-hover:scale-110 transition duration-300">
                      <Upload className="h-5 w-5 text-zinc-500" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Upload Cover Photo</span>
                      <span className="text-xs text-zinc-400 mt-0.5">Click to choose image file</span>
                    </div>
                  </div>
                )}
                <input 
                  type="file" 
                  id="cover-file-input" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageUpload} 
                />
              </div>

              {/* Visibility Segmented control */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Visibility
                </label>
                <div className="flex bg-zinc-100 dark:bg-zinc-900 p-0.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800/80">
                  <button
                    type="button"
                    onClick={() => setVisibility('public')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      visibility === 'public'
                        ? 'bg-white text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50 shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
                    }`}
                  >
                    Public
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisibility('private')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      visibility === 'private'
                        ? 'bg-white text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50 shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
                    }`}
                  >
                    Private
                  </button>
                </div>
              </div>

              {/* Status Segmented control */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Status
                </label>
                <div className="flex bg-zinc-100 dark:bg-zinc-905 p-0.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800/80">
                  {(['draft', 'published', 'archived'] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatus(s)}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all capitalize cursor-pointer ${
                        status === s
                          ? s === 'published'
                            ? 'bg-emerald-550 text-white bg-emerald-500 shadow-sm'
                            : s === 'archived'
                            ? 'bg-rose-550 text-white bg-rose-500 shadow-sm'
                            : 'bg-white text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50 shadow-sm'
                          : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column (Inputs: Title, Slug, Category, Description) */}
            <div className="md:col-span-7 flex flex-col gap-4">
              
              {/* Course Title */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Course Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Go Programming for Experts"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-zinc-50/50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-450 dark:focus:ring-zinc-700 text-zinc-900 dark:text-zinc-50 transition"
                  disabled={submitting}
                />
              </div>

              {/* Slug URL */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Slug (URL Identifier)
                </label>
                <input
                  type="text"
                  placeholder="e.g. go-programming-for-experts"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-zinc-50/50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-450 dark:focus:ring-zinc-700 text-zinc-900 dark:text-zinc-50 font-mono transition"
                  disabled={submitting}
                />
              </div>

              {/* Category Selection */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Category
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-4 py-2.5 text-sm bg-zinc-50/50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-450 dark:focus:ring-zinc-700 text-zinc-900 dark:text-zinc-50 cursor-pointer transition shadow-sm"
                  disabled={submitting}
                >
                  <option value="">-- Choose Category --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  placeholder="Provide a detailed description of the course content..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-zinc-50/50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-455 dark:focus:ring-zinc-700 text-zinc-900 dark:text-zinc-50 h-32 resize-none transition"
                  disabled={submitting}
                />
              </div>

            </div>

          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-150 dark:border-zinc-850 mt-2">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => setIsModalOpen(false)}
              disabled={submitting}
              className="text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:text-zinc-205 rounded-xl font-bold px-4 cursor-pointer"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={submitting} 
              className="inline-flex items-center gap-2 cursor-pointer bg-zinc-950 hover:bg-zinc-900 text-white dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-950 font-bold px-6 py-2.5 rounded-xl shadow-lg hover:shadow transition"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{modalMode === 'create' ? 'Save Course' : 'Update Course'}</span>
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Course"
        description="Apakah Anda yakin ingin menghapus course ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus Course"
        cancelText="Batal"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}

export default CoursePage;
