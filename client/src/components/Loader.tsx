import React from "react";

type LoaderProps = {
  fullscreen?: boolean;
  size?: number;
  label?: string;
};

export default function Loader({ fullscreen = false, size = 120, label }: LoaderProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <img
        src="/loader.svg"
        width={size}
        height={size}
        alt="Loading"
        className="animate-spin-slow [animation-duration:1200ms]"
      />
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}
