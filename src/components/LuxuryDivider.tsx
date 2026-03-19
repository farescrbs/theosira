import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

interface LuxuryDividerProps {
  variant?: "default" | "centered" | "minimal";
}

export function LuxuryDivider({ variant = "default" }: LuxuryDividerProps) {
  if (variant === "minimal") {
    return (
      <div className="flex items-center justify-center my-8">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "100px" }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"
        />
      </div>
    );
  }

  if (variant === "centered") {
    return (
      <div className="flex items-center justify-center gap-4 my-12">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "60px" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="h-px bg-gradient-to-r from-transparent to-[#d4af37]"
        />
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Sparkles className="text-[#d4af37]" size={20} />
        </motion.div>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "60px" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="h-px bg-gradient-to-l from-transparent to-[#d4af37]"
        />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 my-8">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: "40px" }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="h-px bg-gradient-to-r from-transparent to-[#d4af37]"
      />
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="w-1.5 h-1.5 bg-[#d4af37] rounded-full"
      />
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="w-1.5 h-1.5 bg-[#d4af37] rounded-full"
      />
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="w-1.5 h-1.5 bg-[#d4af37] rounded-full"
      />
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: "100%" }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="flex-1 h-px bg-gradient-to-r from-[#d4af37] to-transparent"
      />
    </div>
  );
}
