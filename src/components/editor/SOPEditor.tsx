import React, { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { 
  Bold, Italic, Underline as UnderlineIcon, 
  Heading1, Heading2, Heading3, 
  List, ListOrdered, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  CheckCircle2, FileText,
  Table as TableIcon, Plus, Minus, Merge, Split, Trash2, ChevronDown
} from 'lucide-react';
import { useSOP } from '../../state/documentContext';
import { findSection } from '../../operations/sectionOperations';
import { createEmptyContent } from '../../models/content';
import { sharedEditorExtensions } from '../../editor/extensions';

export const SOPEditor: React.FC = () => {
  const { document: doc, activeSectionId, updateSectionContent, updateSectionTitle } = useSOP();

  const activeSection = findSection(doc.sections, activeSectionId) || doc.sections[0];
  const activeSectionIdRef = useRef(activeSection?.id);
  activeSectionIdRef.current = activeSection?.id;

  // Table insert menu state
  const [showTableMenu, setShowTableMenu] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [tableWithHeader, setTableWithHeader] = useState(true);
  const tableMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (tableMenuRef.current && !tableMenuRef.current.contains(e.target as Node)) {
        setShowTableMenu(false);
      }
    };
    if (showTableMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTableMenu]);

  const editor = useEditor({
    extensions: sharedEditorExtensions,
    content: activeSection ? activeSection.content : createEmptyContent(),
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none focus:outline-none min-h-[380px] p-6 text-slate-800 leading-relaxed font-sans'
      }
    },
    onUpdate: ({ editor }) => {
      const currentId = activeSectionIdRef.current;
      if (currentId) {
        const json = editor.getJSON();
        updateSectionContent(currentId, json);
      }
    }
  });

  // When active section changes, update editor with the new section's structured content
  useEffect(() => {
    if (editor && activeSection) {
      editor.commands.setContent(activeSection.content || createEmptyContent(), { emitUpdate: false });
    }
  }, [activeSection?.id, editor]);

  const handleInsertTable = (rows: number, cols: number, withHeader: boolean) => {
    if (!editor) return;
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: withHeader }).run();
    setShowTableMenu(false);
  };

  if (!activeSection) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 text-slate-400">
        <div className="text-center">
          <FileText className="w-12 h-12 mx-auto mb-3 stroke-1 text-slate-300" />
          <p className="text-sm font-medium">Select a section from the outline to begin editing</p>
        </div>
      </div>
    );
  }

  const isTableActive = editor?.isActive('table');

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      {/* Section Header & Title Editing */}
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-[240px]">
          <span className="font-mono text-xs font-semibold px-2.5 py-1 bg-white border border-slate-200 rounded text-slate-700">
            {activeSection.number}
          </span>
          <input
            type="text"
            value={activeSection.title}
            onChange={(e) => updateSectionTitle(activeSection.id, e.target.value)}
            className="text-base font-semibold text-slate-900 bg-transparent hover:bg-white focus:bg-white focus:ring-1 focus:ring-blue-500 rounded px-2 py-1 flex-1 transition-colors border border-transparent hover:border-slate-200 focus:border-blue-500"
            placeholder="Section Title"
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          {activeSection.isMandatory ? (
            <span className="flex items-center gap-1 text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> Mandatory Section
            </span>
          ) : (
            <span className="text-slate-400">Optional Section</span>
          )}
          {activeSection.category && (
            <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded uppercase tracking-wider text-[10px] font-mono">
              {activeSection.category}
            </span>
          )}
        </div>
      </div>

      {/* Rich Text Toolbar */}
      {editor && (
        <div className="px-4 py-2 border-b border-slate-200 bg-white flex flex-wrap items-center gap-1 text-slate-700">
          {/* Headings */}
          <div className="flex items-center gap-0.5 pr-2 border-r border-slate-200">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`p-1.5 rounded hover:bg-slate-100 transition-colors ${
                editor.isActive('heading', { level: 1 }) ? 'bg-slate-200 text-blue-700 font-semibold' : ''
              }`}
              title="Heading 1"
              aria-label="Heading 1"
            >
              <Heading1 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`p-1.5 rounded hover:bg-slate-100 transition-colors ${
                editor.isActive('heading', { level: 2 }) ? 'bg-slate-200 text-blue-700 font-semibold' : ''
              }`}
              title="Heading 2"
              aria-label="Heading 2"
            >
              <Heading2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={`p-1.5 rounded hover:bg-slate-100 transition-colors ${
                editor.isActive('heading', { level: 3 }) ? 'bg-slate-200 text-blue-700 font-semibold' : ''
              }`}
              title="Heading 3"
              aria-label="Heading 3"
            >
              <Heading3 className="w-4 h-4" />
            </button>
          </div>

          {/* Formatting */}
          <div className="flex items-center gap-0.5 px-2 border-r border-slate-200">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-1.5 rounded hover:bg-slate-100 transition-colors ${
                editor.isActive('bold') ? 'bg-slate-200 text-blue-700 font-bold' : ''
              }`}
              title="Bold (Ctrl+B)"
              aria-label="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-1.5 rounded hover:bg-slate-100 transition-colors ${
                editor.isActive('italic') ? 'bg-slate-200 text-blue-700' : ''
              }`}
              title="Italic (Ctrl+I)"
              aria-label="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`p-1.5 rounded hover:bg-slate-100 transition-colors ${
                editor.isActive('underline') ? 'bg-slate-200 text-blue-700' : ''
              }`}
              title="Underline (Ctrl+U)"
              aria-label="Underline"
            >
              <UnderlineIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Lists */}
          <div className="flex items-center gap-0.5 px-2 border-r border-slate-200">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-1.5 rounded hover:bg-slate-100 transition-colors ${
                editor.isActive('bulletList') ? 'bg-slate-200 text-blue-700' : ''
              }`}
              title="Bullet List"
              aria-label="Bullet List"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-1.5 rounded hover:bg-slate-100 transition-colors ${
                editor.isActive('orderedList') ? 'bg-slate-200 text-blue-700' : ''
              }`}
              title="Numbered List"
              aria-label="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
          </div>

          {/* Text Alignment */}
          <div className="flex items-center gap-0.5 px-2 border-r border-slate-200">
            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={`p-1.5 rounded hover:bg-slate-100 transition-colors ${
                editor.isActive({ textAlign: 'left' }) ? 'bg-slate-200 text-blue-700' : ''
              }`}
              title="Align Left"
              aria-label="Align Left"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              className={`p-1.5 rounded hover:bg-slate-100 transition-colors ${
                editor.isActive({ textAlign: 'center' }) ? 'bg-slate-200 text-blue-700' : ''
              }`}
              title="Align Center"
              aria-label="Align Center"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className={`p-1.5 rounded hover:bg-slate-100 transition-colors ${
                editor.isActive({ textAlign: 'right' }) ? 'bg-slate-200 text-blue-700' : ''
              }`}
              title="Align Right"
              aria-label="Align Right"
            >
              <AlignRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign('justify').run()}
              className={`p-1.5 rounded hover:bg-slate-100 transition-colors ${
                editor.isActive({ textAlign: 'justify' }) ? 'bg-slate-200 text-blue-700' : ''
              }`}
              title="Justify"
              aria-label="Justify"
            >
              <AlignJustify className="w-4 h-4" />
            </button>
          </div>

          {/* Structured Table Insertion */}
          <div className="relative pl-1" ref={tableMenuRef}>
            <button
              type="button"
              onClick={() => setShowTableMenu(prev => !prev)}
              className={`px-2 py-1.5 rounded hover:bg-slate-100 transition-colors flex items-center gap-1.5 text-xs ${
                isTableActive ? 'bg-blue-100 text-blue-800 font-medium' : 'text-slate-700'
              }`}
              title="Insert or Configure Table"
              aria-label="Table Options"
            >
              <TableIcon className="w-4 h-4 text-blue-600" />
              <span>Table</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showTableMenu && (
              <div className="absolute left-0 mt-1 w-64 bg-white border border-slate-200 rounded-lg shadow-xl p-3 z-50 text-xs">
                <div className="font-semibold text-slate-800 mb-2 flex items-center justify-between">
                  <span>Insert Structured Table</span>
                  <span className="text-[10px] text-slate-400 font-mono">M1.1</span>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between">
                    <label className="text-slate-600">Rows</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={tableRows}
                      onChange={(e) => setTableRows(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 px-2 py-1 border border-slate-300 rounded text-right font-mono text-xs focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-slate-600">Columns</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={tableCols}
                      onChange={(e) => setTableCols(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 px-2 py-1 border border-slate-300 rounded text-right font-mono text-xs focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <label className="flex items-center gap-2 text-slate-700 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={tableWithHeader}
                      onChange={(e) => setTableWithHeader(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Include Header Row</span>
                  </label>
                </div>

                <div className="grid grid-cols-3 gap-1 mb-3 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleInsertTable(2, 2, true)}
                    className="px-2 py-1 text-[11px] bg-slate-50 hover:bg-slate-100 rounded text-slate-700 text-center font-mono border border-slate-200"
                  >
                    2×2
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInsertTable(3, 3, true)}
                    className="px-2 py-1 text-[11px] bg-slate-50 hover:bg-slate-100 rounded text-slate-700 text-center font-mono border border-slate-200"
                  >
                    3×3
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInsertTable(4, 3, true)}
                    className="px-2 py-1 text-[11px] bg-slate-50 hover:bg-slate-100 rounded text-slate-700 text-center font-mono border border-slate-200"
                  >
                    4×3
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleInsertTable(tableRows, tableCols, tableWithHeader)}
                  className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition-colors text-center text-xs shadow-xs"
                >
                  Insert Table ({tableRows}×{tableCols})
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Contextual Table Editing Toolbar (Appears when cursor is inside any table) */}
      {editor && isTableActive && (
        <div className="px-4 py-1.5 bg-blue-50/70 border-b border-blue-200/80 flex flex-wrap items-center gap-2 text-xs text-slate-700">
          <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-blue-900 pr-2 border-r border-blue-200">
            <TableIcon className="w-3.5 h-3.5 text-blue-600" />
            <span>Table Controls</span>
          </div>

          {/* Row Controls */}
          <div className="flex items-center gap-1 pr-2 border-r border-blue-200">
            <span className="text-[10px] text-slate-400 font-mono uppercase">Row:</span>
            <button
              type="button"
              onClick={() => editor.chain().focus().addRowBefore().run()}
              className="px-2 py-0.5 rounded bg-white hover:bg-blue-100 border border-slate-200 text-slate-700 text-[11px] flex items-center gap-1 shadow-xs"
              title="Add Row Above"
              aria-label="Add Row Above"
            >
              <Plus className="w-3 h-3 text-emerald-600" /> Above
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().addRowAfter().run()}
              className="px-2 py-0.5 rounded bg-white hover:bg-blue-100 border border-slate-200 text-slate-700 text-[11px] flex items-center gap-1 shadow-xs"
              title="Add Row Below"
              aria-label="Add Row Below"
            >
              <Plus className="w-3 h-3 text-emerald-600" /> Below
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().deleteRow().run()}
              className="px-2 py-0.5 rounded bg-white hover:bg-rose-50 border border-slate-200 text-rose-700 text-[11px] flex items-center gap-1 shadow-xs"
              title="Delete Current Row"
              aria-label="Delete Current Row"
            >
              <Minus className="w-3 h-3" /> Del Row
            </button>
          </div>

          {/* Column Controls */}
          <div className="flex items-center gap-1 pr-2 border-r border-blue-200">
            <span className="text-[10px] text-slate-400 font-mono uppercase">Col:</span>
            <button
              type="button"
              onClick={() => editor.chain().focus().addColumnBefore().run()}
              className="px-2 py-0.5 rounded bg-white hover:bg-blue-100 border border-slate-200 text-slate-700 text-[11px] flex items-center gap-1 shadow-xs"
              title="Add Column to Left"
              aria-label="Add Column to Left"
            >
              <Plus className="w-3 h-3 text-emerald-600" /> Left
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              className="px-2 py-0.5 rounded bg-white hover:bg-blue-100 border border-slate-200 text-slate-700 text-[11px] flex items-center gap-1 shadow-xs"
              title="Add Column to Right"
              aria-label="Add Column to Right"
            >
              <Plus className="w-3 h-3 text-emerald-600" /> Right
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().deleteColumn().run()}
              className="px-2 py-0.5 rounded bg-white hover:bg-rose-50 border border-slate-200 text-rose-700 text-[11px] flex items-center gap-1 shadow-xs"
              title="Delete Current Column"
              aria-label="Delete Current Column"
            >
              <Minus className="w-3 h-3" /> Del Col
            </button>
          </div>

          {/* Cell & Header Operations */}
          <div className="flex items-center gap-1 pr-2 border-r border-blue-200">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeaderRow().run()}
              className="px-2 py-0.5 rounded bg-white hover:bg-blue-100 border border-slate-200 text-slate-700 text-[11px] font-medium shadow-xs"
              title="Toggle Header Row"
              aria-label="Toggle Header Row"
            >
              Header Row
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().mergeCells().run()}
              disabled={!editor.can().mergeCells()}
              className="px-2 py-0.5 rounded bg-white hover:bg-blue-100 border border-slate-200 text-slate-700 disabled:opacity-40 disabled:pointer-events-none text-[11px] flex items-center gap-1 shadow-xs"
              title="Merge Selected Cells"
              aria-label="Merge Selected Cells"
            >
              <Merge className="w-3 h-3" /> Merge
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().splitCell().run()}
              disabled={!editor.can().splitCell()}
              className="px-2 py-0.5 rounded bg-white hover:bg-blue-100 border border-slate-200 text-slate-700 disabled:opacity-40 disabled:pointer-events-none text-[11px] flex items-center gap-1 shadow-xs"
              title="Split Merged Cell"
              aria-label="Split Merged Cell"
            >
              <Split className="w-3 h-3" /> Split
            </button>
          </div>

          {/* Delete Entire Table */}
          <button
            type="button"
            onClick={() => editor.chain().focus().deleteTable().run()}
            className="ml-auto px-2 py-0.5 rounded bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-[11px] font-medium flex items-center gap-1 transition-colors"
            title="Delete Entire Table"
            aria-label="Delete Entire Table"
          >
            <Trash2 className="w-3 h-3 text-rose-600" />
            <span>Delete Table</span>
          </button>
        </div>
      )}

      {/* Editor Body Area */}
      <div className={`flex-1 overflow-y-auto bg-white table-theme-${doc.style.tableStyle || 'bordered'}`}>
        <EditorContent editor={editor} />
      </div>

      {/* Section Footer Metadata Info */}
      <div className="px-6 py-2.5 border-t border-slate-200 bg-slate-50 text-xs text-slate-500 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>Editing Section {activeSection.number}</span>
          <span>·</span>
          <span>SOP ID: {doc.metadata.sopNumber}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Structured JSON Content (Tables Supported)</span>
        </div>
      </div>
    </div>
  );
};
