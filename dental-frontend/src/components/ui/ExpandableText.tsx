"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

interface ExpandableTextProps {
  text: string;
  /** Number of lines to clamp before expanding. Default: 3 */
  lineClamp?: number;
  /** Button label when collapsed. Default: "Read more" */
  expandLabel?: string;
  /** Button label when expanded. Default: "Show less" */
  collapseLabel?: string;
  /** Optional className for the wrapper div */
  className?: string;
  /** Optional callback for when expansion state changes */
  onExpandedChange?: (expanded: boolean) => void;
}

const ExpandableText = ({
  text,
  lineClamp = 3,
  expandLabel = "Read more",
  collapseLabel = "Show less",
  className = "",
  onExpandedChange,
}: ExpandableTextProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (el) setIsTruncated(el.scrollHeight > el.clientHeight + 1);
  }, [text]);

  const handleToggle = () => {
    const nextState = !isExpanded;
    setIsExpanded(nextState);
    if (onExpandedChange) {
      onExpandedChange(nextState);
    }
  };

  return (
    <div className={className}>
      <p
        ref={textRef}
        style={
          !isExpanded
            ? {
                WebkitLineClamp: lineClamp,
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }
            : undefined
        }
        className="text-sm sm:text-base md:text-lg text-foreground-secondary leading-relaxed transition-all duration-500"
      >
        {text}
      </p>
      {(isTruncated || isExpanded) && (
        <button
          onClick={handleToggle}
          className="mt-3 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-primary-600 hover:text-primary-700 transition-colors"
        >
          {isExpanded ? collapseLabel : expandLabel}
          <ChevronDown
            size={13}
            strokeWidth={3}
            className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
          />
        </button>
      )}
    </div>
  );
};

export default ExpandableText;
