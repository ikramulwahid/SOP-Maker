import React, { useState } from 'react';
import { 
  FileText, Shield, UserCheck, Calendar, 
  Building2, CheckCircle, AlertTriangle, ChevronDown, ChevronUp,
  Tag, Info
} from 'lucide-react';
import { useSOP } from '../../state/documentContext';
import { SOPStatus, ConfidentialityLevel } from '../../types/document';
import { validationEngine } from '../../validation/rules';

export const MetadataPanel: React.FC = () => {
  const { document: doc, updateMetadata } = useSOP();
  const [showOptionalFields, setShowOptionalFields] = useState(false);

  const validationResult = validationEngine.validate(doc);
  const meta = doc.metadata;

  const handleTextChange = (field: keyof typeof meta, value: string) => {
    updateMetadata({ [field]: value });
  };

  return (
    <aside className="w-full h-full flex flex-col bg-slate-50 border-l border-slate-200 overflow-y-auto">
      {/* Panel Header */}
      <div className="p-3.5 border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-800 tracking-wider uppercase font-mono">
            Document Properties
          </span>
          <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-semibold ${
            validationResult.isValid 
              ? 'bg-emerald-100 text-emerald-800' 
              : 'bg-amber-100 text-amber-800'
          }`}>
            {validationResult.completionPercentage}% Complete
          </span>
        </div>

        {/* Validation Summary Bar */}
        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${
              validationResult.completionPercentage === 100 
                ? 'bg-emerald-500' 
                : validationResult.completionPercentage > 60 
                  ? 'bg-blue-500' 
                  : 'bg-amber-500'
            }`}
            style={{ width: `${validationResult.completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Form Content */}
      <div className="p-4 space-y-4 text-xs">
        {/* Required Fields Notice */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pb-1">
          <span className="text-rose-500 font-bold">*</span>
          <span>Indicates mandatory document control field</span>
        </div>

        {/* Title */}
        <div>
          <label className="block font-medium text-slate-700 mb-1">
            Document Title <span className="text-rose-500 font-bold">*</span>
          </label>
          <input
            type="text"
            value={meta.title}
            onChange={(e) => handleTextChange('title', e.target.value)}
            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g. Operation of Laboratory pH Meter"
          />
        </div>

        {/* SOP Number & Version */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              SOP Number <span className="text-rose-500 font-bold">*</span>
            </label>
            <input
              type="text"
              value={meta.sopNumber}
              onChange={(e) => handleTextChange('sopNumber', e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="SOP-LAB-001"
            />
          </div>
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Version <span className="text-rose-500 font-bold">*</span>
            </label>
            <input
              type="text"
              value={meta.version}
              onChange={(e) => handleTextChange('version', e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="1.0"
            />
          </div>
        </div>

        {/* Status & Confidentiality */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Status <span className="text-rose-500 font-bold">*</span>
            </label>
            <select
              value={meta.status}
              onChange={(e) => handleTextChange('status', e.target.value as SOPStatus)}
              className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="Draft">Draft</option>
              <option value="Under Review">Under Review</option>
              <option value="Approved">Approved</option>
              <option value="Obsolete">Obsolete</option>
            </select>
          </div>
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Confidentiality <span className="text-rose-500 font-bold">*</span>
            </label>
            <select
              value={meta.confidentiality}
              onChange={(e) => handleTextChange('confidentiality', e.target.value as ConfidentialityLevel)}
              className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="Internal">Internal</option>
              <option value="Confidential">Confidential</option>
              <option value="Restricted">Restricted</option>
              <option value="Public">Public</option>
            </select>
          </div>
        </div>

        {/* Department & Process Owner */}
        <div>
          <label className="block font-medium text-slate-700 mb-1">
            Department <span className="text-rose-500 font-bold">*</span>
          </label>
          <input
            type="text"
            value={meta.department}
            onChange={(e) => handleTextChange('department', e.target.value)}
            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Analytical Chemistry Core"
          />
        </div>

        <div>
          <label className="block font-medium text-slate-700 mb-1">
            Process Owner <span className="text-rose-500 font-bold">*</span>
          </label>
          <input
            type="text"
            value={meta.processOwner}
            onChange={(e) => handleTextChange('processOwner', e.target.value)}
            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Lead Chemist / Specialist"
          />
        </div>

        {/* Author & Approver */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Author <span className="text-rose-500 font-bold">*</span>
            </label>
            <input
              type="text"
              value={meta.author}
              onChange={(e) => handleTextChange('author', e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Author Name"
            />
          </div>
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Approver <span className="text-rose-500 font-bold">*</span>
            </label>
            <input
              type="text"
              value={meta.approver}
              onChange={(e) => handleTextChange('approver', e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="QA Manager"
            />
          </div>
        </div>

        {/* Effective Date & Review Date */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Effective Date <span className="text-rose-500 font-bold">*</span>
            </label>
            <input
              type="date"
              value={meta.effectiveDate}
              onChange={(e) => handleTextChange('effectiveDate', e.target.value)}
              className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-[11px]"
            />
          </div>
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Review Date <span className="text-rose-500 font-bold">*</span>
            </label>
            <input
              type="date"
              value={meta.reviewDate}
              onChange={(e) => handleTextChange('reviewDate', e.target.value)}
              className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-[11px]"
            />
          </div>
        </div>

        {/* Collapsible Optional Metadata Fields */}
        <div className="pt-2 border-t border-slate-200">
          <button
            type="button"
            onClick={() => setShowOptionalFields(!showOptionalFields)}
            className="flex items-center justify-between w-full py-1 text-slate-700 hover:text-slate-900 font-medium"
          >
            <span>Additional Organizational Fields</span>
            {showOptionalFields ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showOptionalFields && (
            <div className="mt-3 space-y-3 pl-1 border-l-2 border-slate-200">
              <div>
                <label className="block font-medium text-slate-600 mb-1">Organization</label>
                <input
                  type="text"
                  value={meta.organization || ''}
                  onChange={(e) => handleTextChange('organization', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-900"
                  placeholder="Organization or Company Name"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-600 mb-1">Facility / Location</label>
                <input
                  type="text"
                  value={meta.location || ''}
                  onChange={(e) => handleTextChange('location', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-900"
                  placeholder="Building C, Suite 304"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-600 mb-1">Category</label>
                <input
                  type="text"
                  value={meta.category || ''}
                  onChange={(e) => handleTextChange('category', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-900"
                  placeholder="e.g. Analytical Instrumentation"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-600 mb-1">Document Owner</label>
                <input
                  type="text"
                  value={meta.documentOwner || ''}
                  onChange={(e) => handleTextChange('documentOwner', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-900"
                  placeholder="Quality Assurance Unit"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-600 mb-1">Reviewed By</label>
                <input
                  type="text"
                  value={meta.reviewedBy || ''}
                  onChange={(e) => handleTextChange('reviewedBy', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-900"
                  placeholder="Technical Reviewer"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-600 mb-1">Approved By</label>
                <input
                  type="text"
                  value={meta.approvedBy || ''}
                  onChange={(e) => handleTextChange('approvedBy', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-900"
                  placeholder="Director of Compliance"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-600 mb-1">Revision Summary</label>
                <textarea
                  rows={2}
                  value={meta.revisionSummary || ''}
                  onChange={(e) => handleTextChange('revisionSummary', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-900"
                  placeholder="Brief change justification notes..."
                />
              </div>
            </div>
          )}
        </div>

        {/* Validation Issues Alert if Any */}
        {validationResult.errors.length > 0 && (
          <div className="p-2.5 bg-rose-50 border border-rose-200 rounded text-[11px] text-rose-800 space-y-1">
            <div className="flex items-center gap-1 font-semibold text-rose-900">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>Validation Attention Required</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-rose-700">
              {validationResult.errors.slice(0, 3).map((err, i) => (
                <li key={i}>{err.message}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </aside>
  );
};
