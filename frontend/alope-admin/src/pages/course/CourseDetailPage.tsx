import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  BookOpen, 
  AlertCircle, 
  Loader2, 
  Globe, 
  Lock, 
  FileText,
  FileCode,
  Layers
} from 'lucide-react';
import api from '../../api/api';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

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
  created_at?: string;
  updated_at?: string;
}

interface ApiResponse<T> {
  message: string;
  status: string;
  code: string;
  data: T;
}

export function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  const fetchCourseDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<ApiResponse<Course>>(`/api/cms/courses/${id}`);
      if (response.data && response.data.status === 'success') {
        setCourse(response.data.data);
      } else {
        setError(response.data.message || 'Gagal mengambil detail course.');
      }
    } catch (err: any) {
      console.error('Error fetching course details:', err);
      setError(
        err.response?.data?.message || 
        'Tidak dapat terhubung ke server backend atau course tidak ditemukan.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCourseDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-zinc-550 dark:text-zinc-400" />
        <p className="text-zinc-550 dark:text-zinc-400 text-sm font-medium animate-pulse">Loading course details...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 border border-red-200/50 dark:border-red-900/30 bg-red-50/20 dark:bg-red-950/10 rounded-2xl text-center flex flex-col items-center gap-4 animate-in fade-in duration-300">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Error Loading Course</h3>
        <p className="text-red-700 dark:text-red-400 font-medium text-sm">{error || 'Course details are not available.'}</p>
        <div className="flex gap-3 mt-2">
          <Button variant="outline" onClick={() => navigate('/courses')} className="rounded-xl">
            Back to Courses
          </Button>
          <Button onClick={fetchCourseDetails} className="rounded-xl">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const courseVisibility = course.visibility || course.visibilty || 'public';

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500 max-w-6xl mx-auto pb-12">
      {/* Navigation & Actions Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 font-medium">
          <Link to="/courses" className="hover:text-zinc-900 dark:hover:text-zinc-150 transition">
            Courses
          </Link>
          <span>/</span>
          <span className="text-zinc-900 dark:text-zinc-200 truncate max-w-[200px] sm:max-w-xs">
            {course.title}
          </span>
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate('/courses')}
          className="inline-flex items-center gap-2 rounded-xl text-xs font-semibold cursor-pointer shadow-sm hover:shadow transition bg-white dark:bg-zinc-900 h-9"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to list
        </Button>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column - Hero Banner Card */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <Card className="overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-md rounded-2xl">
            {/* Cover Image Container */}
            <div className="relative w-full aspect-[16/9] bg-zinc-100 dark:bg-zinc-900 overflow-hidden border-b border-zinc-100 dark:border-zinc-850">
              {course.cover && !imageError ? (
                <img 
                  src={course.cover} 
                  alt={course.title} 
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-650 gap-3">
                  <BookOpen className="h-16 w-16" />
                  <span className="text-xs font-medium uppercase tracking-widest text-zinc-400/80">No Cover Image</span>
                </div>
              )}
              
              {/* Badges Floating inside image */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-white/90 dark:bg-zinc-900/90 text-zinc-900 dark:text-zinc-50 shadow backdrop-blur-sm">
                  {course.category?.name || 'Uncategorized'}
                </span>
              </div>
            </div>

            {/* Banner Text Body */}
            <div className="p-8 flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3">
                {/* Visibility Badge */}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200/40 dark:border-zinc-800">
                  {courseVisibility === 'public' ? (
                    <Globe className="h-3.5 w-3.5 text-zinc-500" />
                  ) : (
                    <Lock className="h-3.5 w-3.5 text-zinc-500" />
                  )}
                  <span className="capitalize">{courseVisibility}</span>
                </span>

                {/* Status Badge */}
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold capitalize border
                  ${(course.status === 'published') ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50 dark:bg-emerald-950/30 dark:text-emerald-450 dark:border-emerald-900/30' : ''}
                  ${(course.status === 'draft') ? 'bg-zinc-100 text-zinc-700 border-zinc-200/50 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800' : ''}
                  ${(course.status === 'archived') ? 'bg-rose-50 text-rose-700 border-rose-200/50 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/30' : ''}
                `}>
                  {course.status || 'draft'}
                </span>
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight">
                {course.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2 pt-4 border-t border-zinc-100 dark:border-zinc-900 text-xs text-zinc-500 dark:text-zinc-400">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-zinc-400" />
                  Created: {course.created_at ? new Date(course.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Tanggal tidak tersedia'}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-zinc-400" />
                  Updated: {course.updated_at ? new Date(course.updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Tanggal tidak tersedia'}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Details, Description & Stats */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Description Card */}
          <Card className="p-6 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm rounded-2xl flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center gap-2">
              <FileText className="h-4 w-4 text-zinc-450" />
              Course Description
            </h3>
            <div className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans min-h-[80px] whitespace-pre-wrap p-4 bg-zinc-50/50 dark:bg-zinc-900/40 rounded-xl border border-zinc-150 dark:border-zinc-850">
              {course.description || 'Tidak ada deskripsi yang tersedia untuk course ini.'}
            </div>
          </Card>

          {/* Technical Metadata Card */}
          <Card className="p-6 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm rounded-2xl flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center gap-2">
              <FileCode className="h-4 w-4 text-zinc-450" />
              Technical Metadata
            </h3>
            <div className="flex flex-col gap-3.5">
              <div className="flex justify-between items-center py-1.5 border-b border-zinc-100 dark:border-zinc-900">
                <span className="text-xs font-semibold text-zinc-400">Database ID</span>
                <span className="text-xs font-mono font-bold text-zinc-800 dark:text-zinc-200">{course.id}</span>
              </div>
              <div className="flex flex-col gap-1 py-1.5 border-b border-zinc-100 dark:border-zinc-900">
                <span className="text-xs font-semibold text-zinc-400">Slug Identifier</span>
                <span className="text-xs font-mono font-bold text-zinc-800 dark:text-zinc-200 truncate">{course.slug}</span>
              </div>
              <div className="flex flex-col gap-1 py-1.5">
                <span className="text-xs font-semibold text-zinc-400">Cover URL</span>
                <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-450 truncate" title={course.cover}>
                  {course.cover || 'None (Using Fallback Placeholder)'}
                </span>
              </div>
            </div>
          </Card>

          {/* Quick Metrics / Summary */}
          <Card className="p-6 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm rounded-2xl flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center gap-2">
              <Layers className="h-4 w-4 text-zinc-455" />
              Associated Modules
            </h3>
            <div className="flex flex-col items-center justify-center p-6 bg-zinc-50/40 dark:bg-zinc-900/20 border border-dashed border-zinc-200 dark:border-zinc-850 rounded-xl text-center gap-3">
              <div className="text-zinc-400 dark:text-zinc-600">
                <Layers className="h-8 w-8 mx-auto opacity-70" />
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Modules Management</p>
                <p className="text-xs text-zinc-550 dark:text-zinc-400 mt-0.5">Use the Modules page to register sections for this course.</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => navigate('/modules')}
                className="mt-1 h-8 rounded-lg text-xs font-semibold shadow-sm"
              >
                Go to Modules
              </Button>
            </div>
          </Card>

        </div>

      </div>
    </div>
  );
}

export default CourseDetailPage;
