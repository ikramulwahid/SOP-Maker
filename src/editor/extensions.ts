import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';

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
  })
];

export default sharedEditorExtensions;
