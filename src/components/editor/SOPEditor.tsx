import React, { useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { 
  Bold, Italic, Underline as UnderlineIcon, 
  Heading1, Heading2, Heading3, 
  List, ListOrdered, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  CheckCircle2, FileText
} from 'lucide-react';
import { useSOP } from '../../state/documentContext';
import { findSection } from '../../operations/sectionOperations';
import { createEmptyContent } from '../../models/content';

export const SOPEditor: React.FC = () => {
  const { document: doc, activeSectionId, updateSectionContent, updateSectionTitle } = useSOP();

  const activeSection = findSection(doc.sections, activeSectionId) || doc.sections[0];
  const activeSectionIdRef = useRef(activeSection?.id);
  activeSectionIdRef.current = activeSection?.id;

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        }
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      })
    ],
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
          <div className="flex items-center gap-0.5 pl-2">
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
        </div>
      )}

      {/* Editor Body Area */}
      <div className="flex-1 overflow-y-auto bg-white">
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
          <span>Structured JSON Content</span>
        </div>
      </div>
    </div>
  );
};
