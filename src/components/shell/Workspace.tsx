import React, { useState } from 'react';
import { useSOP } from '../../state/documentContext';
import { SOPOutline } from '../outline/SOPOutline';
import { SOPEditor } from '../editor/SOPEditor';
import { SOPPreview } from '../preview/SOPPreview';
import { MetadataPanel } from '../metadata/MetadataPanel';
import { 
  PanelLeftClose, PanelLeftOpen, 
  PanelRightClose, PanelRightOpen, 
  ZoomIn, ZoomOut, RotateCcw, 
  Eye, Edit3, Columns, CheckCircle2 
} from 'lucide-react';

export const Workspace: React.FC = () => {
  const { viewMode, setViewMode, zoom, setZoom, document: doc } = useSOP();

  const [showOutline, setShowOutline] = useState(true);
  const [showProperties, setShowProperties] = useState(true);

  const handleZoomIn = () => setZoom(Math.min(150, zoom + 15));
  const handleZoomOut = () => setZoom(Math.max(60, zoom - 15));
  const handleResetZoom = () => setZoom(100);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-100">
      {/* Workspace Secondary Control Strip */}
      <div className="h-9 bg-white border-b border-slate-200 px-4 flex items-center justify-between text-xs text-slate-600 shrink-0">
        <div className="flex items-center gap-2">
          {/* Outline toggle */}
          <button
            type="button"
            onClick={() => setShowOutline(!showOutline)}
            className={`p-1 rounded hover:bg-slate-100 flex items-center gap-1.5 transition-colors ${
              showOutline ? 'text-blue-700 font-semibold' : 'text-slate-400'
            }`}
            title="Toggle Outline Panel"
          >
            {showOutline ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
            <span className="hidden sm:inline">Outline</span>
          </button>

          <span className="text-slate-300">|</span>

          {/* Quick Active Section indicator */}
          <span className="text-slate-500 font-mono text-[11px] truncate max-w-[280px]">
            {doc.metadata.sopNumber} · v{doc.metadata.version}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Zoom controls (useful for Preview and Split modes) */}
          {(viewMode === 'preview' || viewMode === 'split') && (
            <div className="flex items-center gap-1 border-r border-slate-200 pr-3">
              <button
                type="button"
                onClick={handleZoomOut}
                className="p-1 rounded hover:bg-slate-100 text-slate-500"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px] w-9 text-center tabular-nums text-slate-600">
                {zoom}%
              </span>
              <button
                type="button"
                onClick={handleZoomIn}
                className="p-1 rounded hover:bg-slate-100 text-slate-500"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleResetZoom}
                className="p-1 rounded hover:bg-slate-100 text-slate-400"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Properties Toggle */}
          <button
            type="button"
            onClick={() => setShowProperties(!showProperties)}
            className={`p-1 rounded hover:bg-slate-100 flex items-center gap-1.5 transition-colors ${
              showProperties ? 'text-blue-700 font-semibold' : 'text-slate-400'
            }`}
            title="Toggle Properties Panel"
          >
            <span className="hidden sm:inline">Properties</span>
            {showProperties ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main 3-Pane Container */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Pane: Outline (280px fixed width on desktop) */}
        {showOutline && (
          <div className="w-72 shrink-0 h-full overflow-hidden transition-all duration-150 z-10 border-r border-slate-200">
            <SOPOutline />
          </div>
        )}

        {/* Center Pane: Editor / Preview */}
        <main className="flex-1 h-full overflow-hidden flex flex-col p-3 md:p-4 bg-slate-100/80">
          {viewMode === 'editor' && (
            <div className="flex-1 h-full overflow-hidden">
              <SOPEditor />
            </div>
          )}

          {viewMode === 'preview' && (
            <div className="flex-1 h-full overflow-y-auto">
              <div 
                className="transition-transform origin-top flex justify-center"
                style={{ transform: `scale(${zoom / 100})` }}
              >
                <SOPPreview />
              </div>
            </div>
          )}

          {viewMode === 'split' && (
            <div className="flex-1 h-full grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-hidden">
              <div className="h-full overflow-hidden">
                <SOPEditor />
              </div>
              <div className="h-full overflow-y-auto border border-slate-200 rounded-lg bg-slate-200/50 p-2">
                <div 
                  className="transition-transform origin-top flex justify-center"
                  style={{ transform: `scale(${Math.min(zoom, 95) / 100})` }}
                >
                  <SOPPreview />
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Right Pane: Properties / Metadata (320px fixed width on desktop) */}
        {showProperties && (
          <div className="w-80 shrink-0 h-full overflow-hidden transition-all duration-150 z-10 border-l border-slate-200">
            <MetadataPanel />
          </div>
        )}
      </div>
    </div>
  );
};
