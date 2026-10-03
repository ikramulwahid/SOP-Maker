import React from 'react';
import { useSOP } from '../../state/documentContext';
import { TemplateStyleId } from '../../types/document';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export const SOPPreview: React.FC = () => {
  const { document: doc, selectSection } = useSOP();
  const { metadata, branding, style, sections, revisionHistory, approvals } = doc;

  const getHeadingContainerClass = (styleId: TemplateStyleId) => {
    switch (styleId) {
      case 'industrial':
        return 'bg-slate-900 text-white px-3 py-1.5 rounded-none font-sans font-bold uppercase tracking-wider text-sm my-4 border-l-4 border-amber-500 flex items-center justify-between';
      case 'compliance':
        return 'border-b-2 border-emerald-700 pb-1 font-sans font-bold text-emerald-950 text-base my-5 flex items-center justify-between tracking-tight';
      case 'minimal':
        return 'border-b border-slate-200 pb-1 font-serif text-slate-800 text-lg my-6 flex items-center justify-between font-normal';
      case 'technical':
        return 'border-b border-sky-600 pb-1 text-sky-900 font-sans font-semibold text-base my-4 flex items-center justify-between tracking-tight';
      case 'corporate':
      default:
        return 'border-l-4 border-blue-600 pl-3 py-0.5 bg-blue-50/50 text-blue-950 font-sans font-bold text-base my-4 flex items-center justify-between';
    }
  };

  const getTableHeadClass = (styleId: TemplateStyleId) => {
    switch (styleId) {
      case 'industrial':
        return 'bg-slate-900 text-amber-400 font-mono text-xs uppercase';
      case 'compliance':
        return 'bg-emerald-900 text-emerald-50 font-sans text-xs font-semibold';
      case 'minimal':
        return 'bg-slate-100 text-slate-700 font-serif text-xs font-medium';
      case 'technical':
        return 'bg-slate-800 text-sky-200 font-mono text-xs';
      case 'corporate':
      default:
        return 'bg-blue-900 text-white font-sans text-xs font-semibold';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'text-emerald-700 bg-emerald-50 border border-emerald-300';
      case 'Under Review':
        return 'text-blue-700 bg-blue-50 border border-blue-300';
      case 'Obsolete':
        return 'text-rose-700 bg-rose-50 border border-rose-300';
      case 'Draft':
      default:
        return 'text-amber-700 bg-amber-50 border border-amber-300';
    }
  };

  return (
    <div className="w-full flex justify-center py-6 px-2 overflow-y-auto">
      {/* A4 Paper Canvas Metaphor */}
      <article
        id="sop-printable-sheet"
        className="w-full max-w-[820px] min-h-[1160px] bg-white shadow-xl rounded-sm border border-slate-300 flex flex-col justify-between transition-all duration-200 print:shadow-none print:border-none print:m-0 print:w-full print:max-w-none text-slate-900 leading-relaxed font-sans"
        style={{
          padding: `${doc.pageSetup.margins.top}mm ${doc.pageSetup.margins.right}mm ${doc.pageSetup.margins.bottom}mm ${doc.pageSetup.margins.left}mm`
        }}
      >
        <div>
          {/* Running Document Header */}
          <header className="border-b-2 pb-3 mb-6 flex items-start justify-between gap-4 border-slate-800">
            <div className="flex-1">
              <div className="text-[11px] font-mono tracking-wider uppercase text-slate-500">
                {branding.companyName}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                {branding.facilityName || 'Laboratory Systems Core'}
              </div>
            </div>

            <div className="text-right">
              <div className="font-mono text-sm font-bold text-slate-900">
                {metadata.sopNumber || 'SOP-UNASSIGNED'}
              </div>
              <div className="text-[11px] font-mono text-slate-500">
                Version {metadata.version} · {metadata.status}
              </div>
            </div>
          </header>

          {/* SOP Document Title Banner */}
          <section className="text-center py-4 mb-6 border-y border-slate-200 bg-slate-50/60">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight max-w-xl mx-auto">
              {metadata.title}
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              Controlled Standard Operating Procedure
            </p>
          </section>

          {/* Document Control Summary Table */}
          <section className="mb-6">
            <table className="w-full text-xs border-collapse border border-slate-300">
              <thead>
                <tr className={getTableHeadClass(style.id)}>
                  <th colSpan={4} className="py-1.5 px-3 text-left uppercase tracking-wider font-mono">
                    Document Control & Administration
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                <tr>
                  <td className="w-1/4 py-1.5 px-3 bg-slate-100 font-semibold border-r border-slate-200">Document ID</td>
                  <td className="w-1/4 py-1.5 px-3 font-mono font-medium border-r border-slate-200">{metadata.sopNumber}</td>
                  <td className="w-1/4 py-1.5 px-3 bg-slate-100 font-semibold border-r border-slate-200">Version</td>
                  <td className="w-1/4 py-1.5 px-3 font-mono font-medium">{metadata.version}</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-3 bg-slate-100 font-semibold border-r border-slate-200">Department</td>
                  <td className="py-1.5 px-3 border-r border-slate-200">{metadata.department}</td>
                  <td className="py-1.5 px-3 bg-slate-100 font-semibold border-r border-slate-200">Status</td>
                  <td className="py-1.5 px-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${getStatusBadge(metadata.status)}`}>
                      {metadata.status}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-1.5 px-3 bg-slate-100 font-semibold border-r border-slate-200">Effective Date</td>
                  <td className="py-1.5 px-3 font-mono border-r border-slate-200">{metadata.effectiveDate || '—'}</td>
                  <td className="py-1.5 px-3 bg-slate-100 font-semibold border-r border-slate-200">Review Date</td>
                  <td className="py-1.5 px-3 font-mono">{metadata.reviewDate || '—'}</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-3 bg-slate-100 font-semibold border-r border-slate-200">Author</td>
                  <td className="py-1.5 px-3 border-r border-slate-200">{metadata.author}</td>
                  <td className="py-1.5 px-3 bg-slate-100 font-semibold border-r border-slate-200">Approver</td>
                  <td className="py-1.5 px-3">{metadata.approver}</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-3 bg-slate-100 font-semibold border-r border-slate-200">Confidentiality</td>
                  <td className="py-1.5 px-3 border-r border-slate-200">{metadata.confidentiality}</td>
                  <td className="py-1.5 px-3 bg-slate-100 font-semibold border-r border-slate-200">Process Owner</td>
                  <td className="py-1.5 px-3">{metadata.processOwner}</td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* Structured Document Sections */}
          <main className="space-y-6">
            {sections.map((section) => (
              <section 
                key={section.id} 
                id={`preview-sec-${section.id}`}
                className="group relative cursor-pointer"
                onClick={() => selectSection(section.id)}
              >
                {/* Heading */}
                <div className={getHeadingContainerClass(style.id)}>
                  <span>
                    <span className="font-mono mr-2">{section.number}</span>
                    {section.title}
                  </span>
                  <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity font-mono font-normal">
                    Click to edit
                  </span>
                </div>

                {/* Content Rendered */}
                <div 
                  className="prose prose-slate prose-sm max-w-none text-slate-800 leading-relaxed pl-1"
                  dangerouslySetInnerHTML={{ __html: section.content || '<p class="text-slate-400 italic">No content recorded for this section.</p>' }}
                />
              </section>
            ))}
          </main>

          {/* Formal Revision History Table */}
          <section className="mt-8 pt-4">
            <h2 className={getHeadingContainerClass(style.id)}>
              <span>Historical Revision Record</span>
            </h2>
            <table className="w-full text-xs border border-slate-300 border-collapse mt-2">
              <thead>
                <tr className={getTableHeadClass(style.id)}>
                  <th className="py-1.5 px-2 text-left w-16 font-mono">Rev</th>
                  <th className="py-1.5 px-2 text-left w-24 font-mono">Date</th>
                  <th className="py-1.5 px-2 text-left">Description of Change</th>
                  <th className="py-1.5 px-2 text-left w-36">Author</th>
                  <th className="py-1.5 px-2 text-left w-36">Approved By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {revisionHistory.length > 0 ? (
                  revisionHistory.map((rev) => (
                    <tr key={rev.id} className="hover:bg-slate-50">
                      <td className="py-1.5 px-2 font-mono font-semibold">{rev.revision}</td>
                      <td className="py-1.5 px-2 font-mono text-slate-600">{rev.date}</td>
                      <td className="py-1.5 px-2">{rev.description}</td>
                      <td className="py-1.5 px-2">{rev.author}</td>
                      <td className="py-1.5 px-2">{rev.approvedBy}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-2 text-center text-slate-400 italic">No revisions logged.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>

          {/* Formal Approval Signatures Block */}
          <section className="mt-8 pt-4">
            <h2 className={getHeadingContainerClass(style.id)}>
              <span>Document Authorization & Signatures</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
              {approvals.map((appr) => (
                <div key={appr.id} className="p-3 border border-slate-300 rounded bg-slate-50/70 text-xs">
                  <div className="font-semibold text-slate-900">{appr.role}</div>
                  <div className="text-slate-600 mt-1">{appr.name}</div>
                  <div className="text-[11px] text-slate-500">{appr.title}</div>
                  
                  <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Status:</span>
                    <span className={`font-mono font-medium flex items-center gap-1 ${
                      appr.status === 'Approved' ? 'text-emerald-700' : 'text-amber-700'
                    }`}>
                      {appr.status === 'Approved' ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Clock className="w-3 h-3 text-amber-600" />
                      )}
                      {appr.status}
                    </span>
                  </div>
                  {appr.signatureDate && (
                    <div className="text-[10px] text-slate-400 font-mono mt-1 text-right">
                      Date: {appr.signatureDate}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Running Document Footer */}
        <footer className="mt-12 pt-3 border-t border-slate-300 text-[10px] text-slate-500 flex items-center justify-between font-mono">
          <div>
            {branding.footerText}
          </div>
          <div className="tabular-nums">
            {metadata.sopNumber} · Page 1 of 1
          </div>
        </footer>
      </article>
    </div>
  );
};
