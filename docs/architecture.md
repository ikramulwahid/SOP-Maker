# SOPStudio System Architecture

## 1. Architectural Philosophy

SOPStudio is constructed around a fundamental architectural invariant:

> **The primary document model is NOT raw HTML.**

Rather than allowing an uncontrolled WYSIWYG editor to mutate an arbitrary DOM tree, SOPStudio implements a typed, structured, and serializable `SOPDocument` data model. All components (Editor, Outline, Metadata Panel, Preview, Validation, Importers, and Exporters) read from and write to this authoritative contract.

```
                  ┌───────────────────────┐
                  │      SOPDocument      │
                  │   Canonical Model     │
                  └──────────┬────────────┘
                             │
     ┌───────────────────────┼────────────────────────┐
     │                       │                        │
┌────▼────────┐       ┌──────▼─────┐           ┌──────▼──────┐
│  SOPEditor  │       │ SOPOutline │           │  Properties │
│   (Tiptap)  │       │  (Sections)│           │  (Metadata) │
└────┬────────┘       └──────┬─────┘           └──────┬──────┘
     │                       │                        │
     └───────────────────────┼────────────────────────┘
                             │
                  ┌──────────▼────────────┐
                  │    DocumentContext    │
                  │   Central Store &     │
                  │    History Stack      │
                  └──────────┬────────────┘
                             │
         ┌───────────────────┴───────────────────┐
         │                                       │
┌────────▼──────────┐                   ┌────────▼──────────┐
│  DocumentStorage  │                   │  DocumentExporter │
│  (LocalStorage)   │                   │  (JSON / Print)   │
└───────────────────┘                   └───────────────────┘
```

---

## 2. Document Model (`src/types/document.ts`)

The canonical `SOPDocument` interface is composed of structured sub-domains:

```typescript
export interface SOPDocument {
  id: string;                       // Stable UUID
  schemaVersion: string;            // '1.0.0' for future migration support
  createdAt: string;
  updatedAt: string;
  metadata: SOPMetadata;            // Document control, numbering, audit dates, personnel
  branding: BrandingSettings;       // Organization name, department code, header/footer
  pageSetup: PageSetup;             // Paper size (A4), margins, orientation, watermarks
  style: SOPStyle;                  // Active theme configuration (1 of 5 styles)
  sections: SOPSection[];           // 16 Standardized regulatory sections
  revisionHistory: RevisionEntry[]; // Change justification log
  approvals: ApprovalEntry[];       // Multi-signatory authorization blocks
  assets: Asset[];                  // Diagrams, attachments, figures
  settings: SOPSettings;            // Auto-save, numbering rules, localization
}
```

### Key Sub-Models:
* `SOPMetadata`: Encapsulates mandatory ISO/GLP fields (`title`, `sopNumber`, `version`, `effectiveDate`, `reviewDate`, `department`, `processOwner`, `author`, `approver`, `status`, `confidentiality`) alongside optional organizational fields.
* `SOPSection`: Represents an atomic document chapter with unique stable `id`, regulatory hierarchy `number` (e.g. `9.0`), category (`procedural`, `safety`, `governance`, `quality`, `admin`), `isMandatory` flag, and rich-text HTML `content`.
* `SOPStyle`: Data-driven presentation tokens controlling typography, accent colors, table border styles, and heading ornamentation without altering semantic data.

---

## 3. Major Application Modules

### 3.1 Application Shell (`src/components/shell/`)
* **`AppHeader.tsx`**: Complies with the single-row Top Bar Contract. Houses brand wordmark, view switches (Home, Editor, Preview, Split), undo/redo controls, theme switcher dropdown, save button, and export trigger.
* **`Workspace.tsx`**: Three-pane responsive workstation orchestrating the Left Outline (280px), Center Content Viewport (Editor, A4 Preview, or Split View), and Right Properties Panel (320px).

### 3.2 Document Editor Foundation (`src/components/editor/`)
* Built atop `@tiptap/react` and ProseMirror.
* Encapsulates rich-text mutations (H1–H3, Bold, Italic, Underline, Bullet Lists, Numbered Lists, Text Alignment).
* Emits sanitized HTML strings back to the centralized `updateSectionContent` action.

### 3.3 Structured Outline (`src/components/outline/`)
* Provides interactive navigation across all 16 default sections.
* Includes real-time filter search and mandatory section visual indicators.
* Maintains active section synchronization between outline, editor, and preview sheet.

### 3.4 Preview & Paper Rendering (`src/components/preview/`)
* Translates the active `SOPDocument` into an A4 physical paper sheet (`#sop-printable-sheet`).
* Formats running headers, metadata control tables, dynamic heading styles, revision logs, and signature blocks.
* Fully styled for `@media print` browser-native PDF export.

### 3.5 Metadata Panel (`src/components/metadata/`)
* Properties sidebar providing input controls for required and optional document control fields.
* Real-time calculation of document completion percentage via the `ValidationEngine`.

### 3.6 Creation Wizard (`src/components/wizard/`)
* 3-step initialization flow:
  1. Template Selection (Visual cards for 5 styles)
  2. Metadata Entry (Validation check on required inputs)
  3. Confirmation Summary (Prepopulates the 16 standard sections into active workspace)

---

## 4. Extension Strategy

### 4.1 Storage Adapter (`src/storage/`)
The `DocumentStorage` interface abstracts client-side persistence:
```typescript
export interface DocumentStorage {
  save(document: SOPDocument): Promise<void>;
  get(id: string): Promise<SOPDocument | null>;
  listRecent(): Promise<DocumentSummary[]>;
  delete(id: string): Promise<void>;
}
```
Currently implemented via `LocalStorageDocumentAdapter`. In future work packages, this can be swapped with IndexedDB or File System Access API without modifying UI components.

### 4.2 Exporter & Importer Interfaces (`src/export/`, `src/import/`)
Exporters and Importers adhere to polymorphism:
```typescript
export interface DocumentExporter {
  readonly formatId: string;
  readonly formatName: string;
  readonly fileExtension: string;
  readonly isSupported: boolean;
  exportDocument(doc: SOPDocument, options?: ExportOptions): Promise<void>;
}
```
* `JSONExporter`: Supported (M0)
* `PrintExporter`: Supported (M0)
* `DOCXExporter`: Scheduled for M1
* `VectorPDFExporter`: Scheduled for M2

---

## 5. AI Boundary & Future Gemini Integration

The architecture strictly separates core document authoring from artificial intelligence services.

* **No Automatic Overwrites**: Any future Gemini integration (Work Package M3) will produce `AISuggestion` proposals (e.g. identifying missing safety PPE or ambiguous step instructions).
* **Mandatory Operator Review**: Suggestions must be explicitly approved or edited by the technician before modifying the canonical `SOPDocument`.
* **Zero Fabrication**: AI services are instructed never to invent laboratory quantities, chemical concentrations, or calibration tolerances.
