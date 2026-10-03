import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Upload, FolderOpen, FileText, CheckCircle2, 
  Clock, ArrowRight, ShieldCheck, Trash2, AlertCircle, Sparkles, BookOpen
} from 'lucide-react';
import { useSOP } from '../../state/documentContext';
import { DocumentSummary, SOPDocument } from '../../types/document';
import { documentStorage } from '../../storage/localStorageAdapter';
import { importers } from '../../import/documentImporter';
import { SAMPLE_LAB_SOP } from '../../data/sampleSop';

export const HomeScreen: React.FC = () => {
  const { startNewDocumentFlow, loadDocument, loadSampleDocument, setCurrentScreen } = useSOP();
  const [recents, setRecents] = useState<DocumentSummary[]>([]);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchRecents = async () => {
    const list = await documentStorage.listRecent();
    setRecents(list);
  };

  useEffect(() => {
    fetchRecents();
  }, []);

  const handleOpenRecent = async (id: string) => {
    const doc = await documentStorage.get(id);
    if (doc) {
      loadDocument(doc);
    } else if (id === SAMPLE_LAB_SOP.id) {
      loadSampleDocument();
    }
  };

  const handleDeleteRecent = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await documentStorage.delete(id);
    fetchRecents();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setImportError(null);
      const doc = await importers.json.importDocument(file);
      await documentStorage.save(doc);
      loadDocument(doc);
    } catch (err: any) {
      setImportError(err.message || 'Failed to import document');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Under Review':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'Obsolete':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'Draft':
      default:
        return 'text-amber-700 bg-amber-50 border-amber-200';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 py-10 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Brand & Introduction Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wider font-mono">
            <ShieldCheck className="w-4 h-4" />
            <span>Laboratory Document Control System</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            Standard Operating Procedure Studio
          </h1>
          <p className="text-base text-slate-600 max-w-2xl leading-relaxed">
            Create, format, structure, and preview laboratory Standard Operating Procedures. Designed for strict audit compliance (ISO 17025, cGMP, GLP) with client-side document sovereignty.
          </p>
        </div>

        {/* Primary Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* New SOP Card */}
          <div
            onClick={startNewDocumentFlow}
            className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Plus className="w-5 h-5" />
              </div>
              <h2 className="text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                New SOP Document
              </h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Start from a clean slate with 16 standardized regulatory sections and predefined visual styles.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-medium text-blue-600 group-hover:translate-x-0.5 transition-transform">
              <span>Configure new procedure</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Load Sample Card */}
          <div
            onClick={loadSampleDocument}
            className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-slate-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <h2 className="text-base font-semibold text-slate-900 group-hover:text-slate-700 transition-colors">
                Load pH Meter Sample SOP
              </h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Explore an authentic 16-section analytical calibration procedure (SOP-LAB-001) with full revision history and approvals.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-medium text-slate-700 group-hover:translate-x-0.5 transition-transform">
              <span>Open demonstration SOP</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Import SOP Card */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json,.sop.json"
              className="hidden"
            />
            <div>
              <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Upload className="w-5 h-5" />
              </div>
              <h2 className="text-base font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                Import SOP JSON
              </h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Upload a structured SOP JSON file to resume editing or restore an existing procedure archive.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-medium text-emerald-600 group-hover:translate-x-0.5 transition-transform">
              <span>Select .sop.json file</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Import Error Message */}
        {importError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{importError}</span>
          </div>
        )}

        {/* Recent Documents Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider font-mono">
                Recent Procedures
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Locally saved SOP documents stored securely in your browser cache.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {recents.length} documents
            </span>
          </div>

          {recents.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-xl border border-dashed border-slate-300">
              <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="text-xs text-slate-500 font-medium">No recent documents found</p>
              <button
                type="button"
                onClick={loadSampleDocument}
                className="mt-3 text-xs text-blue-600 hover:underline font-medium"
              >
                Load demonstration pH Meter SOP
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-sm">
              {recents.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleOpenRecent(item.id)}
                  className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4 cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 font-mono text-xs font-bold">
                      {item.sopNumber.split('-')[0] || 'SOP'}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900">
                          {item.sopNumber}
                        </span>
                        <span className="text-slate-300">·</span>
                        <h4 className="text-xs font-medium text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                        <span>{item.department}</span>
                        <span>·</span>
                        <span className="font-mono">v{item.version}</span>
                        <span>·</span>
                        <span>Theme: {item.templateId}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteRecent(e, item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors opacity-0 group-hover:opacity-100"
                      title="Remove from recent list"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Feature Roadmap & Architecture Overview */}
        <section className="p-6 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
          <div className="font-semibold text-slate-800 flex items-center gap-2 font-mono uppercase tracking-wider text-[11px]">
            <span>M0 Working Product Skeleton Status</span>
          </div>
          <p>
            SOPStudio operates 100% client-side with no server or external database dependency. In M0, the canonical document model powers the Editor, Outline, Metadata Panel, 5 Predefined Visual Styles, and A4 Paper-like Print/PDF export.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 text-[11px] font-mono">
            <div className="flex items-center gap-1.5 text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Structured Model</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>5 Visual Themes</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Rich Text Editor</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>A4 Print & JSON</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
