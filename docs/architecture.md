# SOPStudio System Architecture

## 1. Architectural Philosophy

SOPStudio is constructed around a fundamental architectural invariant:

> **The canonical document model is NOT raw HTML.**

Rather than allowing an uncontrolled WYSIWYG editor to mutate an arbitrary DOM tree or storing HTML strings in state, SOPStudio implements a typed, structured, and serializable `SOPDocument` data model based on ProseMirror / Tiptap `JSONContent`. All application components operate on this single authoritative contract:

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
│ (JSONContent│       │(Tree Nodes)│           │  (Metadata) │
└────┬────────┘       └──────┬─────┘           └──────┬──────┘
     │                       │                        │
     └───────────────────────┼────────────────────────┘
                             │
                  ┌──────────▼────────────┐
                  │  Document Operations  │
                  │ (Pure Non-React Fns)  │
                  └──────────┬────────────┘
                             │
                  ┌──────────▼────────────┐
                  │    DocumentContext    │
                  │ (Thin React State &   │
                  │  Debounced History)   │
                  └──────────┬────────────┘
                             │
         ┌───────────────────┴───────────────────┐
         │                                       │
┌────────▼──────────┐                   ┌────────▼──────────┐
│  DocumentStorage  │                   │  DocumentExporter │
│ (localStorage M0  │                   │  (JSON / Print    │
│  IndexedDB Prod)  │                   │     Prototype)    │
└───────────────────┘                   └───────────────────┘
```

---

## 2. Document Model (`src/types/document.ts`)

The canonical `SOPDocument` interface is composed of strongly typed sub-domains:

```typescript
export interface SOPDocument {
  id: string;                       // Stable UUID
  schemaVersion: string;            // '1.0.0' for future migration support
  createdAt: string;
  updatedAt: string;
  metadata: SOPMetadata;            // Document control, numbering, audit dates, personnel
  branding: BrandingSettings;       // Organization name, department code, header/footer
  pageSetup: PageSetup;             // Paper size configuration, margins, orientation
  style: SOPStyle;                  // Active theme configuration (1 of 5 styles)
  sections: SOPSection[];           // 16 Standard sections with canonical JSONContent
  revisionHistory: RevisionEntry[]; // Change justification log
  approvals: ApprovalEntry[];       // Multi-signatory authorization blocks
  assets: Asset[];                  // Diagrams, attachments, figures
  settings: SOPSettings;            // Auto-save, numbering rules, localization
}
```

### Key Sub-Models:
* `SOPSection`: Represents an atomic document chapter with unique stable `id`, hierarchy `number` (e.g. `9.0`), category (`procedural`, `safety`, `governance`, `quality`, `admin`), `isMandatory` flag, `children?: SOPSection[]` for nested chapters, and canonical structured `content: JSONContent`.
* `SOPMetadata`: Encapsulates mandatory document control fields (`title`, `sopNumber`, `version`, `effectiveDate`, `reviewDate`, `department`, `processOwner`, `author`, `approver`, `status`, `confidentiality`) alongside optional organizational fields.
* `PageSetup`: Stores document layout preferences. *Note:* In M0, the print stylesheet renders an A4 continuous portrait sheet prototype; full multi-format layout and dynamic page splitting belong to the planned M2 pagination engine.

---

## 3. Separation of Concerns: 4-Tier Architecture

To keep the codebase maintainable and independent of UI rendering details, the architecture enforces a strict 4-tier separation:

1. **Tier 1: Document Model (`src/types/`)**
   - Canonical types, interfaces, and enums.
   - Zero framework dependencies.
2. **Tier 2: Document Operations (`src/operations/`, `src/models/content.ts`)**
   - Pure, non-React helper functions (`updateDocumentMetadata`, `findSection`, `updateSectionTitle`, `updateSectionContent`, `flattenSections`, `contentToHTML`, `extractPlainText`).
   - Handles recursive tree traversal for nested sections.
   - Reusable across editors, outlines, validation, import/export tools, and future AI helpers.
3. **Tier 3: React State Management (`src/state/`)**
   - Thin `DocumentProvider` managing screen routing (`home`, `workspace`, `new-wizard`), view modes, and undo/redo stacks.
   - Debounces rapid typing keystroke updates to prevent memory bloat, while recording discrete milestones for structural edits.
4. **Tier 4: UI Components (`src/components/`)**
   - Presentational components consuming `useSOP()` hook.
   - Strictly client-side; no backend calls, no telemetry, no simulated APIs.

---

## 4. Local Persistence Strategy

In M0, client-side persistence is implemented via a browser `localStorage` adapter (`LocalStorageDocumentAdapter`) implementing the generic `DocumentStorage` interface:

```typescript
export interface DocumentStorage {
  save(document: SOPDocument): Promise<void>;
  get(id: string): Promise<SOPDocument | null>;
  listRecent(): Promise<DocumentSummary[]>;
  delete(id: string): Promise<void>;
  exportToJSONString(document: SOPDocument): string;
  importFromJSONString(json: string): SOPDocument;
}
```

* **Current M0 Storage:** `localStorage` prototype (adequate for lightweight prototype documents and recent document registry).
* **Planned Production Storage:** `IndexedDB` adapter designed to store high-resolution images, large embedded assets, and extensive offline SOP libraries without quota constraints.

---

## 5. Scope & Work Package Roadmap

### Implemented in M0:
* Application shell with 3-zone Top Bar contract.
* Primary Home screen entry point.
* 3-step New SOP creation wizard.
* 5 predefined visual themes (Corporate, Industrial, Minimal, Compliance, Technical).
* Canonical document model with structured Tiptap/ProseMirror `JSONContent`.
* Pure recursive operations for nested sections.
* Rich-text editor foundation.
* Structured outline with search filter and section badges.
* Properties panel with required-field indicators and completeness scoring.
* Illustrative demonstration SOP ("Operation and Routine Maintenance of Laboratory pH Meter").
* Canonical structured `.sop.json` import and export.
* Continuous A4 browser print/PDF prototype.
* Automated Vitest unit test suite.

### Implemented in M1.1:
* **Structured Tables**: Native Tiptap AST table extensions (`Table`, `TableRow`, `TableHeader`, `TableCell`) integrated into `sharedEditorExtensions`.
* Configurable table insertion (custom rows, columns, header toggle) and contextual table editing toolbar (row/column add/remove, merge/split cells, header toggle, delete table).
* Data-driven table styling mapped to the 5 SOP visual styles (`bordered`, `striped`, `minimal`, `compliance`, `technical`).
* Unit tests verifying AST representation, header preservation, round-trip serialization, and section isolation.

### Deferred Work Packages:
* **M1 (Remaining)**: Callout admonitions (Note/Caution/Warning), Step-by-Step procedure step blocks, and Native `.docx` exporter.
* **M2**: IndexedDB production storage, Standalone Vector PDF renderer, `.docx` document importer, and section drag-and-drop reordering.
* **M3**: Optional AI Assistant (Gemini) for procedural clarity reviews, safety gap checks, and section suggestions (strictly operator-reviewed; no automatic parameter invention).
