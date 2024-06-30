import React, { useState, useRef, useEffect } from "react";
import TooltipContent from "./TooltipContent";

interface HoverTooltipProps {
  children: React.ReactNode;
  tooltipText: string;
}

const HoverTooltip: React.FC<HoverTooltipProps> = ({ children, tooltipText}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const handleClick = () => {
    setShowTooltip(!showTooltip);
  };

  const handleClose = () => {
    setShowTooltip(false);
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
      setShowTooltip(false);
    }
  };

  useEffect(() => {
    if (showTooltip) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showTooltip]);

  return (
    <span className="relative group" onClick={handleClick}>
      <span className="hover:underline inline-block break-words">{children}</span>
      {showTooltip && (
        <TooltipContent
          ref={tooltipRef}
          text={tooltipText}
          onClose={handleClose}
          position={{ top: "100%", left: "50%", transform: "translateX(-50%)" }}
        />
      )}
    </span>
  );
};

export default HoverTooltip;
