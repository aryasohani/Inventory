import React from "react";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:glass group-[.toaster]:text-foreground group-[.toaster]:border-white/10 group-[.toaster]:shadow-2xl group-[.toaster]:rounded-2xl",
          description:
            "group-[.toast]:text-muted-foreground font-medium",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground font-bold rounded-xl",
          cancelButton:
            "group-[.toast]:bg-white/5 group-[.toast]:text-muted-foreground font-bold rounded-xl",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };