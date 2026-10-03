import { SOPDocument } from '../types/document';
import { DocumentImporter } from './types';

export class JSONImporter implements DocumentImporter {
  readonly formatId = 'json';
  readonly formatName = 'SOPStudio Structured JSON';
  readonly acceptedExtensions = ['.json', '.sop.json'];
  readonly isSupported = true;

  async importDocument(file: File): Promise<SOPDocument> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsed = JSON.parse(content);
          if (!parsed || !parsed.metadata || !Array.isArray(parsed.sections)) {
            throw new Error('File does not match the SOPStudio Document schema: missing metadata or sections.');
          }
          resolve(parsed as SOPDocument);
        } catch (err: any) {
          reject(new Error(`Failed to parse SOP JSON: ${err.message || err}`));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read the selected file.'));
      reader.readAsText(file);
    });
  }
}

export class DOCXImporter implements DocumentImporter {
  readonly formatId = 'docx';
  readonly formatName = 'Word Document (.docx)';
  readonly acceptedExtensions = ['.docx'];
  readonly isSupported = false;
  readonly unsupportedReason = 'DOCX document parsing is scheduled for Work Package M2.';

  async importDocument(_file: File): Promise<SOPDocument> {
    throw new Error(this.unsupportedReason);
  }
}

export const importers: Record<string, DocumentImporter> = {
  json: new JSONImporter(),
  docx: new DOCXImporter()
};
