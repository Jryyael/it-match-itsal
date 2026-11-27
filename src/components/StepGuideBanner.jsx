import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function StepGuideBanner({ steps = [] }) {
  if (!steps.length) return null;

  return (
    <div className="rounded-3xl border border-[#E2E8F0] bg-white px-5 py-3 shadow-2xs">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        {steps.map((text, idx) => (
          <React.Fragment key={idx}>
            <div className="flex items-center gap-2.5 text-xs">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0D2240] text-[11px] font-extrabold text-[#009FE3]">
                {idx + 1}
              </span>
              <span className="font-semibold text-[#0D2240] leading-snug">{text}</span>
            </div>
            {idx < steps.length - 1 && (
              <ArrowRight className="hidden h-4 w-4 shrink-0 text-[#D99B16] md:block" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
