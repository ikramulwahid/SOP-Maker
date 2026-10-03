# SOPStudio

> **M0 Working Product Skeleton** — Laboratory Standard Operating Procedure Authoring, Formatting, and Document Control System.

**Repository:** `https://github.com/ikramulwahid/SOP-Maker`

SOPStudio is a browser-based, client-side application for creating, editing, formatting, previewing, saving, and exporting laboratory Standard Operating Procedures (SOPs).

It operates completely frontend-only:
* **No backend server**
* **No database server**
* **No user accounts or authentication**
* **No server-side document processing**
* **All document data remains client-side** (Local browser storage prototype with strict privacy)

---

## Architecture Overview

SOPStudio enforces a single canonical document model using a structured ProseMirror/Tiptap representation (`JSONContent`) rather than raw HTML as the primary data store:

```
SOPDocument
 ├── metadata           (Title, SOP Number, Version, Dates, Status, Authorship, Confidentiality)
 ├── branding           (Organization, Facility, Header/Footer banners)
 ├── pageSetup          (A4/Letter configuration, Margins, Orientation, Watermarks, Headers)
 ├── style              (1 of 5 data-driven visual style configurations)
 ├── sections[]         (16 standardized sections with canonical structured JSONContent)
 ├── revisionHistory[]  (Version logs, dates, change justifications)
 ├── approvals[]        (Signatory blocks, roles, sign-off status, audit timestamps)
 ├── assets[]           (Diagrams, attachments, figures)
 └── settings           (Autosave, strict numbering, active template)
```

The Editor, Outline, Properties Panel, Preview, Validation Engine, and Exporters all operate concurrently on this shared representation. HTML is strictly a derived rendering and export artifact, never the canonical document storage format.

---

## 5 Predefined Visual Styles

Visual styling is entirely data-driven via reusable theme configurations:

1. **Corporate Professional**: Deep blue accent, structured bar headings, professional data tables, classic document header/footer.
2. **Industrial**: Dark neutral palette with amber safety accents, high-contrast boxed headings, operational hazard priority.
3. **Modern Minimal**: Generous whitespace, refined serif headings, clean hairline rules, zero visual clutter.
4. **Quality / Compliance**: Formal document control layout, boxed headers, formal revision table, signature grid.
5. **Technical**: Cyan/slate precision palette, tabular monospace indicators, technical underline headings, formula-friendly tables.

---

## 16 Standard Regulatory Sections

Every newly generated SOP initializes with the standard 16 sections:

1. `1.0 Document Information`
2. `2.0 Purpose`
3. `3.0 Scope`
4. `4.0 Responsibilities`
5. `5.0 Definitions`
6. `6.0 Prerequisites`
7. `7.0 Required Materials / Tools`
8. `8.0 Safety / Precautions`
9. `9.0 Procedure`
10. `10.0 Process Flow`
11. `11.0 Troubleshooting`
12. `12.0 Quality Checks`
13. `13.0 References`
14. `14.0 Records / Documentation`
15. `15.0 Revision History`
16. `16.0 Approval`

---

## Getting Started

### Installation

```bash
npm install
```

### Running Locally

```bash
npm run dev
```

Open `http://localhost:3000` in your web browser. A fresh launch opens directly on **Home**.

### Building for Production

```bash
npm run build
```

### Running Test Suite

```bash
npm test
```

---

## Scope Breakdown

### Implemented in M0:
* **Application Shell**: Desktop-first responsive layout with clean navigation and Top Bar contract.
* **Home Screen**: Primary launch entry point, new SOP workflow entry, JSON import, demonstration sample loader, and recent documents list.
* **New SOP Workflow**: 3-step creation wizard (Template Selection $\to$ Metadata & Document Control Fields $\to$ Workspace Initialization).
* **Five Predefined Visual Styles**: Corporate, Industrial, Minimal, Compliance, and Technical themes (data/configuration-driven).
* **Document Metadata Panel**: Form inputs for required and optional document control fields with real-time completeness percentage.
* **Structured Outline**: Recursive tree outline supporting top-level and nested sections, active section indication, expand/collapse, and search filtering.
* **Rich-Text Editor Foundation**: Built with Tiptap/ProseMirror storing canonical `JSONContent` (Headings H1-H3, Bold, Italic, Underline, Bullet Lists, Numbered Lists, Alignment).
* **Structured Document Operations**: Pure non-React operations for recursive section traversal, immutable updates, and metadata manipulation.
* **Illustrative Demonstration SOP**: Preloaded with "Operation and Routine Maintenance of Laboratory pH Meter" (`SOP-LAB-001`, illustrative simulated content for software evaluation).
* **Client-Side Persistence Prototype**: Browser `localStorage` adapter conforming to `DocumentStorage` interface.
* **Structured JSON Export**: Downloads canonical `.sop.json` file.
* **Browser Print Prototype**: Continuous A4 layout preview and browser print trigger.
* **Validation Foundation**: Required field audits and completeness scoring.
* **Test Suite**: Vitest suite covering document creation, structured AST content, nested section operations, templates, and validation.

### Implemented in M1.1:
* **Structured Tables**: First-class table support in canonical JSONContent and Tiptap editor:
  - Resizable AST table nodes (`table`, `tableRow`, `tableHeader`, `tableCell`).
  - Configurable row/column insertion with optional header row.
  - Contextual editing toolbar: add/remove rows, add/remove columns, toggle header rows, merge/split cells, delete table.
  - Data-driven table styling matching the 5 SOP visual styles (`bordered`, `striped`, `minimal`, `compliance`, `technical`).
  - Full round-trip serialization and derived HTML rendering for print/preview.

### Deferred to Future Work Packages:
* **IndexedDB Production Storage**: High-capacity client-side database (planned for production).
* **Callouts & Admonitions**: Standardized Note, Caution, and Warning callout components.
* **Procedure-Step Blocks**: Discrete interactive step components with branching.
* **Formulas & Equations**: LaTeX / MathML scientific formula rendering.
* **Embedded Image Assets**: Client-side asset storage and diagram embedding.
* **DOCX Import & Export**: Word document parser and native `.docx` generator.
* **Production PDF Engine & Advanced Pagination**: Multi-page canvas layout engine with exact page numbering and headers/footers.
* **AI Assistance**: Optional Gemini service for procedural clarity and hazard reviews (operator-in-the-loop review required).
