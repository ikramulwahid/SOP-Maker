import { DocumentSummary, SOPDocument } from '../types/document';
import { DocumentStorage } from './types';
import { SAMPLE_LAB_SOP } from '../data/sampleSop';

const STORAGE_PREFIX = 'sopstudio_doc_';
const RECENT_LIST_KEY = 'sopstudio_recent_documents';

export class LocalStorageDocumentAdapter implements DocumentStorage {
  async save(document: SOPDocument): Promise<void> {
    try {
      const updatedDoc = {
        ...document,
        updatedAt: new Date().toISOString()
      };
      const serialized = JSON.stringify(updatedDoc);
      localStorage.setItem(`${STORAGE_PREFIX}${document.id}`, serialized);

      // Update recent documents registry
      const recents = await this.listRecent();
      const summary: DocumentSummary = {
        id: updatedDoc.id,
        title: updatedDoc.metadata.title,
        sopNumber: updatedDoc.metadata.sopNumber,
        version: updatedDoc.metadata.version,
        department: updatedDoc.metadata.department,
        status: updatedDoc.metadata.status,
        updatedAt: updatedDoc.updatedAt,
        templateId: updatedDoc.style.id
      };

      const filtered = recents.filter(item => item.id !== document.id);
      const updatedRecents = [summary, ...filtered].slice(0, 10);
      localStorage.setItem(RECENT_LIST_KEY, JSON.stringify(updatedRecents));
    } catch (e) {
      console.warn('LocalStorage save warning:', e);
    }
  }

  async get(id: string): Promise<SOPDocument | null> {
    try {
      // If sample SOP is requested and not in storage, seed it
      if (id === SAMPLE_LAB_SOP.id) {
        const stored = localStorage.getItem(`${STORAGE_PREFIX}${id}`);
        if (!stored) {
          await this.save(SAMPLE_LAB_SOP);
          return SAMPLE_LAB_SOP;
        }
        return JSON.parse(stored) as SOPDocument;
      }

      const stored = localStorage.getItem(`${STORAGE_PREFIX}${id}`);
      if (!stored) return null;
      return JSON.parse(stored) as SOPDocument;
    } catch (e) {
      console.error('Failed to read SOP from localStorage:', e);
      return null;
    }
  }

  async listRecent(): Promise<DocumentSummary[]> {
    try {
      const stored = localStorage.getItem(RECENT_LIST_KEY);
      if (!stored) {
        // Seed with sample document summary if empty
        const sampleSummary: DocumentSummary = {
          id: SAMPLE_LAB_SOP.id,
          title: SAMPLE_LAB_SOP.metadata.title,
          sopNumber: SAMPLE_LAB_SOP.metadata.sopNumber,
          version: SAMPLE_LAB_SOP.metadata.version,
          department: SAMPLE_LAB_SOP.metadata.department,
          status: SAMPLE_LAB_SOP.metadata.status,
          updatedAt: SAMPLE_LAB_SOP.updatedAt,
          templateId: SAMPLE_LAB_SOP.style.id
        };
        localStorage.setItem(RECENT_LIST_KEY, JSON.stringify([sampleSummary]));
        return [sampleSummary];
      }
      return JSON.parse(stored) as DocumentSummary[];
    } catch (e) {
      console.error('Failed to list recent SOPs:', e);
      return [];
    }
  }

  async delete(id: string): Promise<void> {
    try {
      localStorage.removeItem(`${STORAGE_PREFIX}${id}`);
      const recents = await this.listRecent();
      const updated = recents.filter(r => r.id !== id);
      localStorage.setItem(RECENT_LIST_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to delete SOP:', e);
    }
  }

  exportToJSONString(document: SOPDocument): string {
    return JSON.stringify(document, null, 2);
  }

  importFromJSONString(json: string): SOPDocument {
    const parsed = JSON.parse(json);
    if (!parsed || !parsed.metadata || !parsed.sections) {
      throw new Error('Invalid SOP document structure: missing metadata or sections array');
    }
    return parsed as SOPDocument;
  }
}

export const documentStorage = new LocalStorageDocumentAdapter();
