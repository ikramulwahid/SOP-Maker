import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';

/**
 * Authoritative shared Tiptap extension configuration.
 * Consistently used by:
 * 1. The Tiptap rich-text editor (SOPEditor.tsx)
 * 2. The canonical JSONContent -> HTML derivation layer (contentToHTML in content.ts)
 * 3. Future document renderers and exporters (DOCX/PDF in M1/M2)
 *
 * In @tiptap/starter-kit v3, Underline, Bold, Italic, Strike, Headings,
 * Lists, and Paragraphs are included natively.
 * TextAlign is added for text alignment controls.
 */
export const sharedEditorExtensions = [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3]
    }
  }),
  TextAlign.configure({
    types: ['heading', 'paragraph']
  })
];

export default sharedEditorExtensions;
