"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone } from "lucide-react";
import { useCallModal } from "./CallModalContext";
import { CLINIC_INFO } from "@/src/lib/constants/contact";
import { useMobileAnimation } from "@/src/hooks/useMobileAnimation";
import {
  formatPhoneNumber,
  generateTelLink,
} from "@/src/lib/email/templates/helpers";

const phones = [{ number: CLINIC_INFO.phone1 }, { number: CLINIC_INFO.phone2 }];

export function CallModal() {
  const { isOpen, close } = useCallModal();
  const { shouldSimplify } = useMobileAnimation();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="call-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            className={`fixed inset-0 z-[200] bg-black/40 ${shouldSimplify ? '' : 'backdrop-blur-sm'}`}
            aria-hidden="true"
          />

          <div className={`fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none transition-all duration-300 ${isOpen ? 'visible' : 'invisible'}`}>
            <motion.div
              key="call-panel"
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              role="dialog"
              aria-modal="true"
              aria-label="Call us"
              className="relative w-full max-w-xs bg-white rounded-3xl shadow-2xl pointer-events-auto overflow-hidden"
            >
              {/* Close */}
              <button
                onClick={close}
                aria-label="Close"
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors z-10"
              >
                <X className="w-4 h-4 text-neutral-500" />
              </button>

              {/* Header */}
              <div className="pt-8 pb-5 px-6 text-center">
                {/* Animated phone icon */}
                <div className="relative inline-flex items-center justify-center mb-4">
                  {/* Expanding rings */}
                  {/* Expanding rings — Disable on mobile/low-cpu to save power */}
                  {!shouldSimplify && [0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full border-2 border-primary-400/40"
                      style={{ width: 56, height: 56 }}
                      animate={{ scale: [1, 2.2], opacity: [0.5, 0] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.6,
                        ease: "easeOut",
                      }}
                    />
                  ))}
                  {/* Icon circle */}
                  <motion.div
                    className="relative z-10 w-14 h-14 rounded-full bg-gradient-to-br from-[#1E3A5F] to-[#2B5A8E] flex items-center justify-center shadow-lg shadow-primary-600/30"
                    animate={shouldSimplify ? {} : {
                      rotate: [0, 14, -14, 10, -10, 6, -6, 0, 0, 0, 0],
                      scale: [1, 1.12, 1.12, 1, 1, 1],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "linear",
                      times: [
                        0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.5, 0.7, 1,
                      ],
                    }}
                  >
                    <Phone className="w-6 h-6 text-white" />
                  </motion.div>
                </div>

                <h2 className="text-lg font-bold text-[#165197]">
                  How can we help?
                </h2>
              </div>

              {/* Phone options */}
              <div className="px-5 pb-6 flex flex-col gap-3">
                {phones.map(({ number }) => (
                  <a
                    key={number}
                    href={generateTelLink(number)}
                    onClick={close}
                    className="group flex items-center gap-4 px-4 py-3.5 rounded-2xl border border-primary-100 bg-primary-50/50 hover:bg-[#165197] hover:border-[#165197] transition-all duration-200"
                  >
                    <Phone className="w-4 h-4 text-primary-300 group-hover:text-white/60 shrink-0 transition-colors" />
                    <span className="text-base font-extrabold text-[#165197] group-hover:text-white transition-colors tracking-tight">
                      {formatPhoneNumber(number)}
                    </span>
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
