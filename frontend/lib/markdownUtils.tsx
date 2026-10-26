import React from "react";

export function renderMarkdown(content: string) {
  if (!content) return null;

  const lines = content.split("\n");

  const renderInline = (str: string): React.ReactNode[] => {
    const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
    const parts = str.split(regex);

    return parts.map((part, idx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={idx} className="font-semibold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("*") && part.endsWith("*")) {
        return (
          <em key={idx} className="italic text-slate-700">
            {part.slice(1, -1)}
          </em>
        );
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={idx}
            className="px-1 py-0.5 rounded bg-slate-100 font-mono text-[11px] text-blue-700 border border-slate-200"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div className="space-y-1.5 leading-relaxed text-xs text-slate-800">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-1.5">
              <span className="text-slate-400 mt-1 select-none text-[8px] flex-shrink-0">•</span>
              <span className="flex-1">{renderInline(trimmed.slice(2))}</span>
            </div>
          );
        }
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-1.5">
              <span className="text-slate-500 font-semibold select-none text-[10.5px] tabular-nums mt-0.5 flex-shrink-0">
                {numMatch[1]}.
              </span>
              <span className="flex-1">{renderInline(numMatch[2])}</span>
            </div>
          );
        }
        return (
          <p key={idx} className="leading-relaxed">
            {renderInline(line)}
          </p>
        );
      })}
    </div>
  );
}
