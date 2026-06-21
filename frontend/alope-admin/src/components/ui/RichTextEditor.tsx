import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

declare global {
  interface Window {
    ClassicEditor?: any;
  }
}

export function RichTextEditor({ value, onChange, placeholder = 'Write something...', disabled = false }: RichTextEditorProps) {
  const containerRef = useRef<HTMLTextAreaElement>(null);
  const editorRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const valueRef = useRef(value);
  const onChangeRef = useRef(onChange);

  // Keep references updated to avoid re-running initialization when values or hooks change
  useEffect(() => {
    valueRef.current = value;
    if (editorRef.current && editorRef.current.getData() !== value) {
      editorRef.current.setData(value);
    }
  }, [value]);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    let active = true;
    let checkInterval: any = null;
    let timeoutId: any = null;

    const initEditor = (ClassicEditor: any) => {
      if (!containerRef.current || !active) return;

      // Reuse initialization promise if already started on this DOM element (prevents duplicate editors in React StrictMode)
      let promise = (containerRef.current as any).__ck_promise__;
      if (!promise) {
        promise = ClassicEditor.create(containerRef.current, {
          placeholder: placeholder,
          toolbar: {
            items: [
              'heading',
              '|',
              'bold',
              'italic',
              'link',
              'bulletedList',
              'numberedList',
              '|',
              'blockQuote',
              'insertTable',
              '|',
              'undo',
              'redo'
            ]
          }
        });
        (containerRef.current as any).__ck_promise__ = promise;
      }

      promise
        .then((editor: any) => {
          editorRef.current = editor;

          if (!active) {
            // Keep the editor initialized on the element, but do not wire up listener yet
            return;
          }

          // Set initial value
          editor.setData(valueRef.current);

          // Readonly state
          if (disabled) {
            editor.enableReadOnlyMode('editor-disabled');
          } else {
            editor.disableReadOnlyMode('editor-disabled');
          }

          // Listen to changes (remove previous listeners to prevent duplicates)
          editor.model.document.off('change:data');
          editor.model.document.on('change:data', () => {
            const data = editor.getData();
            if (valueRef.current !== data) {
              onChangeRef.current(data);
            }
          });

          setLoading(false);
          setError(false);
          
          if (timeoutId) clearTimeout(timeoutId);
          if (checkInterval) clearInterval(checkInterval);
        })
        .catch((err: any) => {
          console.error('Failed to initialize CKEditor:', err);
          if (active) {
            setError(true);
            setLoading(false);
          }
        });
    };

    // Load CDN Script
    const scriptId = 'ckeditor-cdn-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://cdn.ckeditor.com/ckeditor5/34.0.0/classic/ckeditor.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        if (window.ClassicEditor) {
          initEditor(window.ClassicEditor);
        } else {
          setError(true);
          setLoading(false);
        }
      };

      script.onerror = () => {
        setError(true);
        setLoading(false);
      };
    } else {
      if (window.ClassicEditor) {
        initEditor(window.ClassicEditor);
      } else {
        checkInterval = setInterval(() => {
          if (window.ClassicEditor) {
            clearInterval(checkInterval);
            initEditor(window.ClassicEditor);
          }
        }, 100);
        
        // Timeout check
        timeoutId = setTimeout(() => {
          if (checkInterval) clearInterval(checkInterval);
          if (!editorRef.current) {
            setError(true);
            setLoading(false);
          }
        }, 5000);
      }
    }

    return () => {
      active = false;
      if (checkInterval) clearInterval(checkInterval);
      if (timeoutId) clearTimeout(timeoutId);

      // Clean up permanently when the DOM node is actually removed from the document,
      // which distinguishes between React Strict Mode remounting and actual page changes.
      setTimeout(() => {
        if (!containerRef.current || !document.body.contains(containerRef.current)) {
          if (editorRef.current) {
            const editorToDestroy = editorRef.current;
            editorRef.current = null;
            if (containerRef.current) {
              delete (containerRef.current as any).__ck_promise__;
            }
            editorToDestroy.destroy().catch((err: any) => {
              console.warn('Error destroying CKEditor instance:', err);
            });
          }
        }
      }, 50);
    };
  }, [placeholder]);

  // Dynamic read-only state handling
  useEffect(() => {
    if (editorRef.current) {
      if (disabled) {
        editorRef.current.enableReadOnlyMode('editor-disabled');
      } else {
        editorRef.current.disableReadOnlyMode('editor-disabled');
      }
    }
  }, [disabled]);

  return (
    <div className="w-full relative min-h-[200px] border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-950 transition focus-within:ring-2 focus-within:ring-zinc-400 dark:focus-within:ring-zinc-700">
      {loading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-zinc-50/70 dark:bg-zinc-950/70 backdrop-blur-sm gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
          <span className="text-xs text-zinc-500 font-semibold">Loading editor...</span>
        </div>
      )}
      {error && (
        <div className="p-4 text-xs font-semibold text-red-500 dark:text-red-400 bg-red-50/20 dark:bg-red-950/10 flex items-center justify-center">
          Failed to load text editor. Please refresh or check your internet connection.
        </div>
      )}
      <div className="prose max-w-none dark:prose-invert">
        <textarea ref={containerRef} className="hidden" />
      </div>
    </div>
  );
}

export default RichTextEditor;
