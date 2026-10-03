import { SOPDocument } from '../types/document';
import { DocumentExporter, ExportOptions } from './types';

/**
 * Native JSON Exporter - fully implemented in M0.
 * Downloads the full structured SOP document as an interchangeable JSON file.
 */
export class JSONExporter implements DocumentExporter {
  readonly formatId = 'json';
  readonly formatName = 'SOPStudio Structured JSON';
  readonly fileExtension = '.sop.json';
  readonly isSupported = true;

  async exportDocument(doc: SOPDocument, _options?: ExportOptions): Promise<void> {
    const jsonStr = JSON.stringify(doc, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const filename = `${doc.metadata.sopNumber || 'SOP'}_v${doc.metadata.version || '1.0'}.sop.json`
      .replace(/[^a-zA-Z0-9._-]/g, '_');

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * Browser Print Exporter - prototype implemented in M0.
 * Leverages the browser print subsystem formatted for A4 continuous document layout.
 * Dedicated pagination and PDF rendering engine are scheduled for M2.
 */
export class PrintExporter implements DocumentExporter {
  readonly formatId = 'print';
  readonly formatName = 'Browser Print / PDF Prototype';
  readonly fileExtension = '.pdf';
  readonly isSupported = true;

  async exportDocument(_doc: SOPDocument, _options?: ExportOptions): Promise<void> {
    window.print();
  }
}

/**
 * Native DOCX Exporter - interface defined for M1 work package.
 */
export class DOCXExporter implements DocumentExporter {
  readonly formatId = 'docx';
  readonly formatName = 'Microsoft Word (.docx)';
  readonly fileExtension = '.docx';
  readonly isSupported = false;
  readonly unsupportedReason = 'Scheduled for Work Package M1 (docx templating engine integration)';

  async exportDocument(_doc: SOPDocument, _options?: ExportOptions): Promise<void> {
    throw new Error(this.unsupportedReason);
  }
}

/**
 * Standalone Vector PDF Exporter - interface defined for M2 work package.
 */
export class VectorPDFExporter implements DocumentExporter {
  readonly formatId = 'pdf-vector';
  readonly formatName = 'Standalone Vector PDF';
  readonly fileExtension = '.pdf';
  readonly isSupported = false;
  readonly unsupportedReason = 'Scheduled for Work Package M2 (client-side PDF canvas rendering)';

  async exportDocument(_doc: SOPDocument, _options?: ExportOptions): Promise<void> {
    throw new Error(this.unsupportedReason);
  }
}

export const exporters: Record<string, DocumentExporter> = {
  json: new JSONExporter(),
  print: new PrintExporter(),
  docx: new DOCXExporter(),
  'pdf-vector': new VectorPDFExporter()
};
