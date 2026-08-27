'use client'

import { motion } from 'framer-motion'
import { Phone } from 'lucide-react'
import { useCallModal } from '@/src/components/call-modal/CallModalContext'
import { cn } from '@/src/lib/utils'

interface CallNowButtonProps {
    variant?: 'light' | 'dark'
    /** Extra Tailwind classes merged onto the button — can override padding, size, etc. */
    className?: string
}

const CallNowButton = ({ variant = 'light', className }: CallNowButtonProps) => {
    const { open } = useCallModal()
    const isDark = variant === 'dark'

    return (
        <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={open}
            aria-haspopup="dialog"
            className={cn(
                // Default height matches BookingButton: px-8 py-4 text-sm sm:text-base md:text-xl
                'inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-sm sm:text-base md:text-xl transition-all shadow-sm whitespace-nowrap',
                isDark
                    ? 'bg-white/10 backdrop-blur-md border-2 border-white/20 text-white hover:bg-white/20 hover:border-white/40'
                    : 'bg-white border-2 border-primary-600/20 text-[#165197] hover:bg-primary-50 hover:border-primary-600/40',
                className
            )}
        >
            <motion.span
                animate={{
                    rotate: [0, 14, -14, 10, -10, 6, -6, 0, 0, 0, 0],
                    scale: [1, 1.15, 1.15, 1, 1, 1],
                }}
                transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: 'linear',
                    times: [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.5, 0.7, 1],
                }}
                className="inline-flex"
            >
                <Phone className={`w-4 h-4 shrink-0 ${isDark ? 'text-white' : 'text-[#165197]'}`} />
            </motion.span>
            <span>Call Now</span>
        </motion.button>
    )
}

export default CallNowButton
