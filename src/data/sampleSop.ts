import { SOPDocument, JSONContent } from '../types/document';
import { TEMPLATE_STYLES } from '../templates/styles';

// Helper constructors for structured ProseMirror JSONContent
function docNode(...content: JSONContent[]): JSONContent {
  return { type: 'doc', content };
}

function pNode(...elements: (string | JSONContent)[]): JSONContent {
  return {
    type: 'paragraph',
    content: elements.map(el => {
      if (typeof el === 'string') {
        return { type: 'text', text: el };
      }
      return el;
    })
  };
}

function boldText(text: string): JSONContent {
  return {
    type: 'text',
    text,
    marks: [{ type: 'bold' }]
  };
}

function italicText(text: string): JSONContent {
  return {
    type: 'text',
    text,
    marks: [{ type: 'italic' }]
  };
}

function headingNode(level: number, text: string): JSONContent {
  return {
    type: 'heading',
    attrs: { level },
    content: [{ type: 'text', text }]
  };
}

function bulletListNode(...items: (string | (string | JSONContent)[])[]): JSONContent {
  return {
    type: 'bulletList',
    content: items.map(item => {
      const parts = Array.isArray(item) ? item : [item];
      return {
        type: 'listItem',
        content: [
          {
            type: 'paragraph',
            content: parts.map(el => typeof el === 'string' ? { type: 'text', text: el } : el)
          }
        ]
      };
    })
  };
}

function orderedListNode(...items: (string | (string | JSONContent)[])[]): JSONContent {
  return {
    type: 'orderedList',
    content: items.map(item => {
      const parts = Array.isArray(item) ? item : [item];
      return {
        type: 'listItem',
        content: [
          {
            type: 'paragraph',
            content: parts.map(el => typeof el === 'string' ? { type: 'text', text: el } : el)
          }
        ]
      };
    })
  };
}

/**
 * Illustrative demonstration laboratory SOP data.
 * Notice: This procedure contains simulated demonstration content for software evaluation purposes only.
 * It does not constitute an authentic, approved, or accredited laboratory protocol.
 */
export const SAMPLE_LAB_SOP: SOPDocument = {
  id: 'sop-sample-ph-meter-001',
  schemaVersion: '1.0.0',
  createdAt: '2026-01-15T08:30:00.000Z',
  updatedAt: '2026-03-20T14:45:00.000Z',
  metadata: {
    title: 'Operation and Routine Maintenance of Laboratory pH Meter',
    sopNumber: 'SOP-LAB-001',
    version: '1.0',
    effectiveDate: '2026-04-01',
    reviewDate: '2027-04-01',
    department: 'Analytical Chemistry Core',
    processOwner: 'Dr. Elena Rostova',
    author: 'Markus Vance, Senior Lab Analyst',
    approver: 'Dr. Sarah Chen, Director of Quality Assurance',
    confidentiality: 'Internal',
    status: 'Approved',
    organization: 'BioPharma Precision Technologies Inc.',
    location: 'Building C, Room 304 (Analytical Instrument Suite)',
    category: 'Analytical Instrumentation',
    documentOwner: 'Quality Control Department',
    preparedBy: 'Markus Vance, Senior Lab Analyst',
    reviewedBy: 'Dr. Aris Thorne, Laboratory Operations Manager',
    approvedBy: 'Dr. Sarah Chen, Director of Quality Assurance',
    revisionSummary: 'Initial formal release superseding legacy bench guidance B-04. Standardized 3-point calibration protocol incorporated.',
    keywords: ['pH Meter', 'Calibration', 'Buffer Solutions', 'Electrode Maintenance', 'Electrochemical Analysis'],
    referenceDocuments: [
      'USP <791> pH Determination Reference Guide',
      'ASTM D1293 Standard Test Methods for pH of Water',
      'Manufacturer Instrument Manual (Benchtop pH Meter)'
    ]
  },
  branding: {
    companyName: 'BioPharma Precision Technologies',
    facilityName: 'Analytical Chemistry Core — Building C',
    departmentCode: 'ANL-CHEM-01',
    headerText: 'DEMONSTRATION SAMPLE SOP — ILLUSTRATIVE CONTROLLED DOCUMENT',
    footerText: 'SOP-LAB-001 Rev 1.0 · Illustrative Demonstration Content Only · Uncontrolled if Printed'
  },
  pageSetup: {
    paperSize: 'A4',
    orientation: 'portrait',
    margins: {
      top: 25,
      right: 20,
      bottom: 25,
      left: 20,
      unit: 'mm'
    },
    showPageNumbers: true,
    showWatermark: false,
    watermarkText: 'SAMPLE DEMO',
    headerDistanceMm: 12,
    footerDistanceMm: 12
  },
  style: TEMPLATE_STYLES.corporate,
  sections: [
    {
      id: 'sec-1',
      number: '1.0',
      title: 'Document Information',
      isMandatory: true,
      category: 'admin',
      content: docNode(
        pNode(
          boldText('Demonstration Notice: '),
          'This document contains illustrative demonstration content configured for testing SOPStudio authoring, formatting, and document control capabilities. It is not an officially authorized laboratory procedure.'
        ),
        pNode(
          'This Standard Operating Procedure establishes standardized instructions for the calibration, routine operation, and maintenance of benchtop glass combination electrode pH meters within the Analytical Chemistry Core.'
        )
      )
    },
    {
      id: 'sec-2',
      number: '2.0',
      title: 'Purpose',
      isMandatory: true,
      category: 'admin',
      content: docNode(
        pNode(
          'The purpose of this procedure is to ensure precise, accurate, and reproducible electrochemical pH measurements across all aqueous reagent formulations, mobile phases, and sample matrices.'
        ),
        pNode(
          'Adherence to this protocol maintains operational consistency and internal traceability across analytical runs.'
        )
      )
    },
    {
      id: 'sec-3',
      number: '3.0',
      title: 'Scope',
      isMandatory: true,
      category: 'admin',
      content: docNode(
        pNode(
          'This procedure applies to analytical chemists, technicians, and quality control analysts operating benchtop pH meters in Laboratory Suites C-302, C-304, and C-310.'
        ),
        pNode(
          'It encompasses routine daily calibrations, sample determinations, electrode hydration routines, and monthly preventive electrolyte replenishment.'
        )
      )
    },
    {
      id: 'sec-4',
      number: '4.0',
      title: 'Responsibilities',
      isMandatory: true,
      category: 'governance',
      content: docNode(
        bulletListNode(
          [boldText('Laboratory Analysts: '), 'Perform daily 3-point calibration, log calibration slopes, execute sample measurements, and thoroughly rinse the electrode between runs.'],
          [boldText('Lead Chemist / Process Owner: '), 'Monitor slope drift trends, ensure availability of fresh calibration standards, and supervise monthly maintenance routines.'],
          [boldText('Quality Assurance Unit: '), 'Conduct periodic logbook audits, verify calibration records, and review out-of-specification reports.']
        )
      )
    },
    {
      id: 'sec-5',
      number: '5.0',
      title: 'Definitions',
      isMandatory: false,
      category: 'admin',
      content: docNode(
        bulletListNode(
          [boldText('Nernstian Slope: '), 'The theoretical potential change of 59.16 mV per pH unit change at 25.0 °C. Acceptable laboratory slope must fall between 95.0% and 105.0%.'],
          [boldText('ATC (Automatic Temperature Compensation): '), 'System probe compensating the millivolt output calculation for temperature variations between standards and analytes.'],
          [boldText('Electrode Drift: '), 'Continuous change in pH readout exceeding ±0.02 pH units over a 60-second stabilization window.'],
          [boldText('Combination Electrode: '), 'A sensor housing both the glass measuring half-cell and the reference half-cell in a single probe body.']
        )
      )
    },
    {
      id: 'sec-6',
      number: '6.0',
      title: 'Prerequisites',
      isMandatory: false,
      category: 'procedural',
      content: docNode(
        bulletListNode(
          'All analysts must complete the General Analytical Instrumentation Training Module.',
          'Verify the instrument is powered on and stabilized for at least 15 minutes before executing calibration.',
          'Ensure room temperature is maintained within nominal envelope: 20.0 °C to 25.0 °C with relative humidity below 70%.'
        )
      )
    },
    {
      id: 'sec-7',
      number: '7.0',
      title: 'Required Materials / Tools',
      isMandatory: true,
      category: 'procedural',
      content: docNode(
        bulletListNode(
          'Benchtop pH/mV Meter with combination pH/ATC Triode.',
          'Certified buffer solutions: pH 4.01 (Red), pH 7.00 (Yellow), and pH 10.01 (Blue).',
          'Electrode storage solution: 3.0 M Potassium Chloride (KCl) reference filling solution.',
          'Grade 1 Type I Ultrapure Reagent Water (Resistivity ≥ 18.2 MΩ·cm at 25 °C).',
          'Lint-free precision laboratory task wipes.',
          'Clean 50 mL borosilicate glass beakers and PTFE-coated magnetic stir bars with magnetic stirrer.'
        )
      )
    },
    {
      id: 'sec-8',
      number: '8.0',
      title: 'Safety / Precautions',
      isMandatory: true,
      category: 'safety',
      content: docNode(
        pNode(
          boldText('Mandatory PPE: '),
          'Standard laboratory coat, nitrile chemical-resistant gloves, and ANSI-certified safety glasses are required at all times.'
        ),
        bulletListNode(
          [boldText('Chemical Hazards: '), 'Buffer solutions and KCl electrolyte are mild skin and eye irritants. If contact occurs, flush immediately with copious clean water for 15 minutes.'],
          [boldText('Electrode Fragility: '), 'The glass bulb at the tip of the electrode is delicate. Never touch the bulb to beaker walls or drop magnetic stir bars onto the sensor tip.'],
          [boldText('Wiping Restriction: '), italicText('Never rub or vigorously wipe the glass bulb. '), 'Electrostatic charges generated by rubbing cause substantial reading instability. Only blot gently with lint-free wipes.']
        )
      )
    },
    {
      id: 'sec-9',
      number: '9.0',
      title: 'Procedure',
      isMandatory: true,
      category: 'procedural',
      content: docNode(
        headingNode(3, '9.1 Instrument Preparation'),
        orderedListNode(
          'Carefully remove the protective storage bottle from the electrode tip.',
          'Slide down the rubber sleeve covering the reference fill hole to expose the internal electrolyte reservoir.',
          'Verify that the internal reference electrolyte level is at least 2.5 cm above the external liquid measurement level.',
          'Rinse the electrode tip thoroughly using a stream of Type I ultrapure water from a wash bottle. Gently blot excess water droplets using a fresh lint-free wipe.'
        ),
        headingNode(3, '9.2 Three-Point Calibration Protocol'),
        orderedListNode(
          'Dispense approximately 30 mL of fresh buffer solutions (pH 7.00, pH 4.01, and pH 10.01) into three designated clean 50 mL beakers.',
          'Press the CALIBRATE button on the instrument console.',
          'Immerse the electrode and ATC temperature probe into the pH 7.00 buffer. Ensure the stir bar is rotating at a gentle, steady pace without creating a deep vortex.',
          'Wait for the reading stability indicator to freeze on screen. Confirm measured value matches pH 7.00 ± 0.02 at current buffer temperature.',
          'Press NEXT to record the midpoint calibration point.',
          'Lift the electrode, rinse generously with Type I water, blot dry, and place into the pH 4.01 buffer. Repeat stabilization and acceptance step.',
          'Rinse once again and repeat calibration in the pH 10.01 buffer.',
          'Press DONE / MEASURE. Record the displayed slope percentage in the equipment logbook.'
        ),
        headingNode(3, '9.3 Sample Measurement'),
        orderedListNode(
          'Pour 30–50 mL of homogeneous sample solution into a clean beaker.',
          'Verify sample temperature is recorded and equilibrates within ±2.0 °C of calibration buffers.',
          'Immerse the electrode until the ceramic junction is fully submerged.',
          'Allow stability indicator to lock (typically 30–60 seconds). Record pH reading to two decimal places.',
          'Between consecutive samples, rinse the electrode three times with Type I water.'
        )
      )
    },
    {
      id: 'sec-10',
      number: '10.0',
      title: 'Process Flow',
      isMandatory: false,
      category: 'procedural',
      content: docNode(
        pNode(boldText('Sequential Operational Flow:')),
        pNode('Uncap & Uncover Fill Hole → Inspect Electrolyte Level → Rinse with Type I H₂O → Calibrate at pH 7.00 → Calibrate at pH 4.01 → Calibrate at pH 10.01 → Verify Slope (95%–105%) → Measure Analytes → Flush & Store in 3.0 M KCl → Reseal Fill Hole Sleeve.')
      )
    },
    {
      id: 'sec-11',
      number: '11.0',
      title: 'Troubleshooting',
      isMandatory: false,
      category: 'quality',
      content: docNode(
        bulletListNode(
          [boldText('Slope Out of Specification (<95% or >105%): '), 'Replace calibration buffer aliquots with fresh solutions from sealed stock bottles. If slope remains invalid, soak electrode in cleaning solution for 15 minutes followed by 2 hours in storage solution.'],
          [boldText('Sluggish Response (>90 seconds to stabilize): '), 'Check ceramic junction for protein or particulate fouling. Perform deep cleaning or junction rinse.'],
          [boldText('Drifting / Fluctuating Readings: '), 'Verify the fill hole sleeve is open. Replenish depleted electrolyte. Ensure magnetic stir motor is not transmitting heat to the solution.']
        )
      )
    },
    {
      id: 'sec-12',
      number: '12.0',
      title: 'Quality Checks',
      isMandatory: true,
      category: 'quality',
      content: docNode(
        bulletListNode(
          [boldText('Slope Acceptance Criterion: '), 'The calibrated slope must read between 95.0% and 105.0%. Any reading outside this band triggers immediate recalibration and lockout from sample testing.'],
          [boldText('Mid-Run Control Check: '), 'Every 10 sample runs, or at the conclusion of a sample batch, re-read the pH 7.00 buffer standard as an unknown control. The measured value must fall within ±0.05 pH units of nominal value.'],
          [boldText('Calibration Expiry: '), 'Calibrations remain valid for a maximum duration of 8 continuous operational hours. A new calibration must be executed at the start of every operational shift.']
        )
      )
    },
    {
      id: 'sec-13',
      number: '13.0',
      title: 'References',
      isMandatory: false,
      category: 'governance',
      content: docNode(
        bulletListNode(
          'Standard Laboratory Practice Reference Handbook.',
          'ASTM Standard Test Methods for pH of Water.',
          'Corporate Quality Manual: Section 6.4 Equipment Calibration and Traceability.'
        )
      )
    },
    {
      id: 'sec-14',
      number: '14.0',
      title: 'Records / Documentation',
      isMandatory: true,
      category: 'governance',
      content: docNode(
        bulletListNode(
          'All calibration slopes, temperatures, technician initials, and buffer lot numbers must be documented in Equipment Logbook LOG-EQ-PH-004 immediately upon completion.',
          'Retain physical instrument printouts or signed electronic log entries for the organizational archive duration.',
          'Any out-of-specification calibration failures must be logged in the Non-Conformance Tracking Register within 24 hours.'
        )
      )
    },
    {
      id: 'sec-15',
      number: '15.0',
      title: 'Revision History',
      isMandatory: true,
      category: 'governance',
      content: docNode(
        pNode(boldText('Historical revision documentation for SOP-LAB-001:')),
        bulletListNode(
          [boldText('Rev 1.0 (2026-04-01): '), 'Initial standardized release under BioPharma Precision Technologies document management architecture. Author: Markus Vance. Approved by: Dr. Sarah Chen.']
        )
      )
    },
    {
      id: 'sec-16',
      number: '16.0',
      title: 'Approval',
      isMandatory: true,
      category: 'governance',
      content: docNode(
        pNode(
          'By signing below, the author, technical reviewer, and quality assurance authority certify that this Standard Operating Procedure has been evaluated for operational clarity, safety instructions, and procedural completeness.'
        )
      )
    }
  ],
  revisionHistory: [
    {
      id: 'rev-1',
      revision: '1.0',
      date: '2026-03-20',
      description: 'Initial standardized laboratory SOP release. Standardized 3-point calibration protocol incorporated.',
      author: 'Markus Vance, Senior Lab Analyst',
      approvedBy: 'Dr. Sarah Chen, Director of Quality Assurance'
    }
  ],
  approvals: [
    {
      id: 'appr-1',
      role: 'Lead Author / Method Specialist',
      name: 'Markus Vance',
      title: 'Senior Analytical Chemist',
      signatureDate: '2026-03-18',
      status: 'Approved',
      comments: 'Protocol conforms with instrument specifications.'
    },
    {
      id: 'appr-2',
      role: 'Laboratory Operations Reviewer',
      name: 'Dr. Aris Thorne',
      title: 'Laboratory Operations Manager',
      signatureDate: '2026-03-19',
      status: 'Approved',
      comments: 'Reagents and reference buffer supplies verified in Core Suites.'
    },
    {
      id: 'appr-3',
      role: 'Quality Assurance Director',
      name: 'Dr. Sarah Chen',
      title: 'Director of Quality Assurance & Compliance',
      signatureDate: '2026-03-20',
      status: 'Approved',
      comments: 'Standardized slope limits and control check intervals established.'
    }
  ],
  assets: [],
  settings: {
    autoSave: true,
    strictNumbering: true,
    locale: 'en-US',
    activeTemplateId: 'corporate'
  }
};
