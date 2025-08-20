import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const PageWrapper = ({ children }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full h-full"
    >
      {children}
    </motion.div>
  );
};

export default PageWrapper;
