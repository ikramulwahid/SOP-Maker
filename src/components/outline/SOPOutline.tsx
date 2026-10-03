import React, { useState } from 'react';
import { 
  ChevronRight, ChevronDown, CheckCircle2, 
  Search, ShieldAlert, FileText, Settings, Award, 
  AlertTriangle, Wrench, Layers
} from 'lucide-react';
import { useSOP } from '../../state/documentContext';
import { SOPSection, SectionCategory } from '../../types/document';

export const SOPOutline: React.FC = () => {
  const { document: doc, activeSectionId, selectSection, toggleSectionCollapse } = useSOP();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSections = doc.sections.filter(sec => 
    sec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sec.number.includes(searchQuery)
  );

  const getCategoryIcon = (category?: SectionCategory) => {
    switch (category) {
      case 'safety':
        return <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />;
      case 'procedural':
        return <Wrench className="w-3.5 h-3.5 text-blue-600 shrink-0" />;
      case 'quality':
        return <Award className="w-3.5 h-3.5 text-emerald-600 shrink-0" />;
      case 'governance':
        return <Layers className="w-3.5 h-3.5 text-purple-600 shrink-0" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
    }
  };

  return (
    <aside className="w-full h-full flex flex-col bg-slate-50 border-r border-slate-200 select-none">
      {/* Outline Header */}
      <div className="p-3 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-800 tracking-wider uppercase font-mono">
            Document Outline
          </span>
          <span className="text-xs text-slate-500 font-mono tabular-nums">
            {doc.sections.length} Sections
          </span>
        </div>

        {/* Quick Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter sections..."
            className="w-full pl-8 pr-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Sections List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {filteredSections.length === 0 ? (
          <div className="p-4 text-center text-xs text-slate-400">
            No sections matching "{searchQuery}"
          </div>
        ) : (
          filteredSections.map((sec) => {
            const isActive = sec.id === activeSectionId;
            const hasChildren = Boolean(sec.children && sec.children.length > 0);

            return (
              <div
                key={sec.id}
                className={`group flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white font-medium shadow-sm'
                    : 'text-slate-700 hover:bg-slate-200/60'
                }`}
                onClick={() => selectSection(sec.id)}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {hasChildren ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSectionCollapse(sec.id);
                      }}
                      className={`p-0.5 rounded hover:bg-black/10 ${isActive ? 'text-white' : 'text-slate-400'}`}
                      aria-label="Toggle section"
                    >
                      {sec.collapsed ? (
                        <ChevronRight className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                    </button>
                  ) : (
                    <span className="w-3" />
                  )}

                  <span className={`font-mono text-[11px] shrink-0 ${isActive ? 'text-blue-100 font-semibold' : 'text-slate-500'}`}>
                    {sec.number}
                  </span>

                  <span className="truncate">
                    {sec.title}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-1">
                  {!isActive && getCategoryIcon(sec.category)}
                  {sec.isMandatory && (
                    <span 
                      title="Mandatory ISO/GLP Section" 
                      className={`text-[9px] px-1 rounded font-mono ${
                        isActive ? 'bg-blue-500/80 text-blue-100' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      REQ
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Outline Footer Information */}
      <div className="p-3 border-t border-slate-200 bg-white/80 text-[11px] text-slate-500">
        <div className="flex items-center justify-between text-slate-600">
          <span>Active Selection:</span>
          <span className="font-mono font-medium text-slate-800">
            {doc.sections.find(s => s.id === activeSectionId)?.number || '—'}
          </span>
        </div>
      </div>
    </aside>
  );
};
