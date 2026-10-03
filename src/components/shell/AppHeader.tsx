import React, { useState, useRef, useEffect } from 'react';
import { 
  Save, Undo2, Redo2, Printer, Download, Plus, 
  FileCode, Palette, Sparkles, Check, ChevronDown, 
  Home, Edit3, Eye, Columns, AlertCircle
} from 'lucide-react';
import { useSOP } from '../../state/documentContext';
import { TEMPLATE_STYLES, TEMPLATE_STYLE_LIST } from '../../templates/styles';
import { TemplateStyleId } from '../../types/document';
import { exporters } from '../../export/documentExporter';

export const AppHeader: React.FC = () => {
  const { 
    document: doc, 
    viewMode, 
    setViewMode, 
    currentScreen, 
    setCurrentScreen, 
    startNewDocumentFlow,
    saveDocument, 
    isDirty, 
    canUndo, 
    canRedo, 
    undo, 
    redo,
    setTemplateStyle,
    lastSavedAt 
  } = useSOP();

  const [styleDropdownOpen, setStyleDropdownOpen] = useState(false);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  const styleMenuRef = useRef<HTMLDivElement>(null);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (styleMenuRef.current && !styleMenuRef.current.contains(e.target as Node)) {
        setStyleDropdownOpen(false);
      }
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setExportDropdownOpen(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleManualSave = async () => {
    await saveDocument();
    setSaveSuccessMessage('Saved');
    setTimeout(() => setSaveSuccessMessage(null), 2000);
  };

  const handleExportJSON = async () => {
    await exporters.json.exportDocument(doc);
    setExportDropdownOpen(false);
  };

  const handlePrint = async () => {
    await exporters.print.exportDocument(doc);
    setExportDropdownOpen(false);
  };

  return (
    <header className="h-14 border-b border-slate-200 bg-white px-4 md:px-6 flex items-center justify-between shrink-0 select-none z-30">
      {/* Zone 1: Wordmark */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => setCurrentScreen('home')}
          className="text-lg font-bold tracking-tight text-slate-900 hover:text-blue-600 transition-colors flex items-center gap-2"
        >
          <span className="w-7 h-7 rounded bg-blue-700 text-white flex items-center justify-center font-mono text-sm font-bold shadow-sm">
            S
          </span>
          <span>SOPStudio</span>
        </button>

        {currentScreen === 'workspace' && (
          <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-slate-200 text-xs">
            <span className="font-mono text-slate-500">{doc.metadata.sopNumber}</span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-700 font-medium max-w-[200px] truncate" title={doc.metadata.title}>
              {doc.metadata.title}
            </span>
            {isDirty ? (
              <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded font-mono font-medium">
                Unsaved changes
              </span>
            ) : lastSavedAt ? (
              <span className="text-[10px] text-emerald-600 font-mono">
                Saved {lastSavedAt}
              </span>
            ) : null}
          </div>
        )}
      </div>

      {/* Zone 2: Navigation / View Mode Tabs */}
      <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium">
        <button
          type="button"
          onClick={() => setCurrentScreen('home')}
          className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
            currentScreen === 'home'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setCurrentScreen('workspace');
            setViewMode('editor');
          }}
          className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
            currentScreen === 'workspace' && viewMode === 'editor'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Editor</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setCurrentScreen('workspace');
            setViewMode('preview');
          }}
          className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
            currentScreen === 'workspace' && viewMode === 'preview'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Preview</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setCurrentScreen('workspace');
            setViewMode('split');
          }}
          className={`hidden md:flex px-3 py-1.5 rounded-md transition-colors items-center gap-1.5 ${
            currentScreen === 'workspace' && viewMode === 'split'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Columns className="w-3.5 h-3.5" />
          <span>Split</span>
        </button>
      </nav>

      {/* Zone 3: Primary Actions */}
      <div className="flex items-center gap-2">
        {/* Undo / Redo */}
        <div className="hidden sm:flex items-center pr-2 border-r border-slate-200">
          <button
            type="button"
            onClick={undo}
            disabled={!canUndo}
            className="p-1.5 rounded text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-600"
            title="Undo (Ctrl+Z)"
            aria-label="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={redo}
            disabled={!canRedo}
            className="p-1.5 rounded text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-600"
            title="Redo (Ctrl+Y)"
            aria-label="Redo"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* Template Style Selector Dropdown */}
        <div className="relative" ref={styleMenuRef}>
          <button
            type="button"
            onClick={() => setStyleDropdownOpen(!styleDropdownOpen)}
            className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-1.5"
            title="Change Visual Template Style"
          >
            <Palette className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">{doc.style.name}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {styleDropdownOpen && (
            <div className="absolute right-0 mt-1 w-64 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono border-b border-slate-100">
                Visual Document Styles
              </div>
              {TEMPLATE_STYLE_LIST.map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => {
                    setTemplateStyle(tmpl.id);
                    setStyleDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-start justify-between ${
                    doc.style.id === tmpl.id ? 'bg-blue-50 text-blue-900 font-semibold' : 'text-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-medium">{tmpl.name}</div>
                    <div className="text-[11px] text-slate-500 font-normal leading-tight mt-0.5">{tmpl.tagline}</div>
                  </div>
                  {doc.style.id === tmpl.id && <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Save Button */}
        <button
          type="button"
          onClick={handleManualSave}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
            isDirty
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
          title="Save Document to Local Storage"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{saveSuccessMessage || 'Save'}</span>
        </button>

        {/* Export / Print Dropdown */}
        <div className="relative" ref={exportMenuRef}>
          <button
            type="button"
            onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Export</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {exportDropdownOpen && (
            <div className="absolute right-0 mt-1 w-64 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50 text-xs">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono border-b border-slate-100">
                Document Exporters
              </div>
              <button
                type="button"
                onClick={handlePrint}
                className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
              >
                <Printer className="w-4 h-4 text-blue-600" />
                <div>
                  <div className="font-medium">Print to PDF / Paper</div>
                  <div className="text-[11px] text-slate-400">Uses browser print layout configured for A4</div>
                </div>
              </button>
              <button
                type="button"
                onClick={handleExportJSON}
                className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 border-t border-slate-100"
              >
                <FileCode className="w-4 h-4 text-emerald-600" />
                <div>
                  <div className="font-medium">Export Structured JSON (.sop.json)</div>
                  <div className="text-[11px] text-slate-400">Complete canonical document file</div>
                </div>
              </button>
              <div className="px-3 py-2 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400">
                <span className="font-semibold text-slate-500">Upcoming in M1 / M2:</span> Word (.docx) and Standalone Vector PDF exporters.
              </div>
            </div>
          )}
        </div>

        {/* New SOP Button */}
        <button
          type="button"
          onClick={startNewDocumentFlow}
          className="px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New SOP</span>
        </button>
      </div>
    </header>
  );
};
