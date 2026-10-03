import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';

/**
 * Authoritative shared Tiptap extension configuration.
 * Consistently used by:
 * 1. The Tiptap rich-text editor (SOPEditor.tsx)
 * 2. The canonical JSONContent -> HTML derivation layer (contentToHTML in content.ts)
 * 3. Future document renderers and exporters (DOCX/PDF in M1/M2)
 *
 * Explicitly configures:
 * - StarterKit (with headings 1-3, bold, italic, lists, paragraphs)
 * - Underline from @tiptap/extension-underline
 * - TextAlign from @tiptap/extension-text-align
 * - Table from @tiptap/extension-table (resizable, structured AST node)
 * - TableRow from @tiptap/extension-table-row
 * - TableHeader from @tiptap/extension-table-header
 * - TableCell from @tiptap/extension-table-cell
 */
export const sharedEditorExtensions = [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3]
    },
    // Explicitly configure Underline via @tiptap/extension-underline
    underline: false
  }),
  Underline,
  TextAlign.configure({
    types: ['heading', 'paragraph']
  }),
  Table.configure({
    resizable: true,
    HTMLAttributes: {
      class: 'sop-table'
    }
  }),
  TableRow,
  TableHeader,
  TableCell
];

export default sharedEditorExtensions;
