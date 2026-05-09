import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "../../lib/utils";
import { GlowCard } from './spotlight-card';

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
}

const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ text = "Button", className, ...props }, ref) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <GlowCard customSize={true} glowColor="green"><button
      ref={ref}
      onMouseEnter={(e) => {
        setIsHovered(true);
        if (props.onMouseEnter) props.onMouseEnter(e);
      }}
      onMouseLeave={(e) => {
        setIsHovered(false);
        if (props.onMouseLeave) props.onMouseLeave(e);
      }}
      className={cn(
        "relative cursor-pointer overflow-hidden rounded-full border border-white/10 py-2.5 px-6 text-center font-semibold shadow-sm",
        className
      )}
      {...props}
    >
      <span 
        className="inline-block relative z-10"
        style={{
          transition: "all 0.3s ease-in-out",
          transform: isHovered ? "translateX(48px)" : "translateX(0px)",
          opacity: isHovered ? 0 : 1,
          color: isHovered ? "#ffffff" : "inherit"
        }}
      >
        {text}
      </span>
      <div 
        className="absolute top-0 left-0 z-10 flex h-full w-full items-center justify-center gap-2"
        style={{
          transition: "all 0.3s ease-in-out",
          transform: isHovered ? "translateX(0px)" : "translateX(48px)",
          opacity: isHovered ? 1 : 0,
          color: "#ffffff"
        }}
      >
        <span>{text}</span>
        <ArrowRight className="w-5 h-5 block" />
      </div>
      <div 
        className="absolute rounded-full z-0"
        style={{
          background: "linear-gradient(135deg, #a855f7, #3b82f6)",
          transition: "all 0.4s ease-in-out",
          left: isHovered ? "0%" : "50%",
          top: isHovered ? "0%" : "50%",
          width: isHovered ? "100%" : "12px",
          height: isHovered ? "100%" : "12px",
          transform: isHovered ? "translate(0%, 0%) scale(1.5)" : "translate(-50%, -50%) scale(1)",
        }}
      />
    </button></GlowCard>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";

export { InteractiveHoverButton };
