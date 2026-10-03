# SOPStudio

> **M0 Working Product Skeleton** — Laboratory Standard Operating Procedure Authoring, Formatting, and Document Control System.

**Repository:** `https://github.com/ikramulwahid/SOP-Maker`

SOPStudio is a browser-based, client-side application for creating, editing, formatting, previewing, saving, and exporting laboratory Standard Operating Procedures (SOPs).

It operates completely frontend-only:
* **No backend server**
* **No database server**
* **No user accounts or authentication**
* **No server-side document processing**
* **All document data remains client-side** (Local browser storage with strict privacy)

---

## Architecture Overview

SOPStudio enforces a single canonical document model rather than relying on raw HTML as the primary data store:

```
SOPDocument
 ├── metadata           (Title, SOP Number, Version, Dates, Status, Authorship, Confidentiality)
 ├── branding           (Organization, Facility, Header/Footer banners)
 ├── pageSetup          (A4/Letter, Margins, Orientation, Watermarks, Headers)
 ├── style              (1 of 5 data-driven visual style configurations)
 ├── sections[]         (16 standardized regulatory sections with structured rich text)
 ├── revisionHistory[]  (Version logs, dates, change justifications)
 ├── approvals[]        (Signatory blocks, roles, sign-off status, audit timestamps)
 ├── assets[]           (Embedded diagrams, attachments, figures)
 └── settings           (Autosave, strict numbering, active template)
```

The Editor, Outline, Properties Panel, Preview, Validation, and Exporters all operate concurrently on this shared representation.

---

## 5 Predefined Visual Styles

Visual styling is entirely data-driven via reusable theme configurations:

1. **Corporate Professional**: Deep blue accent, structured bar headings, professional data tables, classic document header/footer.
2. **Industrial**: Dark neutral palette with amber safety accents, high-contrast boxed headings, operational hazard priority.
3. **Modern Minimal**: Generous whitespace, refined serif headings, clean hairline rules, zero visual clutter.
4. **Quality / Compliance**: Audit-ready formal document control layout (cGMP/ISO 17025), boxed headers, formal revision table, signature grid.
5. **Technical**: Cyan/slate precision palette, tabular monospace indicators, technical underline headings, formula-friendly tables.

---

## 16 Standard Regulatory Sections

Every newly generated SOP initializes with the standard 16 regulatory sections:

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

Open `http://localhost:3000` in your web browser.

### Building for Production

```bash
npm run build
```

### Running Test Suite

```bash
npm test
```

---

## Implemented Scope (M0)

* [x] **Home Screen**: Product branding, New SOP wizard entry, Import JSON entry, demonstration sample loader, and Recent Documents list.
* [x] **New SOP Workflow**: 3-step wizard (Template Selection $\to$ Metadata & Control Fields $\to$ Workspace Initialization).
* [x] **5 Visual Themes**: Corporate, Industrial, Minimal, Compliance, Technical (selectable live with instant re-render).
* [x] **Workspace 3-Pane Desktop Layout**: Collapsible Left Outline, Center Editor/Preview/Split view, Collapsible Right Properties Panel.
* [x] **Structured Outline Component**: Active section indicator, real-time search/filter, mandatory section tags, expand/collapse.
* [x] **Rich Text Editor Foundation**: Built with Tiptap (Headings H1-H3, Bold, Italic, Underline, Bullet Lists, Numbered Lists, Alignment).
* [x] **A4 Paper-like Preview**: Realistic paper drop-shadow, running headers/footers, metadata table, revision log, signature blocks, zoom controls.
* [x] **Properties Panel**: Form inputs for required and optional document control fields with real-time completeness percentage.
* [x] **Realistic Demonstration SOP**: Preloaded with "Operation and Routine Maintenance of Laboratory pH Meter" (SOP-LAB-001).
* [x] **Local Persistence & Export**: Saves to `localStorage`, exports canonical `.sop.json`, and triggers browser print-to-PDF.
* [x] **Unit Testing**: Vitest test suite covering document creation, styles, metadata updates, section tracking, and JSON serialization.

---

## Planned Work Packages

* **M1**: Rich Table Editor, Callout blocks (Note, Caution, Warning), Step-by-Step procedure step numbering, and Native `.docx` exporter.
* **M2**: Standalone Vector PDF renderer, `.docx` document importer, and drag-and-drop section reordering.
* **M3**: Optional AI Assistant (Gemini) for procedural clarity review, missing section suggestion, and safety hazard gap checks (human-in-the-loop review required).
