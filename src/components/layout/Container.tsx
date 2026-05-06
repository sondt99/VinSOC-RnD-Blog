import type { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  narrow?: boolean;
}

export function Container({ children, className = "", narrow = false }: ContainerProps) {
  const maxW = narrow ? "max-w-[820px]" : "max-w-[1040px]";
  return (
    <div className={`${maxW} mx-auto px-5 w-full ${className}`}>
      {children}
    </div>
  );
}
