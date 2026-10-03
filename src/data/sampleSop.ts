import { SOPDocument } from '../types/document';
import { TEMPLATE_STYLES } from '../templates/styles';

/**
 * Realistic demonstration laboratory SOP data.
 * Notice: This procedure contains simulated demonstration data for software demonstration purposes only.
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
      'USP <791> pH Determination',
      'ASTM D1293-18 Standard Test Methods for pH of Water',
      'ISO/IEC 17025:2017 Competence of Testing and Calibration Laboratories',
      'Manufacturer Instrument Manual (Orion Star A211 Benchtop pH Meter)'
    ]
  },
  branding: {
    companyName: 'BioPharma Precision Technologies',
    facilityName: 'Analytical Chemistry Core — Building C',
    departmentCode: 'ANL-CHEM-01',
    headerText: 'DEMONSTRATION SAMPLE SOP — CONTROLLED LABORATORY DOCUMENT',
    footerText: 'SOP-LAB-001 Rev 1.0 · For Demonstration and Validation Purposes Only · Uncontrolled if Printed'
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
      content: `<p><strong>Notice:</strong> This document contains fictional sample data configured for demonstration of SOPStudio authoring, formatting, and document control systems. It does not constitute an officially authorized clinical or pharmaceutical directive.</p>
<p>This Standard Operating Procedure establishes standardized instructions for the calibration, routine operation, and maintenance of benchtop glass combination electrode pH meters within the Analytical Chemistry Core.</p>`
    },
    {
      id: 'sec-2',
      number: '2.0',
      title: 'Purpose',
      isMandatory: true,
      category: 'admin',
      content: `<p>The purpose of this procedure is to ensure precise, accurate, and reproducible electrochemical pH measurements across all aqueous reagent formulations, mobile phases, and sample matrices.</p>
<p>Adherence to this protocol maintains traceability in accordance with Good Laboratory Practice (GLP) and ISO/IEC 17025 accreditation standards.</p>`
    },
    {
      id: 'sec-3',
      number: '3.0',
      title: 'Scope',
      isMandatory: true,
      category: 'admin',
      content: `<p>This procedure applies to all analytical chemists, research technicians, and quality control analysts operating benchtop pH meters (specifically Thermo Orion Star A211 and equivalent dual-junction models) in Laboratory Suites C-302, C-304, and C-310.</p>
<p>It encompasses routine daily calibrations, sample determinations, electrode hydration routines, and monthly preventive electrolyte replenishment.</p>`
    },
    {
      id: 'sec-4',
      number: '4.0',
      title: 'Responsibilities',
      isMandatory: true,
      category: 'governance',
      content: `<ul>
<li><strong>Laboratory Analysts:</strong> Perform daily 3-point calibration, log calibration slopes, execute sample measurements, and thoroughly rinse the electrode between runs.</li>
<li><strong>Lead Chemist / Process Owner:</strong> Monitor slope drift trends, ensure availability of fresh NIST-traceable calibration standards, and supervise monthly maintenance routines.</li>
<li><strong>Quality Assurance Unit:</strong> Conduct periodic logbook audits, verify annual calibration certification, and review out-of-specification (OOS) reports.</li>
</ul>`
    },
    {
      id: 'sec-5',
      number: '5.0',
      title: 'Definitions',
      isMandatory: false,
      category: 'admin',
      content: `<ul>
<li><strong>Nernstian Slope:</strong> The theoretical potential change of 59.16 mV per pH unit change at 25.0 °C. Acceptable laboratory slope must fall between 95.0% and 105.0% (56.2 mV/pH to 62.1 mV/pH).</li>
<li><strong>ATC (Automatic Temperature Compensation):</strong> System probe compensating the millivolt output calculation for temperature variations between standards and analytes.</li>
<li><strong>Electrode Drift:</strong> Continuous change in pH readout exceeding ±0.02 pH units over a 60-second stabilization window.</li>
<li><strong>Combination Electrode:</strong> A sensor housing both the glass measuring half-cell and the silver/silver chloride (Ag/AgCl) reference half-cell in a single probe body.</li>
</ul>`
    },
    {
      id: 'sec-6',
      number: '6.0',
      title: 'Prerequisites',
      isMandatory: false,
      category: 'procedural',
      content: `<ul>
<li>All analysts must have completed GLP General Analytical Instrumentation Module (TRN-GLP-202).</li>
<li>Verify the instrument is powered on and stabilized for at least 15 minutes before executing calibration.</li>
<li>Ensure the room temperature is maintained within the calibrated ambient envelope: 20.0 °C to 25.0 °C with relative humidity below 70%.</li>
</ul>`
    },
    {
      id: 'sec-7',
      number: '7.0',
      title: 'Required Materials / Tools',
      isMandatory: true,
      category: 'procedural',
      content: `<ul>
<li>Thermo Scientific Orion Star A211 Benchtop pH/mV Meter with 8157BNUMD Ross Ultra pH/ATC Triode.</li>
<li>NIST-traceable certified buffer solutions: pH 4.01 (Red), pH 7.00 (Yellow), and pH 10.01 (Blue).</li>
<li>Electrode storage solution: 3.0 M Potassium Chloride (KCl) reference filling solution.</li>
<li>Grade 1 Type I Ultrapure Reagent Water (Resistivity ≥ 18.2 MΩ·cm at 25 °C).</li>
<li>Lint-free precision laboratory task wipes (Kimwipes).</li>
<li>Clean 50 mL borosilicate glass beakers and PTFE-coated magnetic stir bars with low-heat magnetic stirrer.</li>
</ul>`
    },
    {
      id: 'sec-8',
      number: '8.0',
      title: 'Safety / Precautions',
      isMandatory: true,
      category: 'safety',
      content: `<p><strong>Mandatory PPE:</strong> Standard laboratory coat, nitrile chemical-resistant gloves (minimum 4 mil thickness), and ANSI Z87.1 certified safety glasses are required at all times.</p>
<ul>
<li><strong>Chemical Hazards:</strong> Buffer solutions and KCl electrolyte are mild skin and eye irritants. If contact occurs, flush immediately with copious clean water for 15 minutes.</li>
<li><strong>Electrode Fragility:</strong> The glass bulb at the tip of the electrode is delicate. Never touch the bulb to beaker walls or drop magnetic stir bars onto the sensor tip.</li>
<li><strong>Wiping Restriction:</strong> <em>Never rub or vigorously wipe the glass bulb.</em> Electrostatic charges generated by rubbing cause substantial reading instability. Only blot gently with lint-free wipes.</li>
</ul>`
    },
    {
      id: 'sec-9',
      number: '9.0',
      title: 'Procedure',
      isMandatory: true,
      category: 'procedural',
      content: `<h3>9.1 Instrument Preparation</h3>
<ol>
<li>Carefully remove the protective storage bottle from the electrode tip.</li>
<li>Slide down the rubber sleeve covering the reference fill hole to expose the internal electrolyte reservoir.</li>
<li>Verify that the internal reference electrolyte level is at least 2.5 cm above the external liquid measurement level.</li>
<li>Rinse the electrode tip thoroughly using a stream of Type I ultrapure water from a wash bottle. Gently blot excess water droplets using a fresh lint-free wipe.</li>
</ol>

<h3>9.2 Three-Point Calibration Protocol</h3>
<ol>
<li>Dispense approximately 30 mL of fresh buffer solutions (pH 7.00, pH 4.01, and pH 10.01) into three designated, clean 50 mL beakers.</li>
<li>Press the <strong>CALIBRATE</strong> button on the instrument console.</li>
<li>Immerse the electrode and ATC temperature probe into the <strong>pH 7.00 buffer</strong>. Ensure the stir bar is rotating at a gentle, steady pace without creating a deep vortex.</li>
<li>Wait for the reading stability indicator (&radic;) to freeze on screen. Confirm the measured value matches pH 7.00 ± 0.02 at current buffer temperature.</li>
<li>Press <strong>NEXT</strong> to record the midpoint calibration point.</li>
<li>Lift the electrode, rinse generously with Type I water, blot dry, and place into the <strong>pH 4.01 buffer</strong>. Repeat the stabilization and acceptance step.</li>
<li>Rinse once again and repeat calibration in the <strong>pH 10.01 buffer</strong>.</li>
<li>Press <strong>DONE / MEASURE</strong>. Record the displayed slope percentage in the equipment logbook.</li>
</ol>

<h3>9.3 Sample Measurement</h3>
<ol>
<li>Pour 30–50 mL of homogeneous sample solution into a clean beaker.</li>
<li>Verify sample temperature is recorded and equilibrates within ±2.0 °C of calibration buffers.</li>
<li>Immerse the electrode until the ceramic junction is fully submerged.</li>
<li>Allow the stability indicator to lock (typically 30–60 seconds). Record the pH reading to two decimal places (0.01 pH unit) in the primary test record.</li>
<li>Between consecutive samples, rinse the electrode three times with Type I water.</li>
</ol>`
    },
    {
      id: 'sec-10',
      number: '10.0',
      title: 'Process Flow',
      isMandatory: false,
      category: 'procedural',
      content: `<p><strong>Sequential Operational Flow:</strong></p>
<p>Uncap & Uncover Fill Hole &rarr; Inspect Electrolyte Level &rarr; Rinse with Type I H₂O &rarr; Calibrate at pH 7.00 &rarr; Calibrate at pH 4.01 &rarr; Calibrate at pH 10.01 &rarr; Verify Slope (95%–105%) &rarr; Measure Analytes &rarr; Flush & Store in 3.0 M KCl &rarr; Reseal Fill Hole Sleeve.</p>`
    },
    {
      id: 'sec-11',
      number: '11.0',
      title: 'Troubleshooting',
      isMandatory: false,
      category: 'quality',
      content: `<ul>
<li><strong>Slope Out of Specification (&lt;95% or &gt;105%):</strong> Replace calibration buffer aliquots with fresh solutions from sealed stock bottles. If slope remains invalid, soak electrode in 0.1 M HCl cleaning solution for 15 minutes followed by 2 hours in 3 M KCl storage solution.</li>
<li><strong>Sluggish Response (&gt;90 seconds to stabilize):</strong> Check ceramic junction for protein or particulate fouling. Perform deep enzyme cleaning or junction rinse.</li>
<li><strong>Drifting / Fluctuating Readings:</strong> Verify the fill hole sleeve is open. Replenish depleted 3.0 M KCl electrolyte. Ensure magnetic stir motor is not transmitting heat to the solution.</li>
</ul>`
    },
    {
      id: 'sec-12',
      number: '12.0',
      title: 'Quality Checks',
      isMandatory: true,
      category: 'quality',
      content: `<ul>
<li><strong>Slope Acceptance Criterion:</strong> The calibrated slope must read between <strong>95.0% and 105.0%</strong>. Any reading outside this band triggers immediate recalibration and lockout from sample testing.</li>
<li><strong>Mid-Run Control Check:</strong> Every 10 sample runs, or at the conclusion of a sample batch, re-read the pH 7.00 buffer standard as an unknown control. The measured value must fall within <strong>±0.05 pH units</strong> of nominal value.</li>
<li><strong>Calibration Expiry:</strong> Calibrations remain valid for a maximum duration of 8 continuous operational hours. A new calibration must be executed at the start of every operational shift.</li>
</ul>`
    },
    {
      id: 'sec-13',
      number: '13.0',
      title: 'References',
      isMandatory: false,
      category: 'governance',
      content: `<ul>
<li>United States Pharmacopeia (USP) General Chapter &lt;791&gt; pH Determination.</li>
<li>ASTM International Standard D1293-18: Standard Test Methods for pH of Water.</li>
<li>ISO/IEC 17025:2017 General Requirements for the Competence of Testing and Calibration Laboratories.</li>
<li>Corporate Quality Manual: Section 6.4 Equipment Calibration and Traceability.</li>
</ul>`
    },
    {
      id: 'sec-14',
      number: '14.0',
      title: 'Records / Documentation',
      isMandatory: true,
      category: 'governance',
      content: `<ul>
<li>All calibration slopes, temperatures, technician initials, and buffer lot numbers must be documented in Equipment Logbook <strong>LOG-EQ-PH-004</strong> immediately upon completion.</li>
<li>Retain physical instrument printouts or signed electronic log entries for a minimum retention window of 7 years in compliance with 21 CFR Part 11 and corporate archive guidelines.</li>
<li>Any out-of-specification calibration failures must be logged in the Non-Conformance Tracking Register within 24 hours.</li>
</ul>`
    },
    {
      id: 'sec-15',
      number: '15.0',
      title: 'Revision History',
      isMandatory: true,
      category: 'governance',
      content: `<p>Historical revision documentation for SOP-LAB-001:</p>
<ul>
<li><strong>Rev 1.0 (2026-04-01):</strong> Initial standardized release under BioPharma Precision Technologies document management architecture. Replaced informal bench guidelines. Author: Markus Vance. Approved by: Dr. Sarah Chen.</li>
</ul>`
    },
    {
      id: 'sec-16',
      number: '16.0',
      title: 'Approval',
      isMandatory: true,
      category: 'governance',
      content: `<p>By signing below, the author, technical reviewer, and quality assurance authority certify that this Standard Operating Procedure has been evaluated for operational validity, safety compliance, and regulatory adherence.</p>`
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
      comments: 'Protocol conforms with instrument specifications and GLP guidelines.'
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
      comments: 'Full audit authorization granted. Standardized slope limits established.'
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
