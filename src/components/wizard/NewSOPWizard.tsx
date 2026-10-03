import React, { useState } from 'react';
import { 
  ArrowLeft, ArrowRight, Check, Palette, FileText, 
  Building, Calendar, User, Shield, Layers, Sparkles 
} from 'lucide-react';
import { useSOP } from '../../state/documentContext';
import { TEMPLATE_STYLES, TEMPLATE_STYLE_LIST } from '../../templates/styles';
import { TemplateStyleId, SOPStatus, ConfidentialityLevel } from '../../types/document';
import { DEFAULT_SECTION_TEMPLATES } from '../../templates/defaultDocument';

export const NewSOPWizard: React.FC = () => {
  const { createNewDocument, setCurrentScreen } = useSOP();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Wizard State
  const [selectedTemplateId, setSelectedTemplateId] = useState<TemplateStyleId>('corporate');
  
  const now = new Date().toISOString().split('T')[0];
  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);
  const nextYearStr = nextYear.toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    title: '',
    sopNumber: `SOP-LAB-${Math.floor(100 + Math.random() * 900)}`,
    version: '1.0',
    department: 'Analytical Chemistry Core',
    author: '',
    approver: '',
    processOwner: '',
    effectiveDate: now,
    reviewDate: nextYearStr,
    status: 'Draft' as SOPStatus,
    confidentiality: 'Internal' as ConfidentialityLevel,
    organization: 'BioPharma Precision Technologies',
    location: 'Central Laboratory Complex - Room 204'
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleFieldChange = (field: string, val: string) => {
    setFormData(prev => ({ ...prev, [field]: val }));
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateStep2 = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.title.trim()) errors.title = 'Document Title is required.';
    if (!formData.sopNumber.trim()) errors.sopNumber = 'SOP Number is required.';
    if (!formData.version.trim()) errors.version = 'Version is required.';
    if (!formData.department.trim()) errors.department = 'Department is required.';
    if (!formData.author.trim()) errors.author = 'Author name is required.';
    if (!formData.approver.trim()) errors.approver = 'Approver name is required.';
    if (!formData.processOwner.trim()) errors.processOwner = 'Process Owner is required.';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateStep2()) {
        setCurrentStep(3);
      }
    }
  };

  const handleFinish = () => {
    createNewDocument({
      title: formData.title,
      sopNumber: formData.sopNumber,
      version: formData.version,
      department: formData.department,
      author: formData.author,
      approver: formData.approver,
      templateId: selectedTemplateId,
      metadata: {
        effectiveDate: formData.effectiveDate,
        reviewDate: formData.reviewDate,
        status: formData.status,
        confidentiality: formData.confidentiality,
        organization: formData.organization,
        location: formData.location,
        processOwner: formData.processOwner
      }
    });
  };

  const selectedTemplate = TEMPLATE_STYLES[selectedTemplateId];

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 py-10 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Wizard Progress Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-5">
          <div>
            <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider font-mono">
              Step {currentStep} of 3
            </span>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              {currentStep === 1 && 'Select Visual Template Style'}
              {currentStep === 2 && 'Enter SOP Metadata & Control Fields'}
              {currentStep === 3 && 'Confirm & Create Workspace'}
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setCurrentScreen('home')}
            className="text-xs text-slate-500 hover:text-slate-900 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>

        {/* Step Indicator Tabs */}
        <div className="grid grid-cols-3 gap-2 text-xs font-medium">
          <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${
            currentStep === 1 
              ? 'bg-blue-50 border-blue-300 text-blue-900' 
              : currentStep > 1 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                : 'bg-white border-slate-200 text-slate-400'
          }`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[11px] ${
              currentStep > 1 ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'
            }`}>
              {currentStep > 1 ? <Check className="w-3 h-3" /> : '1'}
            </span>
            <span>Template Style</span>
          </div>

          <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${
            currentStep === 2 
              ? 'bg-blue-50 border-blue-300 text-blue-900' 
              : currentStep > 2 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                : 'bg-white border-slate-200 text-slate-400'
          }`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[11px] ${
              currentStep > 2 ? 'bg-emerald-600 text-white' : currentStep === 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              {currentStep > 2 ? <Check className="w-3 h-3" /> : '2'}
            </span>
            <span>Document Control</span>
          </div>

          <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${
            currentStep === 3 
              ? 'bg-blue-50 border-blue-300 text-blue-900' 
              : 'bg-white border-slate-200 text-slate-400'
          }`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[11px] ${
              currentStep === 3 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              3
            </span>
            <span>Initialize SOP</span>
          </div>
        </div>

        {/* STEP 1: Template Selection */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500">
              Choose one of the 5 predefined visual styles. Each template defines typography hierarchy, table presentation, and header/footer styling while sharing the exact same underlying document structure.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TEMPLATE_STYLE_LIST.map((tmpl) => {
                const isSelected = selectedTemplateId === tmpl.id;
                return (
                  <div
                    key={tmpl.id}
                    onClick={() => setSelectedTemplateId(tmpl.id)}
                    className={`p-5 rounded-xl border-2 transition-all cursor-pointer relative bg-white flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-600 ring-2 ring-blue-600/20 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-bold text-slate-900">{tmpl.name}</h3>
                        <span 
                          className="w-4 h-4 rounded-full border border-slate-300 shrink-0" 
                          style={{ backgroundColor: tmpl.accentColor }} 
                          title="Theme Accent Color"
                        />
                      </div>
                      <p className="text-xs text-slate-600 font-medium mb-1">{tmpl.tagline}</p>
                      <p className="text-xs text-slate-500 leading-relaxed">{tmpl.description}</p>
                    </div>

                    {/* Miniature Document Style Preview Teaser */}
                    <div className="mt-4 p-3 bg-slate-50 rounded border border-slate-100 text-[11px] font-mono space-y-1">
                      <div className="flex items-center justify-between text-slate-400 text-[10px]">
                        <span>STYLE PREVIEW</span>
                        <span>{tmpl.id.toUpperCase()}</span>
                      </div>
                      <div className="h-2 w-24 rounded bg-slate-300" style={{ backgroundColor: tmpl.accentColor }} />
                      <div className="h-1.5 w-40 rounded bg-slate-200" />
                      <div className="h-1.5 w-32 rounded bg-slate-200" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: Metadata Entry */}
        {currentStep === 2 && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5 text-xs">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider font-mono">
                Mandatory Regulatory Metadata
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter primary document identifiers. These fields populate the document control header and cover page.
              </p>
            </div>

            {/* Title */}
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Document Title <span className="text-rose-500 font-bold">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                placeholder="e.g. Operation and Routine Maintenance of Laboratory Balance"
                className={`w-full px-3 py-2 bg-white border rounded text-slate-900 focus:outline-none focus:ring-1 ${
                  validationErrors.title ? 'border-rose-400 focus:ring-rose-500' : 'border-slate-300 focus:ring-blue-500'
                }`}
              />
              {validationErrors.title && (
                <p className="text-[11px] text-rose-600 mt-1">{validationErrors.title}</p>
              )}
            </div>

            {/* SOP Number & Version */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  SOP Number / Document ID <span className="text-rose-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  value={formData.sopNumber}
                  onChange={(e) => handleFieldChange('sopNumber', e.target.value)}
                  placeholder="SOP-LAB-002"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Version <span className="text-rose-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  value={formData.version}
                  onChange={(e) => handleFieldChange('version', e.target.value)}
                  placeholder="1.0"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Department & Process Owner */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Department <span className="text-rose-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => handleFieldChange('department', e.target.value)}
                  placeholder="Analytical Chemistry Core"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Process Owner <span className="text-rose-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  value={formData.processOwner}
                  onChange={(e) => handleFieldChange('processOwner', e.target.value)}
                  placeholder="Lead Metrology Specialist"
                  className={`w-full px-3 py-2 bg-white border rounded text-slate-900 focus:outline-none focus:ring-1 ${
                    validationErrors.processOwner ? 'border-rose-400 focus:ring-rose-500' : 'border-slate-300 focus:ring-blue-500'
                  }`}
                />
              </div>
            </div>

            {/* Author & Approver */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Author / Prepared By <span className="text-rose-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => handleFieldChange('author', e.target.value)}
                  placeholder="Senior Laboratory Analyst"
                  className={`w-full px-3 py-2 bg-white border rounded text-slate-900 focus:outline-none focus:ring-1 ${
                    validationErrors.author ? 'border-rose-400 focus:ring-rose-500' : 'border-slate-300 focus:ring-blue-500'
                  }`}
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Approver <span className="text-rose-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  value={formData.approver}
                  onChange={(e) => handleFieldChange('approver', e.target.value)}
                  placeholder="Director of Quality Control"
                  className={`w-full px-3 py-2 bg-white border rounded text-slate-900 focus:outline-none focus:ring-1 ${
                    validationErrors.approver ? 'border-rose-400 focus:ring-rose-500' : 'border-slate-300 focus:ring-blue-500'
                  }`}
                />
              </div>
            </div>

            {/* Dates & Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Effective Date</label>
                <input
                  type="date"
                  value={formData.effectiveDate}
                  onChange={(e) => handleFieldChange('effectiveDate', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded font-mono text-slate-900"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Review Date</label>
                <input
                  type="date"
                  value={formData.reviewDate}
                  onChange={(e) => handleFieldChange('reviewDate', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded font-mono text-slate-900"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Initial Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleFieldChange('status', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-900"
                >
                  <option value="Draft">Draft</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Approved">Approved</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Confirmation Summary */}
        {currentStep === 3 && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6 text-xs">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider font-mono">
                Document Configuration Review
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Your new Standard Operating Procedure will be initialized with the selected theme and the 16 regulatory default sections.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-400 font-mono text-[11px]">TITLE</span>
                <p className="font-semibold text-slate-900 text-sm">{formData.title}</p>
              </div>
              <div>
                <span className="text-slate-400 font-mono text-[11px]">SOP NUMBER & VERSION</span>
                <p className="font-mono font-semibold text-slate-900">{formData.sopNumber} (v{formData.version})</p>
              </div>
              <div>
                <span className="text-slate-400 font-mono text-[11px]">DEPARTMENT & OWNER</span>
                <p className="text-slate-800">{formData.department} · {formData.processOwner}</p>
              </div>
              <div>
                <span className="text-slate-400 font-mono text-[11px]">VISUAL TEMPLATE</span>
                <p className="font-semibold text-blue-700">{selectedTemplate.name}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-800 mb-2 font-mono text-[11px] uppercase tracking-wider">
                16 Pre-Populated Structural Sections:
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] text-slate-600 font-mono">
                {DEFAULT_SECTION_TEMPLATES.map((s) => (
                  <div key={s.number} className="p-1.5 bg-slate-50 rounded border border-slate-200 truncate">
                    <span className="font-semibold text-slate-800 mr-1">{s.number}</span>
                    <span>{s.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((currentStep - 1) as any)}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous Step</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-sm"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Create Workspace</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
