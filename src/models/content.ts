import { JSONContent } from '../types/document';
import { generateHTML } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';

const extensions = [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3]
    }
  }),
  TextAlign.configure({
    types: ['heading', 'paragraph']
  })
];

/**
 * Creates an empty canonical ProseMirror document representation.
 */
export function createEmptyContent(): JSONContent {
  return {
    type: 'doc',
    content: [
      {
        type: 'paragraph'
      }
    ]
  };
}

/**
 * Creates structured ProseMirror JSONContent from one or more lines of plain text.
 */
export function createContentFromParagraphs(...paragraphs: string[]): JSONContent {
  if (paragraphs.length === 0) {
    return createEmptyContent();
  }

  return {
    type: 'doc',
    content: paragraphs.map(p => ({
      type: 'paragraph',
      content: p.length > 0 ? [{ type: 'text', text: p }] : []
    }))
  };
}

/**
 * Derives an HTML representation from the canonical structured JSONContent.
 * HTML is strictly a rendering/export artifact, never the primary document storage.
 */
export function contentToHTML(content: JSONContent | undefined | null): string {
  if (!content || !content.type) {
    return '';
  }

  try {
    return generateHTML(content, extensions);
  } catch (err) {
    console.warn('Failed to generate HTML from JSONContent, using fallback:', err);
    // Fallback text extraction if schema mismatch
    const text = extractPlainText(content);
    return text ? `<p>${text}</p>` : '';
  }
}

/**
 * Recursively extracts plain text from a structured JSONContent node tree.
 * Used for validation length checks, search indexing, and diagnostics.
 */
export function extractPlainText(node: JSONContent | undefined | null): string {
  if (!node) return '';

  if (node.text) {
    return node.text;
  }

  if (Array.isArray(node.content)) {
    return node.content.map(extractPlainText).join(' ').trim();
  }

  return '';
}
