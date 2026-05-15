import type { ReactNode } from "react";
import { motion } from "framer-motion";

type Props = {
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function PageHeader({ title, description, actions }: Props) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">
          {title}
        </h2>
        {description && (
          <p className="text-base text-muted-foreground mt-2 max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </motion.div>
      {actions && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex items-center gap-3 flex-wrap"
        >
          {actions}
        </motion.div>
      )}
    </div>
  );
}
