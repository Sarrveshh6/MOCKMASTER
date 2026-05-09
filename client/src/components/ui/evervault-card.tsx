import { useMotionValue, useMotionTemplate, motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { cn } from "../../lib/utils";

export const EvervaultCard = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  const [randomString, setRandomString] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let str = generateRandomString(1500);
    setRandomString(str);
  }, []);

  function onMouseMove({ currentTarget, clientX, clientY }: any) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);

    const str = generateRandomString(1500);
    setRandomString(str);
  }

  return (
    <div
      onMouseMove={onMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative overflow-hidden inline-flex items-center justify-center bg-black rounded-xl border border-white/10 transition-all duration-300",
        className
      )}
      style={{
        width: "fit-content",
        isolation: "isolate"
      }}
    >
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{ opacity: isHovered ? 1 : 0, zIndex: 0 }}
      >
        <CardPattern
          mouseX={mouseX}
          mouseY={mouseY}
          randomString={randomString}
        />
      </div>
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, {
              style: {
                ...(child.props.style || {}),
                background: "transparent",
                backgroundColor: "transparent",
                color: "#fff", // Force text color to white for visibility
              },
            });
          }
          return child;
        })}
      </div>
    </div>
  );
};

export function CardPattern({ mouseX, mouseY, randomString }: any) {
  let maskImage = useMotionTemplate`radial-gradient(250px at ${mouseX}px ${mouseY}px, white, transparent)`;
  let style = { maskImage, WebkitMaskImage: maskImage };

  return (
    <div className="w-full h-full">
      <motion.div className="absolute inset-0" style={style}>
        <div 
          className="absolute inset-0" 
          style={{ background: "linear-gradient(120deg, #22c55e 0%, #10b981 100%)", opacity: 0.8 }} 
        />
      </motion.div>
      <motion.div
        className="absolute inset-0 mix-blend-overlay"
        style={style}
      >
        <p className="absolute inset-x-0 text-[10px] sm:text-xs h-full break-words whitespace-pre-wrap text-white font-mono font-bold leading-tight opacity-100">
          {randomString}
        </p>
      </motion.div>
    </div>
  );
}

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
export const generateRandomString = (length: number) => {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const Icon = ({ className, ...rest }: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
};
