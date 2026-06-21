import { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  LayoutGrid,
  Book,
  Loader2,
  AlertCircle,
  Upload
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useToast } from '../../components/ui/Toast';
import { RichTextEditor } from '../../components/ui/RichTextEditor';
import api from '../../api/api';

interface Course {
  id: number;
  title: string;
  slug: string;
}

interface Module {
  id: number;
  course_id: number;
  course?: Course;
  title: string;
  slug: string;
  description: string;
  cover: string;
  body: string;
  created_at?: string;
  updated_at?: string;
}

interface ApiResponse<T> {
  message: string;
  status: string;
  code: string;
  data: T;
}

export function ModulePage() {
  const toast = useToast();
  const [modules, setModules] = useState<Module[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
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

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [courseId, setCourseId] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [cover, setCover] = useState('');
  const [body, setBody] = useState('');

  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Confirm Delete Dialog States
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch all modules
  const fetchModules = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<ApiResponse<Module[]>>('/api/cms/modules');
      if (response.data && response.data.status === 'success') {
        setModules(response.data.data || []);
      } else {
        setError(response.data.message || 'Gagal mengambil data module.');
      }
    } catch (err: any) {
      console.error('Error fetching modules:', err);
      setError(
        err.response?.data?.message || 
        'Tidak dapat terhubung ke server backend cms-service.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch courses (for dropdown selection)
  const fetchCourses = async () => {
    try {
      const response = await api.get<ApiResponse<Course[]>>('/api/cms/courses');
      if (response.data && response.data.status === 'success') {
        setCourses(response.data.data || []);
      }
    } catch (err) {
      console.error('Gagal memuat list course:', err);
    }
  };

  useEffect(() => {
    fetchModules();
    fetchCourses();
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

  // Cover image upload simulator
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const randomId = Math.floor(Math.random() * 1000);
      setCover(`https://picsum.photos/seed/${randomId}/600/400`);
    }
  };

  const triggerFileInput = () => {
    document.getElementById('module-cover-file')?.click();
  };

  // Open modal for Create
  const handleOpenCreate = () => {
    setModalMode('create');
    setCurrentId(null);
    setTitle('');
    setSlug('');
    setCourseId('');
    setDescription('');
    setCover('');
    setBody('');
    setFormError(null);
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (m: Module) => {
    setModalMode('edit');
    setCurrentId(m.id);
    setTitle(m.title);
    setSlug(m.slug);
    setCourseId(m.course_id);
    setDescription(m.description || '');
    setCover(m.cover || '');
    setBody(m.body || '');
    setFormError(null);
    setIsModalOpen(true);
  };

  // Trigger delete dialog
  const handleDeleteClick = (id: number) => {
    setDeleteTargetId(id);
    setIsConfirmOpen(true);
  };

  // Confirm and run API Delete
  const handleConfirmDelete = async () => {
    if (deleteTargetId === null) return;
    setDeleting(true);
    try {
      const response = await api.delete<ApiResponse<any>>(`/api/cms/modules/${deleteTargetId}`);
      if (response.data && response.data.status === 'success') {
        setModules(prev => prev.filter(m => m.id !== deleteTargetId));
        toast.success('Module berhasil dihapus!');
      } else {
        toast.error(response.data.message || 'Gagal menghapus module.');
      }
    } catch (err: any) {
      console.error('Error deleting module:', err);
      toast.error(err.response?.data?.message || 'Gagal menghapus module.');
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

    if (!title.trim() || !slug.trim() || !courseId) {
      setFormError('Module Title, Slug, dan Course wajib diisi!');
      return;
    }

    setSubmitting(true);
    const payload = {
      course_id: Number(courseId),
      title,
      slug,
      description,
      cover,
      body
    };

    try {
      if (modalMode === 'create') {
        const response = await api.post<ApiResponse<Module>>('/api/cms/modules', payload);
        if (response.data && response.data.status === 'success') {
          fetchModules();
          setIsModalOpen(false);
          toast.success('Module berhasil ditambahkan!');
        } else {
          setFormError(response.data.message || 'Gagal membuat module.');
          toast.error(response.data.message || 'Gagal membuat module.');
        }
      } else if (modalMode === 'edit' && currentId !== null) {
        const response = await api.put<ApiResponse<Module>>(`/api/cms/modules/${currentId}`, payload);
        if (response.data && response.data.status === 'success') {
          fetchModules();
          setIsModalOpen(false);
          toast.success('Module berhasil diupdate!');
        } else {
          setFormError(response.data.message || 'Gagal mengupdate module.');
          toast.error(response.data.message || 'Gagal mengupdate module.');
        }
      }
    } catch (err: any) {
      console.error('Error submitting module:', err);
      const errMsg = err.response?.data?.message || 'Gagal menyimpan module.';
      setFormError(errMsg);
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  // Local Search & Filter
  const filteredModules = useMemo(() => {
    return modules.filter(m => 
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.slug.toLowerCase().includes(search.toLowerCase()) ||
      (m.course && m.course.title.toLowerCase().includes(search.toLowerCase())) ||
      (m.description && m.description.toLowerCase().includes(search.toLowerCase()))
    );
  }, [modules, search]);

  // Pagination
  const totalPages = Math.ceil(filteredModules.length / itemsPerPage);
  const paginatedModules = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredModules.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredModules, currentPage]);

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
            Manage Modules
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Create, edit, and organize learning modules within your courses.
          </p>
        </div>
        <Button 
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-sm h-10 gap-2 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add Module
        </Button>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-zinc-550" />
          <p className="text-zinc-500 text-sm">Loading modules...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 border border-red-200/50 dark:border-red-900/30 bg-red-50/20 dark:bg-red-950/10 rounded-2xl gap-3 text-center">
          <AlertCircle className="h-10 w-10 text-red-500" />
          <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
          <Button variant="outline" onClick={fetchModules} className="mt-2">
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
                placeholder="Search module title, course, or slug..."
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
                  <th className="p-4">Module Title</th>
                  <th className="p-4">Course Name</th>
                  <th className="p-4">Slug</th>
                  <th className="p-4">Short Description</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {paginatedModules.length > 0 ? (
                  paginatedModules.map((m, index) => (
                    <tr 
                      key={m.id} 
                      className="hover:bg-zinc-50/60 dark:hover:bg-zinc-900/20 transition-colors duration-150 group"
                    >
                      <td className="p-4 pl-6 text-center text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {m.cover && !imageErrors[m.id] ? (
                            <div className="relative h-12 w-20 shrink-0 rounded-xl overflow-hidden border border-zinc-200/60 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 shadow-sm">
                              <img 
                                src={m.cover} 
                                alt={m.title} 
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                onError={() => { 
                                  setImageErrors(prev => ({ ...prev, [m.id]: true })); 
                                }}
                              />
                            </div>
                          ) : (
                            <div className="h-12 w-20 shrink-0 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center border border-zinc-200 dark:border-zinc-800 shadow-sm">
                              <LayoutGrid className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="font-semibold text-zinc-900 dark:text-zinc-50 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors">
                              {m.title}
                            </span>
                            <span className="text-xs text-zinc-400 font-mono">ID: {m.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-zinc-700 dark:text-zinc-300">
                        <span className="inline-flex items-center gap-1.5">
                          <Book className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                          {m.course?.title || 'Unassigned'}
                        </span>
                      </td>
                      <td className="p-4 text-sm font-mono text-zinc-500 dark:text-zinc-400">
                        {m.slug}
                      </td>
                      <td className="p-4 text-sm text-zinc-550 dark:text-zinc-400 max-w-xs truncate" title={m.description}>
                        {m.description || '-'}
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleOpenEdit(m)}
                            className="h-8 w-8 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 cursor-pointer"
                            title="Edit Module"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteClick(m.id)}
                            className="h-8 w-8 text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
                            title="Delete Module"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-zinc-500 dark:text-zinc-400">
                      Tidak ada module yang sesuai dengan pencarian Anda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Pagination */}
          {filteredModules.length > 0 && (
            <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                Showing <span className="font-semibold text-zinc-900 dark:text-zinc-50">{Math.min((currentPage - 1) * itemsPerPage + 1, filteredModules.length)}</span> to{' '}
                <span className="font-semibold text-zinc-900 dark:text-zinc-50">{Math.min(currentPage * itemsPerPage, filteredModules.length)}</span> of{' '}
                <span className="font-semibold text-zinc-900 dark:text-zinc-50">{filteredModules.length}</span> entries
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

      {/* Reusable Modal for adding/editing module */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={modalMode === 'create' ? 'Create New Module' : 'Edit Module'}
        maxWidthClass="max-w-4xl"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
          {formError && (
            <div className="p-3 text-xs font-semibold bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 rounded-xl flex items-center gap-2 border border-rose-100 dark:border-rose-900/30">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Form Rows */}
          <div className="flex flex-col gap-4">
            
            {/* Title & Course Selection in Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-zinc-550 dark:text-zinc-400 uppercase tracking-wider">
                  Module Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Introduction to variables"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-zinc-50/50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-700 text-zinc-900 dark:text-zinc-50 transition"
                  disabled={submitting}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-zinc-555 dark:text-zinc-400 uppercase tracking-wider">
                  Course
                </label>
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-4 py-2.5 text-sm bg-zinc-50/50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-700 text-zinc-900 dark:text-zinc-50 cursor-pointer transition"
                  disabled={submitting}
                >
                  <option value="">Select Course</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Slug URL */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-zinc-550 dark:text-zinc-400 uppercase tracking-wider">
                Slug (URL Identifier)
              </label>
              <input
                type="text"
                placeholder="e.g. introduction-to-variables"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-zinc-50/50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-700 text-zinc-900 dark:text-zinc-50 font-mono transition"
                disabled={submitting}
              />
            </div>

            {/* Module Cover Photo Upload */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-zinc-550 dark:text-zinc-400 uppercase tracking-wider">
                Module Cover
              </label>
              
              {cover ? (
                <div className="relative rounded-2xl overflow-hidden group aspect-[21/9] border border-zinc-200 dark:border-zinc-800 shadow-md bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
                  <img src={cover} alt="Cover Preview" className="w-full h-full object-cover" />
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
                  className="border-2 border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl p-7 text-center hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition cursor-pointer flex flex-col items-center justify-center gap-2 group shadow-sm bg-zinc-50/20"
                >
                  <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center border border-zinc-200 dark:border-zinc-800 group-hover:scale-110 transition duration-300">
                    <Upload className="h-5 w-5 text-zinc-500 animate-pulse" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Click to upload</span>
                    <span className="text-xs text-zinc-400 mt-0.5">PNG, JPG up to 2MB</span>
                  </div>
                </div>
              )}
              <input 
                type="file" 
                id="module-cover-file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageUpload} 
              />
            </div>

            {/* Short Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-zinc-550 dark:text-zinc-400 uppercase tracking-wider">
                Short Description
              </label>
              <input
                type="text"
                placeholder="Provide a brief summary of the module content..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-zinc-50/50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-700 text-zinc-900 dark:text-zinc-50 transition"
                disabled={submitting}
              />
            </div>

            {/* Body (Rich Text CKEditor) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-zinc-550 dark:text-zinc-400 uppercase tracking-wider">
                Body
              </label>
              <RichTextEditor
                value={body}
                onChange={setBody}
                placeholder="Write the full rich content of the learning module here..."
                disabled={submitting}
              />
            </div>

          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-150 dark:border-zinc-850 mt-2">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => setIsModalOpen(false)}
              disabled={submitting}
              className="text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:text-zinc-200 rounded-xl font-bold px-4 cursor-pointer"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={submitting} 
              className="inline-flex items-center gap-2 cursor-pointer bg-blue-650 hover:bg-blue-700 bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg hover:shadow transition"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{modalMode === 'create' ? 'Publish Module' : 'Update Module'}</span>
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Module"
        description="Apakah Anda yakin ingin menghapus module ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus Module"
        cancelText="Batal"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}

export default ModulePage;
