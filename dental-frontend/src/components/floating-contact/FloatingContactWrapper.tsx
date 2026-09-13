/**
 * Floating Contact Wrapper Component
 * 
 * Always-visible contact system with continuous "living UI" animations
 * Now fetches contact methods from CMS API
 */

"use client";

import { useEffect } from "react";
import { FloatingButtonItem } from "./FloatingButtonItem";
import { ScrollTopButton } from "./ScrollTopButton";
import type { ContactMethod } from "@/src/types/strapi";
import { MotionDiv } from "@/src/components/ui/MotionDiv";

interface FloatingContactWrapperProps {
  contactMethods: ContactMethod[];
}

export function FloatingContactWrapper({ contactMethods }: FloatingContactWrapperProps) {
  useEffect(() => {
  }, [contactMethods]);
  
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1]
      }}
      className="fixed right-6 bottom-6 z-50 flex flex-col items-end gap-3"
    >
      {/* Contact Buttons - Always Visible */}
      <div className="flex flex-col items-end gap-3">
        {contactMethods.map((item, index) => (
          <FloatingButtonItem
            key={`${item.id || item.type}-${index}`}
            item={item}
            index={index}
          />
        ))}
      </div>

      {/* Scroll to Top Button */}
      <ScrollTopButton 
        label="Back to top"
        index={contactMethods.length}
      />
    </MotionDiv>
  );
}

// Responsive adjustments for mobile
export function FloatingContactWrapperMobile({ contactMethods }: FloatingContactWrapperProps) {
  return (
    <div className="md:hidden">
      <style jsx>{`
        .floating-contact-mobile .w-14 {
          width: 3rem; /* 48px */
        }
        .floating-contact-mobile .h-14 {
          height: 3rem; /* 48px */
        }
        .floating-contact-mobile .gap-3 {
          gap: 0.5rem; /* 8px */
        }
        .floating-contact-mobile .right-6 {
          right: 1rem; /* 16px */
        }
        .floating-contact-mobile .bottom-6 {
          bottom: 1rem; /* 16px */
        }
      `}</style>
      <div className="floating-contact-mobile">
        <FloatingContactWrapper contactMethods={contactMethods} />
      </div>
    </div>
  );
}
