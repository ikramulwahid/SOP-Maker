import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { createBlankDocument } from '../src/templates/defaultDocument';
import { TEMPLATE_STYLES, TEMPLATE_STYLE_LIST } from '../src/templates/styles';
import { SAMPLE_LAB_SOP } from '../src/data/sampleSop';
import { documentStorage } from '../src/storage/localStorageAdapter';
import { validationEngine } from '../src/validation/rules';
import { 
  findSection, 
  updateSection, 
  updateSectionTitle, 
  updateSectionContent,
  flattenSections,
  countSections 
} from '../src/operations/sectionOperations';
import { 
  updateDocumentMetadata, 
  updateDocumentSectionTitle, 
  updateDocumentSectionContent 
} from '../src/operations/documentOperations';
import { extractPlainText, contentToHTML, createContentFromParagraphs } from '../src/models/content';
import { sharedEditorExtensions } from '../src/editor/extensions';
import { SOPSection, JSONContent } from '../src/types/document';
import { DocumentProvider, useSOP } from '../src/state/documentContext';
import { 
  HistoryState,
  pushHistoryMilestone, 
  performUndoStep, 
  performRedoStep 
} from '../src/state/historyManager';

describe('SOPStudio Canonical Document Model & Operations', () => {
  describe('1. Document Model & Initialization', () => {
    it('creates a new blank SOP document with 16 standardized sections', () => {
      const doc = createBlankDocument({
        title: 'Analytical Balance Calibration Protocol',
        sopNumber: 'SOP-LAB-042',
        version: '1.0',
        department: 'Biochemistry',
        author: 'Dr. Jane Smith',
        approver: 'Director Quality'
      });

      expect(doc).toBeDefined();
      expect(doc.id).toMatch(/^sop-/);
      expect(doc.metadata.title).toBe('Analytical Balance Calibration Protocol');
      expect(doc.metadata.sopNumber).toBe('SOP-LAB-042');
      expect(doc.metadata.version).toBe('1.0');
      expect(doc.metadata.author).toBe('Dr. Jane Smith');
      expect(doc.metadata.approver).toBe('Director Quality');

      // Must have exactly 16 default regulatory sections
      expect(doc.sections).toHaveLength(16);
      expect(doc.sections[0].title).toBe('Document Information');
      expect(doc.sections[1].title).toBe('Purpose');
      expect(doc.sections[8].title).toBe('Procedure');
      expect(doc.sections[15].title).toBe('Approval');
    });

    it('all five predefined template visual styles exist and configure styles correctly', () => {
      expect(TEMPLATE_STYLE_LIST).toHaveLength(5);
      const styleIds = ['corporate', 'industrial', 'minimal', 'compliance', 'technical'] as const;

      styleIds.forEach((id) => {
        const style = TEMPLATE_STYLES[id];
        expect(style).toBeDefined();
        expect(style.id).toBe(id);
        expect(style.accentColor).toBeDefined();
        expect(style.headingStyle).toBeDefined();
      });

      const docCorporate = createBlankDocument({ templateId: 'corporate' });
      expect(docCorporate.style.id).toBe('corporate');

      const docCompliance = createBlankDocument({ templateId: 'compliance' });
      expect(docCompliance.style.id).toBe('compliance');
    });

    it('updates document metadata via pure document operations', () => {
      const doc = createBlankDocument({
        title: 'Initial Title',
        version: '1.0'
      });

      const updated = updateDocumentMetadata(doc, {
        title: 'Updated Metrology Calibration SOP',
        version: '1.1',
        status: 'Under Review'
      });

      expect(updated.metadata.title).toBe('Updated Metrology Calibration SOP');
      expect(updated.metadata.version).toBe('1.1');
      expect(updated.metadata.status).toBe('Under Review');
      expect(doc.metadata.title).toBe('Initial Title'); // immutability preserved
    });
  });

  describe('2. Structured Content Representation & Shared Tiptap Schema', () => {
    it('authoritative sharedEditorExtensions explicitly includes Underline extension', () => {
      expect(Array.isArray(sharedEditorExtensions)).toBe(true);
      expect(sharedEditorExtensions.length).toBeGreaterThan(0);
      const underlineExt = sharedEditorExtensions.find(ext => ext.name === 'underline');
      expect(underlineExt).toBeDefined();
      expect(underlineExt?.name).toBe('underline');
    });

    it('converts content containing an underline mark to HTML successfully without losing the mark', () => {
      const underlinedDoc: JSONContent = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Critical calibration threshold: ',
              },
              {
                type: 'text',
                text: 'do not exceed 50.0 degrees Celsius',
                marks: [{ type: 'underline' }]
              }
            ]
          }
        ]
      };

      const html = contentToHTML(underlinedDoc);
      expect(html).toContain('<u>do not exceed 50.0 degrees Celsius</u>');
      expect(html).toContain('Critical calibration threshold:');
    });

    it('preserves rich document structure through complete JSONContent serialization and deserialization', () => {
      const richContent: JSONContent = {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: 'Section Heading Level 2' }]
          },
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'Normal text with ' },
              { type: 'text', text: 'bold statement', marks: [{ type: 'bold' }] },
              { type: 'text', text: ', ' },
              { type: 'text', text: 'italic note', marks: [{ type: 'italic' }] },
              { type: 'text', text: ', and ' },
              { type: 'text', text: 'underlined mandate', marks: [{ type: 'underline' }] },
              { type: 'text', text: '.' }
            ]
          },
          {
            type: 'bulletList',
            content: [
              {
                type: 'listItem',
                content: [{ type: 'paragraph', content: [{ type: 'text', text: 'First bullet point' }] }]
              },
              {
                type: 'listItem',
                content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Second bullet point' }] }]
              }
            ]
          },
          {
            type: 'orderedList',
            content: [
              {
                type: 'listItem',
                content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Step 1 sequence' }] }]
              },
              {
                type: 'listItem',
                content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Step 2 sequence' }] }]
              }
            ]
          }
        ]
      };

      const testDoc = createBlankDocument({ title: 'Rich Schema Test' });
      testDoc.sections[8].content = richContent;

      // Serialization
      const serialized = documentStorage.exportToJSONString(testDoc);
      expect(typeof serialized).toBe('string');

      // Deserialization
      const restored = documentStorage.importFromJSONString(serialized);
      const restoredSectionContent = restored.sections[8].content;

      // Verify node types and exact AST hierarchy
      expect(restoredSectionContent.type).toBe('doc');
      expect(restoredSectionContent.content).toHaveLength(4);

      // Verify Heading
      const headingNode = restoredSectionContent.content![0];
      expect(headingNode.type).toBe('heading');
      expect(headingNode.attrs?.level).toBe(2);
      expect(headingNode.content![0].text).toBe('Section Heading Level 2');

      // Verify Paragraph with Bold, Italic, and Underline marks
      const paragraphNode = restoredSectionContent.content![1];
      expect(paragraphNode.type).toBe('paragraph');
      expect(paragraphNode.content![1].marks).toEqual([{ type: 'bold' }]);
      expect(paragraphNode.content![3].marks).toEqual([{ type: 'italic' }]);
      expect(paragraphNode.content![5].marks).toEqual([{ type: 'underline' }]);

      // Verify Bullet List
      const bulletListNode = restoredSectionContent.content![2];
      expect(bulletListNode.type).toBe('bulletList');
      expect(bulletListNode.content).toHaveLength(2);

      // Verify Ordered List
      const orderedListNode = restoredSectionContent.content![3];
      expect(orderedListNode.type).toBe('orderedList');
      expect(orderedListNode.content).toHaveLength(2);

      // Verify derived HTML reflects all formatting
      const derivedHTML = contentToHTML(restoredSectionContent);
      expect(derivedHTML).toContain('<h2>Section Heading Level 2</h2>');
      expect(derivedHTML).toContain('<strong>bold statement</strong>');
      expect(derivedHTML).toContain('<em>italic note</em>');
      expect(derivedHTML).toContain('<u>underlined mandate</u>');
      expect(derivedHTML).toContain('<ul>');
      expect(derivedHTML).toContain('<ol>');
    });
  });

  describe('3. Recursive Section Operations & Preservation of Unrelated Nodes', () => {
    const sampleTree: SOPSection[] = [
      {
        id: 'sec-1',
        number: '1.0',
        title: 'Top Section 1',
        isMandatory: true,
        content: createContentFromParagraphs('Top level 1 content')
      },
      {
        id: 'sec-2',
        number: '2.0',
        title: 'Top Section 2 with Children',
        isMandatory: false,
        content: createContentFromParagraphs('Top level 2 content'),
        children: [
          {
            id: 'sec-2-1',
            number: '2.1',
            title: 'Nested Subsection 2.1',
            isMandatory: false,
            content: createContentFromParagraphs('Nested child content 2.1')
          },
          {
            id: 'sec-2-2',
            number: '2.2',
            title: 'Nested Subsection 2.2',
            isMandatory: true,
            content: createContentFromParagraphs('Nested child content 2.2'),
            children: [
              {
                id: 'sec-2-2-1',
                number: '2.2.1',
                title: 'Deeply Nested Subsection 2.2.1',
                isMandatory: true,
                content: createContentFromParagraphs('Deeply nested 3rd level content')
              }
            ]
          }
        ]
      }
    ];

    it('finds top-level and nested sections recursively', () => {
      expect(findSection(sampleTree, 'sec-1')?.title).toBe('Top Section 1');
      expect(findSection(sampleTree, 'sec-2-1')?.title).toBe('Nested Subsection 2.1');
      expect(findSection(sampleTree, 'sec-2-2-1')?.title).toBe('Deeply Nested Subsection 2.2.1');
      expect(findSection(sampleTree, 'invalid-id')).toBeNull();
    });

    it('updating a nested section preserves unrelated top-level and sibling sections', () => {
      const newNestedContent = createContentFromParagraphs('Modified text in 2.2.1');
      const updatedTree = updateSectionContent(sampleTree, 'sec-2-2-1', newNestedContent);

      // Target section is updated
      const updatedNested = findSection(updatedTree, 'sec-2-2-1');
      expect(extractPlainText(updatedNested?.content)).toBe('Modified text in 2.2.1');

      // Unrelated top-level section (sec-1) is strictly identical
      const untouchedTopLevel = findSection(updatedTree, 'sec-1');
      expect(untouchedTopLevel).toBe(sampleTree[0]); // Reference identity preserved
      expect(extractPlainText(untouchedTopLevel?.content)).toBe('Top level 1 content');

      // Sibling subsection (sec-2-1) is strictly preserved
      const untouchedSibling = findSection(updatedTree, 'sec-2-1');
      const originalSibling = findSection(sampleTree, 'sec-2-1');
      expect(untouchedSibling).toBe(originalSibling); // Reference identity preserved
      expect(extractPlainText(untouchedSibling?.content)).toBe('Nested child content 2.1');

      // Original sampleTree is completely unmodified (immutable)
      const originalNested = findSection(sampleTree, 'sec-2-2-1');
      expect(extractPlainText(originalNested?.content)).toBe('Deeply nested 3rd level content');
    });

    it('updating section title recursively preserves other attributes and nodes', () => {
      const updatedTree = updateSectionTitle(sampleTree, 'sec-2-1', 'Calibrated Sub-Protocol 2.1');
      const node = findSection(updatedTree, 'sec-2-1');
      expect(node?.title).toBe('Calibrated Sub-Protocol 2.1');
      expect(node?.number).toBe('2.1');
      expect(node?.isMandatory).toBe(false);
      expect(extractPlainText(node?.content)).toBe('Nested child content 2.1');
    });

    it('counts and flattens sections accurately across hierarchy levels', () => {
      expect(countSections(sampleTree)).toBe(5);
      const flat = flattenSections(sampleTree);
      expect(flat).toHaveLength(5);
      expect(flat.map(s => s.id)).toEqual(['sec-1', 'sec-2', 'sec-2-1', 'sec-2-2', 'sec-2-2-1']);
    });
  });

  describe('4. Application UI State & Home Entry Point', () => {
    it('verifies DocumentProvider initializes with currentScreen = "home"', () => {
      // Test consumer reading context value directly from DocumentProvider
      function ScreenTestConsumer() {
        const { currentScreen } = useSOP();
        return React.createElement('div', { id: 'test-screen-indicator' }, currentScreen);
      }

      const renderedMarkup = renderToString(
        React.createElement(DocumentProvider, null, React.createElement(ScreenTestConsumer, null))
      );

      // Verify the rendered indicator contains 'home' as initial state
      expect(renderedMarkup).toContain('id="test-screen-indicator"');
      expect(renderedMarkup).toContain('home');
    });
  });

  describe('5. Undo/Redo History Manager Logic', () => {
    it('captures milestones on discrete updates and supports bidirectional undo/redo', () => {
      const docA = createBlankDocument({ title: 'Revision A' });
      const docB = createBlankDocument({ title: 'Revision B' });
      const docC = createBlankDocument({ title: 'Revision C' });

      let history: HistoryState = { undoStack: [], redoStack: [] };

      // Push milestone from docA to docB
      history = pushHistoryMilestone(history, docA);
      expect(history.undoStack).toHaveLength(1);
      expect(history.redoStack).toHaveLength(0);

      // Push milestone from docB to docC
      history = pushHistoryMilestone(history, docB);
      expect(history.undoStack).toHaveLength(2);

      // Undo step: returns previous doc (docB) and moves docC to redoStack
      const undoResult1 = performUndoStep(history, docC);
      expect(undoResult1).not.toBeNull();
      expect(undoResult1?.nextDoc.metadata.title).toBe('Revision B');
      expect(undoResult1?.state.undoStack).toHaveLength(1);
      expect(undoResult1?.state.redoStack).toHaveLength(1);

      // Undo step 2: returns docA and moves docB to redoStack
      const undoResult2 = performUndoStep(undoResult1!.state, undoResult1!.nextDoc);
      expect(undoResult2).not.toBeNull();
      expect(undoResult2?.nextDoc.metadata.title).toBe('Revision A');
      expect(undoResult2?.state.undoStack).toHaveLength(0);
      expect(undoResult2?.state.redoStack).toHaveLength(2);

      // Redo step: restores docB
      const redoResult = performRedoStep(undoResult2!.state, undoResult2!.nextDoc);
      expect(redoResult).not.toBeNull();
      expect(redoResult?.nextDoc.metadata.title).toBe('Revision B');
      expect(redoResult?.state.undoStack).toHaveLength(1);
      expect(redoResult?.state.redoStack).toHaveLength(1);
    });

    it('clears redo stack when a new milestone is pushed', () => {
      const docA = createBlankDocument({ title: 'A' });
      const docB = createBlankDocument({ title: 'B' });
      const docC = createBlankDocument({ title: 'C' });

      const history: HistoryState = pushHistoryMilestone({ undoStack: [], redoStack: [] }, docA);
      const undoResult = performUndoStep(history, docB);
      expect(undoResult?.state.redoStack).toHaveLength(1);

      // User performs a new discrete action instead of redoing
      const branchedHistory = pushHistoryMilestone(undoResult!.state, docC);
      expect(branchedHistory.redoStack).toHaveLength(0); // cleared on branch
    });
  });

  describe('6. Validation Engine', () => {
    it('validates complete document and reports high completion percentage', () => {
      const result = validationEngine.validate(SAMPLE_LAB_SOP);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.completionPercentage).toBeGreaterThanOrEqual(80);
    });

    it('detects missing required metadata fields', () => {
      const incompleteDoc = createBlankDocument();
      incompleteDoc.metadata.title = '';
      incompleteDoc.metadata.sopNumber = '';
      incompleteDoc.metadata.author = '';

      const result = validationEngine.validate(incompleteDoc);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.field === 'title')).toBe(true);
      expect(result.errors.some(e => e.field === 'sopNumber')).toBe(true);
      expect(result.errors.some(e => e.field === 'author')).toBe(true);
    });

    it('flags warning when review date is earlier than effective date', () => {
      const doc = createBlankDocument();
      doc.metadata.effectiveDate = '2026-12-01';
      doc.metadata.reviewDate = '2026-06-01'; // invalid chronological order

      const result = validationEngine.validate(doc);
      expect(result.warnings.some(w => w.field === 'reviewDate')).toBe(true);
    });
  });

  describe('7. Structured Table Support (M1.1)', () => {
    const labTableContent: JSONContent = {
      type: 'doc',
      content: [
        {
          type: 'table',
          content: [
            {
              type: 'tableRow',
              content: [
                {
                  type: 'tableHeader',
                  content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Parameter' }] }]
                },
                {
                  type: 'tableHeader',
                  content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Requirement' }] }]
                },
                {
                  type: 'tableHeader',
                  content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Acceptance Criteria' }] }]
                }
              ]
            },
            {
              type: 'tableRow',
              content: [
                {
                  type: 'tableCell',
                  content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Temperature' }] }]
                },
                {
                  type: 'tableCell',
                  content: [{ type: 'paragraph', content: [{ type: 'text', text: '20–25 °C' }] }]
                },
                {
                  type: 'tableCell',
                  content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Within specified range' }] }]
                }
              ]
            },
            {
              type: 'tableRow',
              content: [
                {
                  type: 'tableCell',
                  content: [{ type: 'paragraph', content: [{ type: 'text', text: 'pH' }] }]
                },
                {
                  type: 'tableCell',
                  content: [{ type: 'paragraph', content: [{ type: 'text', text: '6.8–7.2' }] }]
                },
                {
                  type: 'tableCell',
                  content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Meets method requirement' }] }]
                }
              ]
            }
          ]
        }
      ]
    };

    it('authoritative sharedEditorExtensions includes Table, TableRow, TableHeader, TableCell', () => {
      const names = sharedEditorExtensions.map(ext => ext.name);
      expect(names).toContain('table');
      expect(names).toContain('tableRow');
      expect(names).toContain('tableHeader');
      expect(names).toContain('tableCell');
    });

    it('represents structured laboratory table as JSONContent AST', () => {
      expect(labTableContent.type).toBe('doc');
      const tableNode = labTableContent.content![0];
      expect(tableNode.type).toBe('table');
      expect(tableNode.content).toHaveLength(3); // 1 header row + 2 data rows
    });

    it('table JSONContent survives full JSON serialization and deserialization intact', () => {
      const doc = createBlankDocument({ title: 'SOP with Quality Control Table' });
      doc.sections[8].content = labTableContent;

      const serialized = documentStorage.exportToJSONString(doc);
      const restored = documentStorage.importFromJSONString(serialized);

      const restoredTable = restored.sections[8].content.content![0];
      expect(restoredTable.type).toBe('table');
      expect(restoredTable.content).toHaveLength(3);

      // Verify header row
      const headerRow = restoredTable.content![0];
      expect(headerRow.type).toBe('tableRow');
      expect(headerRow.content![0].type).toBe('tableHeader');
      expect(headerRow.content![0].content![0].content![0].text).toBe('Parameter');
      expect(headerRow.content![1].content![0].content![0].text).toBe('Requirement');
      expect(headerRow.content![2].content![0].content![0].text).toBe('Acceptance Criteria');

      // Verify data row
      const dataRow1 = restoredTable.content![1];
      expect(dataRow1.type).toBe('tableRow');
      expect(dataRow1.content![0].type).toBe('tableCell');
      expect(dataRow1.content![0].content![0].content![0].text).toBe('Temperature');
      expect(dataRow1.content![1].content![0].content![0].text).toBe('20–25 °C');
      expect(dataRow1.content![2].content![0].content![0].text).toBe('Within specified range');
    });

    it('contentToHTML() renders the structured table with table, tr, th, and td elements', () => {
      const html = contentToHTML(labTableContent);
      expect(html).toContain('<table');
      expect(html).toContain('<th><p>Parameter</p></th>');
      expect(html).toContain('<th><p>Requirement</p></th>');
      expect(html).toContain('<th><p>Acceptance Criteria</p></th>');
      expect(html).toContain('<td><p>Temperature</p></td>');
      expect(html).toContain('<td><p>20–25 °C</p></td>');
      expect(html).toContain('<td><p>Within specified range</p></td>');
      expect(html).toContain('<td><p>pH</p></td>');
      expect(html).toContain('<td><p>6.8–7.2</p></td>');
    });

    it('preserves table header cells (th) distinct from body cells (td)', () => {
      const html = contentToHTML(labTableContent);
      const thMatches = html.match(/<th/g) || [];
      const tdMatches = html.match(/<td/g) || [];
      expect(thMatches.length).toBe(3);
      expect(tdMatches.length).toBe(6);
    });

    it('updating table in one section does not mutate other sections', () => {
      const doc = createBlankDocument({ title: 'Section Isolation Test' });
      const originalSection0 = doc.sections[0];
      const originalSection1 = doc.sections[1];

      const updatedDoc = updateDocumentSectionContent(doc, doc.sections[8].id, labTableContent);

      expect(updatedDoc.sections[8].content).toBe(labTableContent);
      expect(updatedDoc.sections[0]).toBe(originalSection0); // Reference equality
      expect(updatedDoc.sections[1]).toBe(originalSection1); // Reference equality
      expect(doc.sections[8].content).not.toBe(labTableContent); // Immutability
    });

    it('rich text marks (underline, bold, italic) continue to work inside table cells', () => {
      const richTable: JSONContent = {
        type: 'doc',
        content: [
          {
            type: 'table',
            content: [
              {
                type: 'tableRow',
                content: [
                  {
                    type: 'tableCell',
                    content: [
                      {
                        type: 'paragraph',
                        content: [
                          { type: 'text', text: 'Important: ', marks: [{ type: 'bold' }] },
                          { type: 'text', text: 'must be calibrated', marks: [{ type: 'underline' }] },
                          { type: 'text', text: ' prior to use (', marks: [] },
                          { type: 'text', text: 'see SOP-002', marks: [{ type: 'italic' }] },
                          { type: 'text', text: ').', marks: [] }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      };

      const html = contentToHTML(richTable);
      expect(html).toContain('<strong>Important: </strong>');
      expect(html).toContain('<u>must be calibrated</u>');
      expect(html).toContain('<em>see SOP-002</em>');
    });
  });
});
