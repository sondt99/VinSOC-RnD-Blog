"use client";

import { useState } from "react";

interface CopyButtonProps {
  code: string;
}

export function CopyButton({ code }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      aria-label="Copy code"
      className="absolute top-3 right-3 px-2 py-1 rounded text-[10px] tracking-wider uppercase transition-all duration-150"
      style={{
        fontFamily: "var(--font-display)",
        background: copied ? "var(--accent-red)" : "var(--surface-muted)",
        color: copied ? "white" : "var(--muted)",
        border: "1px solid var(--line)",
      }}
    >
      {copied ? "COPIED" : "COPY"}
    </button>
  );
}
